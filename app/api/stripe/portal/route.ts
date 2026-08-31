import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "../../../../lib/supabase/server";
import { createAdminClient } from "../../../../lib/supabase/admin";

export const runtime = "nodejs";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Portal auth error:", userError);

      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    const admin = createAdminClient();

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("stripe_customer_id, membership_status")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile lookup error:", profileError);

      return NextResponse.json(
        { error: "Unable to find membership profile." },
        { status: 500 }
      );
    }

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No Stripe customer is connected to this membership." },
        { status: 400 }
      );
    }

    const stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY!
    );

    const session =
      await stripe.billingPortal.sessions.create({
        customer: profile.stripe_customer_id,
        return_url: `${
          process.env.NEXT_PUBLIC_SITE_URL ||
          "http://localhost:3000"
        }/dashboard`,
        configuration:
          process.env.STRIPE_PORTAL_CONFIGURATION_ID,
      });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe portal error:", error);

    return NextResponse.json(
      {
        error: "Unable to open billing portal.",
      },
      { status: 500 }
    );
  }
}