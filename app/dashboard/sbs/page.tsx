import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";

const plans = [
  {
    name: "Starter Plan",
    description: "Simplified plans (Payroll Deduction IRAs) with limited features and easy administration.",
    original: "$950",
    member: "$475",
    extra: "+ $40 annual per active participant",
    features: [
      "Up to $7,500 employee contribution limit",
      "No employer contributions",
      "Automatic enrollment with auto-escalation to encourage participation",
    ],
  },
  {
    name: "Core Plan",
    description: "A SIMPLE IRA with A.I. features and more plan design options.",
    original: "$1,950",
    member: "$975",
    extra: "+ $40 annual per active participant",
    features: [
      "Employer and employee contributions",
      "Free design assistance from a retirement plan consultant",
      "Up to $17,000 employee contribution*",
    ],
    popular: true,
  },
  {
    name: "Enterprise Plan",
    description: "Advanced plan administration with premium support.",
    original: "$3,950",
    member: "$1,975",
    extra: "+ percentage-based pricing, capped at 0.95%",
    features: [
      "Premium support for plan administrators and employees",
      "Support for plan transfers",
      "Up to $24,500 employee contribution, plus employer contributions and profit-sharing",
    ],
  },
];

export default async function SBSPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_status")
    .eq("id", user.id)
    .single();

  if (profile?.membership_status !== "active") redirect("/dashboard");

  return (
    <div className="pro-dashboard service-page">
      <header className="service-header">
        <div className="pro-shell service-header-inner">
          <Link href="/dashboard" className="service-brand">
            <img src="/member-assets/ira-club-logo.png" alt="IRA Club" />
            <span>Investor&apos;s Pro</span>
          </Link>
          <Link href="/dashboard" className="service-back">← Back to Dashboard</Link>
        </div>
      </header>

      <main className="pro-shell service-content">
        <section className="service-intro">
          <div className="service-intro-main">
            <img className="service-sbs-logo" src="/member-assets/sbs.png" alt="IRA Club SBS" />
            <h1>Save 50% on your small business plan</h1>
          </div>
          <button className="service-outline-button" disabled title="Webinar coming soon">
            VIEW WEBINAR — COMING SOON
          </button>
        </section>

        <nav className="service-plan-types" aria-label="Retirement plan types">
          {[
            "Payroll Deductible IRA",
            "SIMPLE IRA",
            "SEP IRA",
            "Solo 401(k)",
            "Traditional & Roth 401(k)",
            "Safe Harbor 401(k)",
          ].map((type) => <span key={type}>{type}</span>)}
        </nav>

        <section className="service-overview">
          <p>
            IRA Club SBS builds and administers retirement plans for small business owners
            from a simple payroll-deduction IRA to a full 401(k) with employer matching.
            As an Investor&apos;s Pro member, you get 50% off every plan tier for as long
            as your business is enrolled.
          </p>
          <ul>
            <li>Low-maintenance plans with built-in compliance and payroll integration.</li>
            <li>Access to alternative investment options and AI-driven investing tools.</li>
            <li>Flat, predictable annual pricing with reliable human support.</li>
          </ul>
        </section>

        <section className="service-rate-panel">
          <h2>Member Rate Details</h2>
          <div className="service-rate-row"><span>Standard Rate</span><strong>Set by Plan Tier</strong></div>
          <div className="service-rate-row"><span>Investor&apos;s Pro Rate</span><strong className="service-blue">50% off all plans</strong></div>
          <div className="service-rate-row"><span>Redeem</span><span className="service-pending">Schedule a Discovery Call — Coming Soon</span></div>
        </section>

        <section className="service-pricing">
          {plans.map((plan) => (
            <article key={plan.name} className={`service-plan-card ${plan.popular ? "service-popular" : ""}`}>
              {plan.popular && <div className="service-popular-label">Most Popular</div>}
              <h2>{plan.name}</h2>
              <p>{plan.description}</p>
              <div className="service-price">
                <del>{plan.original}</del> <strong>{plan.member}</strong> <span>/annually</span>
              </div>
              <p className="service-price-extra">{plan.extra}</p>
              <ul>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            </article>
          ))}
        </section>

        <p className="service-footnote">
          *SIMPLE IRA employee deferral limits are $17,000 for most plans and $18,100
          for plans with 25 or fewer employees for 2026.
        </p>

        <section className="service-cta">
          <h2>Ready to Redeem Your Member Discount?</h2>
          <p>
            The only way to enroll is by scheduling a discovery call.
            A plan consultant will confirm which plan type and tier fit your
            business, then apply your 50% Investor&apos;s Pro rate.
          </p>
          <button disabled>Schedule a Discovery Call — Coming Soon</button>
        </section>
      </main>
    </div>
  );
}
