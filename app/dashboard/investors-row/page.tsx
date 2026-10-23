import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

export default async function InvestorsRowPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_status")
    .eq("id", user.id)
    .single();

  if (profile?.membership_status !== "active") {
    redirect("/dashboard");
  }

  return (
    <div className="pro-dashboard service-page">
      <header className="service-header">
        <div className="pro-shell service-header-inner">
          <Link href="/dashboard" className="service-brand">
            <img src="/member-assets/ira-club-logo.png" alt="IRA Club" />
            <span>Investor&apos;s Pro</span>
          </Link>
          <Link href="/dashboard" className="service-back">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="pro-shell service-content">
        <section className="service-intro">
          <div className="service-intro-main">
            <img
              src="/member-assets/investors-row.png"
              alt="Investor's Row"
              className="service-sbs-logo"
            />
            <h1>Save $70 on your asset fee</h1>
          </div>
        </section>

        <section className="service-overview">
          <a
            href="#investors-row-opportunities"
            className="service-contact-button"
          >
            BROWSE OPPORTUNITIES
          </a>

          <p style={{ marginTop: 24 }}>
            Investor&apos;s Row is where your self-directed account meets
            real investment inspiration, with opportunities like real
            estate, private equity, oil and gas, and more. Invest in
            asset classes you already understand, ask the right
            questions, and get a direct line to the people behind
            each opportunity.
          </p>
        </section>

        <section className="service-rate-panel">
          <h2>Member Rate Details</h2>

          <div className="service-rate-row">
            <span>Standard Rate</span>
            <strong>$195 asset fee</strong>
          </div>

          <div className="service-rate-row">
            <span>Investor&apos;s Pro Rate</span>
            <strong className="service-blue">$125 asset fee</strong>
          </div>

          <div className="service-rate-row">
            <span>Redeem</span>
            <a
              href="#investors-row-opportunities"
              className="service-contact-button"
            >
              Find an Investment
            </a>
          </div>
        </section>

        <section
          id="investors-row-opportunities"
          className="investors-row-embed-section"
        >
          <h2>Browse Alternative Options</h2>

          <p>
            Explore investment sponsors and opportunities directly
            through IRA Club&apos;s Investor&apos;s Row.
          </p>

          <iframe
            src="https://www.iraclub.com/investors-row/"
            title="IRA Club Investor's Row Opportunities"
            className="investors-row-iframe"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />

          <p className="investors-row-embed-fallback">
            If the embedded page does not display,{" "}
            <a
              href="https://www.iraclub.com/investors-row/"
              target="_blank"
              rel="noopener noreferrer"
            >
              open Investor&apos;s Row in a new tab.
            </a>
          </p>
        </section>

        <section className="investors-row-capitalquest">
          <h2>Pairs well with</h2>
          <h3>Free Due Diligence with CapitalQuest</h3>
          <p>
            Before you fund anything, Investor&apos;s Pro members
            get free access to CapitalQuest&apos;s AI-assisted due
            diligence tools to help support your independent evaluation.
          </p>
          <Link href="/dashboard/capitalquest">
            See your CapitalQuest benefit
          </Link>
        </section>

        <section className="service-cta">
          <h2>Ready to put your reduced fee to work?</h2>
          <p>
            Whether you&apos;re ready to fund with your reduced asset
            fee or have a question, our team can walk you through
            the investing process from start to finish.
          </p>
          <span className="service-pending">
            Schedule a Call with Investments — Coming Soon
          </span>
        </section>
      </main>
    </div>
  );
}
