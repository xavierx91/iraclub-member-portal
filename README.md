# IRAClub.net Paid Client Portal

A starter production-style website for **iraclub.net** with:

- IRA Club-inspired public landing page
- Client signup
- Secure Supabase authentication
- Stripe Checkout payment
- Automatic access activation via Stripe webhook
- Protected member dashboard
- Responsive design
- Ready for Vercel hosting

## 1. Install locally

Install Node.js 20+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## 2. Create Supabase project

1. Go to https://supabase.com and create a project.
2. Open **SQL Editor**.
3. Paste the contents of `supabase.sql` and run it.
4. Open **Project Settings > API**.
5. Copy:
   - Project URL -> `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service role key -> `SUPABASE_SERVICE_ROLE_KEY`
6. Keep the service role key private. Never put it in browser-side code.

For the simplest first test, in Supabase Auth settings you may leave email confirmation OFF.
Before public launch, email verification is recommended.

## 3. Create Stripe service/payment

1. Go to https://dashboard.stripe.com.
2. Stay in **Test mode** while building.
3. Create a Product for the service you are selling.
4. Add a recurring Price billed yearly at $299/year.
5. Copy its `price_...` ID to `STRIPE_PRICE_ID`.
6. Copy your Stripe test secret key to `STRIPE_SECRET_KEY`.
7. Set:
   - `NEXT_PUBLIC_SERVICE_NAME`
   - `NEXT_PUBLIC_SERVICE_PRICE_LABEL`

This starter is configured for a **recurring annual subscription** at $299/year.

## 4. Configure Stripe webhook

For local testing you can use Stripe CLI.

For Vercel/public testing, create a webhook endpoint in Stripe:

`https://YOUR-DOMAIN.com/api/stripe/webhook`

Subscribe to:

`checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, and `customer.subscription.deleted`

Copy the webhook signing secret (`whsec_...`) to:

`STRIPE_WEBHOOK_SECRET`

The webhook changes the Supabase `membership_status` from `pending` to `active`.

## 5. Deploy to Vercel

1. Put this project in GitHub.
2. Go to https://vercel.com and choose **Add New > Project**.
3. Import the GitHub repository.
4. Add all environment variables from `.env.example`.
5. Change `NEXT_PUBLIC_SITE_URL` to the Vercel URL.
6. Deploy.

Test signup, Stripe payment and login before connecting iraclub.net.

## 6. Connect iraclub.net

After the Vercel version is approved:

1. In Vercel open **Project > Settings > Domains**.
2. Add:
   - `iraclub.net`
   - `www.iraclub.net`
3. Vercel will show the exact DNS records it wants.
4. In your domain registrar, click **Manage DNS**.
5. Add the records Vercel gives you.
6. Do NOT use "Forward Domain".
7. Once verified, Vercel automatically enables HTTPS/SSL.
8. Change `NEXT_PUBLIC_SITE_URL=https://iraclub.net` and redeploy.
9. Update the Stripe webhook URL to:
   `https://iraclub.net/api/stripe/webhook`

## Important before launch

- Replace the text-based placeholder logo with the approved IRA Club logo.
- Replace placeholder membership copy with the exact service name, price and included benefits.
- Add Terms, Privacy Policy and refund/cancellation language appropriate to the service.
- Test successful, canceled and failed payment flows.
- Turn on appropriate Supabase email verification/password recovery.
- If payment is recurring, change Stripe Checkout to subscription mode and handle subscription cancellation/payment failure webhooks.

## Project structure

- `app/page.tsx` – homepage
- `app/signup` – signup and Stripe checkout
- `app/login` – member login
- `app/dashboard` – protected paid-client area
- `app/api/stripe/webhook` – payment activation
- `supabase.sql` – database setup
- `.env.example` – required secrets/config


## Member perk links

Edit the `perks` array in `app/dashboard/page.tsx` and replace each `href: "#"` with the real private/member partner URL.
