import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "../../../../lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing signature", {
      status: 400,
    });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature error:", error);

    return new NextResponse("Invalid signature", {
      status: 400,
    });
  }

  const admin = createAdminClient();

  try {
    /*
     * ==========================================================
     * CHECKOUT COMPLETED
     * ==========================================================
     */
    if (event.type === "checkout.session.completed") {
      const session =
        event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.user_id;

      if (!userId) {
        console.error(
          "Checkout completed but user_id metadata is missing."
        );

        return new NextResponse("Missing user ID", {
          status: 400,
        });
      }

      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id || null;

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id || null;

      let periodEnd: string | null = null;
      let cancelAtPeriodEnd = false;

      if (subscriptionId) {
        const subscription =
          await stripe.subscriptions.retrieve(
            subscriptionId
          );

        cancelAtPeriodEnd =
          subscription.cancel_at_period_end;

        /*
         * If Stripe has an explicit cancel_at timestamp,
         * use it as the access-through date.
         */
        if (subscription.cancel_at) {
          periodEnd = new Date(
            subscription.cancel_at * 1000
          ).toISOString();
        }
      }

      const { error } = await admin
        .from("profiles")
        .update({
          membership_status: "active",
          stripe_customer_id: customerId,
          stripe_checkout_session_id: session.id,
          stripe_subscription_id: subscriptionId,
          subscription_current_period_end: periodEnd,
          cancel_at_period_end: cancelAtPeriodEnd,
        })
        .eq("id", userId);

      if (error) {
        console.error(
          "Checkout profile activation error:",
          error
        );

        return new NextResponse(
          "Database update failed",
          {
            status: 500,
          }
        );
      }

      console.log(
        `Membership activated for user ${userId}`
      );
    }

    /*
     * ==========================================================
     * SUBSCRIPTION UPDATED
     * ==========================================================
     */
    if (
      event.type ===
      "customer.subscription.updated"
    ) {
      const subscription =
        event.data.object as Stripe.Subscription;

      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      /*
       * When cancellation is scheduled Stripe gives us
       * an explicit cancel_at Unix timestamp.
       */
      const accessThrough =
        subscription.cancel_at
          ? new Date(
              subscription.cancel_at * 1000
            ).toISOString()
          : null;

      const membershipStatus =
        subscription.status === "active" ||
        subscription.status === "trialing"
          ? "active"
          : subscription.status === "canceled"
          ? "cancelled"
          : "inactive";

      const { error } = await admin
        .from("profiles")
        .update({
          membership_status: membershipStatus,

          stripe_subscription_id:
            subscription.id,

          cancel_at_period_end:
            subscription.cancel_at_period_end,

          subscription_current_period_end:
            accessThrough,
        })
        .eq(
          "stripe_customer_id",
          customerId
        );

      if (error) {
        console.error(
          "Subscription update error:",
          error
        );

        return new NextResponse(
          "Database update failed",
          {
            status: 500,
          }
        );
      }

      console.log(
        `Subscription updated: ${subscription.id}`
      );

      console.log(
        `Cancel at period end: ${subscription.cancel_at_period_end}`
      );

      console.log(
        `Access through: ${accessThrough}`
      );
    }

    /*
     * ==========================================================
     * SUBSCRIPTION DELETED
     * ==========================================================
     */
    if (
      event.type ===
      "customer.subscription.deleted"
    ) {
      const subscription =
        event.data.object as Stripe.Subscription;

      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      const { error } = await admin
        .from("profiles")
        .update({
          membership_status: "cancelled",
          cancel_at_period_end: false,
          subscription_current_period_end: null,
        })
        .eq(
          "stripe_customer_id",
          customerId
        );

      if (error) {
        console.error(
          "Subscription cancellation error:",
          error
        );

        return new NextResponse(
          "Database update failed",
          {
            status: 500,
          }
        );
      }

      console.log(
        `Membership cancelled for ${customerId}`
      );
    }

    /*
     * ==========================================================
     * INVOICE PAID
     * ==========================================================
     *
     * A successful renewal/payment keeps access active.
     */
    if (event.type === "invoice.paid") {
      const invoice =
        event.data.object as Stripe.Invoice;

      const customerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id || null;

      if (customerId) {
        const subscriptions =
          await stripe.subscriptions.list({
            customer: customerId,
            status: "active",
            limit: 1,
          });

        const subscription =
          subscriptions.data[0];

        if (subscription) {
          const accessThrough =
            subscription.cancel_at
              ? new Date(
                  subscription.cancel_at * 1000
                ).toISOString()
              : null;

          const { error } = await admin
            .from("profiles")
            .update({
              membership_status: "active",

              stripe_subscription_id:
                subscription.id,

              cancel_at_period_end:
                subscription.cancel_at_period_end,

              subscription_current_period_end:
                accessThrough,
            })
            .eq(
              "stripe_customer_id",
              customerId
            );

          if (error) {
            console.error(
              "Invoice paid update error:",
              error
            );

            return new NextResponse(
              "Database update failed",
              {
                status: 500,
              }
            );
          }
        }
      }
    }

    /*
     * ==========================================================
     * PAYMENT FAILED
     * ==========================================================
     */
    if (
      event.type ===
      "invoice.payment_failed"
    ) {
      const invoice =
        event.data.object as Stripe.Invoice;

      const customerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id || null;

      if (customerId) {
        const { error } = await admin
          .from("profiles")
          .update({
            membership_status: "inactive",
          })
          .eq(
            "stripe_customer_id",
            customerId
          );

        if (error) {
          console.error(
            "Payment failure update error:",
            error
          );

          return new NextResponse(
            "Database update failed",
            {
              status: 500,
            }
          );
        }
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Stripe webhook processing error:",
      error
    );

    return new NextResponse(
      "Webhook processing failed",
      {
        status: 500,
      }
    );
  }
}