"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { createAdminClient } from "../../lib/supabase/admin";
import Stripe from "stripe";

export async function signUp(formData: FormData) {
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!fullName || !email || password.length < 8) {
    redirect("/signup?error=" + encodeURIComponent(
      "Enter your name, email, and a password of at least 8 characters."
    ));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });

  if (error || !data.user) {
    redirect("/signup?error=" + encodeURIComponent(error?.message || "Unable to create account."));
  }

  const admin = createAdminClient();
  await admin.from("profiles").upsert({
    id: data.user.id,
    full_name: fullName,
    email,
    membership_status: "pending"
  });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/signup?error=${encodeURIComponent(
      "Payment was canceled. Your login was created, but member access is not active yet."
    )}`,
    metadata: { user_id: data.user.id },
    subscription_data: {
      metadata: { user_id: data.user.id }
    }
  });

  redirect(checkout.url!);
}
