import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";

export default async function CapitalQuestPage() {
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
          <div>
            <img className="service-capital-logo" src="/member-assets/capitalquest.jpg" alt="CapitalQuest" />
            <div className="service-pending">Website link coming soon</div>
          </div>
          <button className="service-outline-button" disabled>VIEW WEBINAR — COMING SOON</button>
        </section>

        <section className="service-overview">
          <h2>Company Overview</h2>
          <p>
            CapitalQuest AI provides individual self-directed IRA investors with structured,
            documented analysis of alternative investment opportunities they are considering.
            The platform evaluates an opportunity against defined criteria and returns a
            transparent, documented assessment, showing the assumptions, facts, and uncertainties
            behind its analysis, to support each member&apos;s own independent evaluation and
            due diligence. The full-feature subscription includes unlimited access to the
            platform&apos;s analysis tools.
          </p>
        </section>

        <section className="service-overview">
          <h2>How Capital Quest Supports IRA Club Members</h2>
          <ul>
            <li>Analyze alternative investments with structured, criteria-based AI analysis.</li>
            <li>Support your due diligence with transparent reports showing facts, assumptions, and uncertainties.</li>
            <li>Evaluate more opportunities with unlimited access to CapitalQuest AI&apos;s analysis tools.</li>
          </ul>
        </section>

        <section className="service-rate-panel">
          <h2>Member Rate Details</h2>
          <div className="service-rate-row"><span>Standard Rate</span><strong>$497/mo</strong></div>
          <div className="service-rate-row"><span>Investor&apos;s Pro Rate</span><strong className="service-blue">FREE</strong></div>
          <div className="service-rate-row">
            <span>Redeem</span>
            <span className="service-pending">Member access credentials pending</span>
          </div>
          <button disabled>LOG IN TO CAPITALQUEST — COMING SOON</button>
        </section>

        <section className="service-contact">
          <h2>Connect with Capital Quest</h2>
          <div className="service-contact-inner">
            <div className="service-photo-placeholder">Photo coming soon</div>
            <div>
              <h3>Cynthia Davis</h3>
              <p>Founder &amp; CEO of Capital Quest</p>
              <a href="mailto:Cynthia.davis@pitchtank.ai" className="service-contact-button">
                CONNECT WITH CYNTHIA
              </a>
              <p><a href="mailto:Cynthia.davis@pitchtank.ai">Cynthia.davis@pitchtank.ai</a></p>
            </div>
          </div>
        </section>
      </main>

      <footer className="service-footer">
        <div className="pro-shell">
          <p>
            *Provided for educational and informational purposes only. CapitalQuest AI does
            not provide investment, legal, tax, or financial advice and does not recommend,
            endorse, or guarantee any investment. All investment decisions remain solely
            those of the member.
          </p>
          <p>
            The Investor&apos;s Pro member benefit applies to the standard full-feature monthly
            subscription ($497/month reduced to free), for eligible IRA Club members in good
            standing whose eligibility is verified through the IRA Club portal.
          </p>
          <p>Exclusions &amp; Restrictions — Details coming soon</p>
        </div>
      </footer>
    </div>
  );
}
