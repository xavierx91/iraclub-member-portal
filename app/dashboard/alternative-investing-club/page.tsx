import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";
import styles from "../partner-benefit.module.css";

export default async function PartnerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("membership_status").eq("id", user.id).single();
  if (profile?.membership_status !== "active") redirect("/dashboard");
  return (
    <div className={`${styles.page} ${styles.aic}`}>
      <header className={styles.header}>
        <div className={styles.shell}>
          <img src="/member-assets/ira-club-logo.png" alt="IRA Club" className={styles.brand} />
          <Link href="/dashboard" className={styles.back}>Investor&apos;s Pro | Back to Dashboard</Link>
        </div>
      </header>
      <main className={styles.shell}>
        <section className={styles.hero}>
          <img src="/member-assets/alternative-investing-club.png" alt="Alternative Investing Club" className={styles.logo} />
          <h1>Alternative Investing Club</h1><p>Private Market Investment Opportunities</p>
        </section>
        <section className={styles.section}>
          <h2>Company Overview</h2>
          {["Alternative Investing Club is an active community on a mission to empower 10,000 families to achieve financial freedom through passive private market investments\u2014without taking unnecessary gambles. By combining our community\u2019s collective purchasing power with rigorous group due diligence and a data-driven underwriting framework, we help investors navigate private markets with confidence. We prioritize downside protection, transparent communication, and risk-adjusted returns, focusing on asset-backed strategies like private debt and cash-flowing commercial real estate to secure strong income while capturing long-term upside."].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
        <section className={styles.support}>
          <h2>How Alternative Investing Club Supports IRA Club Members</h2>
          <ul>{["Expand access to private market investments through collective purchasing power and institutional-level investment opportunities.", "Strengthen your due diligence with collaborative research evaluating sponsors, assets, financial structures, and potential risks.", "Explore diversification beyond traditional markets through private debt, cash-flowing commercial real estate, and other asset-backed investments."].map((point) => <li key={point}>{point}</li>)}</ul>
        </section>
        <section className={styles.team}>
          <h2>Meet the Team</h2>
          <div className={styles.teamGrid}>
            <article className={styles.person}><img src="/member-assets/aic-micy.jpg" alt="Micy Liu" /><h3>Micy Liu</h3></article>
          </div>
        </section>
        <Link href="/dashboard" className={styles.button}>Back to Member Benefits</Link>
      </main>
    </div>
  );
}
