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
    <div className={`${styles.page} ${styles.anderson}`}>
      <header className={styles.header}>
        <div className={styles.shell}>
          <img src="/member-assets/ira-club-logo.png" alt="IRA Club" className={styles.brand} />
          <Link href="/dashboard" className={styles.back}>Investor&apos;s Pro | Back to Dashboard</Link>
        </div>
      </header>
      <main className={styles.shell}>
        <section className={styles.hero}>
          <img src="/member-assets/anderson.png" alt="Anderson Advisors" className={styles.logo} />
          <h1>Anderson Advisors</h1><p>Tax, Legal & Asset Protection Strategies</p>
        </section>
        <section className={styles.section}>
          <h2>Company Overview</h2>
          {["Anderson Advisors is a business planning and consulting firm helping entrepreneurs, investors, and business owners build, structure, and protect their financial futures. Founded in 1999, the firm provides legal, tax, and strategic planning services designed to help clients make informed decisions, protect their assets, and pursue long-term financial success.", "Serving real estate investors, stock traders, solopreneurs, and business owners nationwide, Anderson Advisors combines decades of experience with a nationwide team and global partnerships to deliver personalized planning and support. Its approach centers on helping clients Preserve, Protect, and Prosper."].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
        <section className={styles.support}>
          <h2>How Anderson Advisors Supports IRA Club Members</h2>
          <ul>{["Structure real estate investments and business ventures with strategic LLC formation, entity management, and legal planning.", "Develop proactive tax and asset protection strategies to help minimize tax burdens, manage liability, and safeguard investment assets.", "Build a stronger long-term financial foundation with estate planning, retirement strategies, and ongoing education through workshops and expert guidance."].map((point) => <li key={point}>{point}</li>)}</ul>
        </section>
        <section className={styles.team}>
          <h2>Meet the Team</h2>
          <div className={styles.teamGrid}>
            
            <article className={styles.person}>
  <img
    src="/member-assets/anderson-patti.png"
    alt="Patti Peery"
  />

  <h3>Patti Peery</h3>

  <p style={{ fontWeight: 600 }}>
    Affiliate Program Manager
  </p>

  <p>
    <a href="tel:+18007064741">
      1-800-706-4741
    </a>
  </p>

  <p style={{ overflowWrap: "anywhere" }}>
    <a href="mailto:affiliates@andersonadvisors.com">
      affiliates@andersonadvisors.com
    </a>
  </p>

  <p style={{ overflowWrap: "anywhere" }}>
    <a
      href="https://www.andersonadvisors.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      www.andersonadvisors.com
    </a>
  </p>
</article>
          </div>
        </section>
        <Link href="/dashboard" className={styles.button}>Back to Member Benefits</Link>
      </main>
    </div>
  );
}
