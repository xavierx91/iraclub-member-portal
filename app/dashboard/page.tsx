import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { logout } from "../login/actions";
import ManageMembershipButton from "./ManageMembershipButton";
import EventsClient from "../components/EventsClient";

function formatDate(value: string | null | undefined) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

const benefits = [
  {
    name: "Investor's Row",
    offer: "$70 Off Your Asset Fee",
    description:
      "Discounted access to Investor's Row for browsing alternative asset opportunities for inspiration.",
    logo: null,
    href: "#",
  },
  {
    name: "IRA Club SBS",
    offer: "50% Off Any Small Business Plan",
    description:
      "50% off for members who are also small business owners who need a flexible, scalable retirement plan.",
    logo: "/member-assets/sbs.png",
    href: "#",
  },
  {
    name: "iFlip",
    offer: "Additional SmartFolios Access For Free",
    description:
      "Exclusive access to additional SmartFolio options not available to most.",
    logo: "/member-assets/iflip.png",
    href: "#",
  },
];

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      full_name,
      membership_status,
      subscription_current_period_end,
      cancel_at_period_end
    `)
    .eq("id", user.id)
    .single();

  const active = profile?.membership_status === "active";

  const accessThrough = formatDate(
    profile?.subscription_current_period_end
  );

  const cancelling =
    active && profile?.cancel_at_period_end === true;

  const firstName =
    profile?.full_name?.trim().split(" ")[0] ||
    user.email?.split("@")[0] ||
    "Member";

  return (
    <div className="pro-dashboard">
      {/* HEADER */}
      <header className="pro-header">
        <div className="pro-shell pro-header-inner">
          <div className="pro-brand">
            <div className="pro-brand-mark">IRA</div>

            <div>
              <strong>IRA CLUB</strong>
              <span>Investor&apos;s Pro</span>
            </div>
          </div>

          <div className="pro-header-actions">
            {active && <ManageMembershipButton />}

            <form action={logout}>
              <button className="pro-outline-button">
                Log Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main>
        {/* WELCOME */}
        <section className="pro-hero">
          <div className="pro-shell">
            <div className="pro-eyebrow">
              INVESTOR&apos;S PRO MEMBER PORTAL
            </div>

            <h1>
              Welcome, <span>{firstName}.</span>
            </h1>

            <div className="pro-membership-row">
              <div>
                <strong>Investor&apos;s Pro</strong>

                <p>
                  Your access to exclusive discounted pricing,
                  services, events, and more.
                </p>
              </div>

              <div
                className={
                  active
                    ? "pro-status active"
                    : "pro-status inactive"
                }
              >
                {active
                  ? "ACTIVE MEMBERSHIP"
                  : "MEMBERSHIP NOT ACTIVE"}
              </div>
            </div>

            {active && accessThrough && (
              <div className="pro-access-note">
                Access through{" "}
                <strong>{accessThrough}</strong>

                {cancelling && (
                  <span>
                    Your membership will not renew after this date.
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {active ? (
          <>
            {/* BENEFITS */}
            <section className="pro-section">
              <div className="pro-shell">
                <div className="pro-section-heading">
                  <span>START EXPLORING</span>

                  <h2>Your Member Benefits</h2>

                  <p>
                    Take a look around and find the services and
                    benefits that are right for you.
                  </p>
                </div>

                <div className="pro-benefit-grid">
                  {benefits.map((benefit) => (
                    <article
                      className="pro-benefit-card"
                      key={benefit.name}
                    >
                      <div className="pro-benefit-logo">
                        {benefit.logo ? (
                          <img
                            src={benefit.logo}
                            alt={benefit.name}
                          />
                        ) : (
                          <div className="investors-row-logo">
                            INVESTOR&apos;S
                            <strong>ROW</strong>
                          </div>
                        )}
                      </div>

                      <h3>{benefit.offer}</h3>

                      <p>{benefit.description}</p>

                      <a
                        className="pro-access-link"
                        href={benefit.href}
                      >
                        Access →
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* SUPPORT */}
            <section className="pro-support">
              <div className="pro-shell pro-support-inner">
                <div>
                  <span>NEED HELP?</span>

                  <h2>Questions about your benefits?</h2>

                  <p>
                    If you are having issues with discount codes or
                    have a question about what&apos;s included, our
                    team can help.
                  </p>
                </div>

                <div className="pro-support-buttons">
                  <a
                    href="#"
                    className="pro-light-button"
                  >
                    Schedule a Call
                  </a>

                  <a
                    href="mailto:info@iraclub.com"
                    className="pro-white-button"
                  >
                    Submit a Ticket
                  </a>
                </div>
              </div>
            </section>

            {/* EVENTS */}
            <section className="pro-section">
              <div className="pro-shell">
                <div className="pro-section-heading">
                  <span>MEMBER EXPERIENCES</span>

                  <h2>Events &amp; Live Sessions</h2>

                  <p>
                    Get free and member-rate access to educational
                    events on alternative investing and wealth
                    building, from livestreams to in-person
                    experiences.
                  </p>
                </div>

                {/* WORKING INTERACTIVE FILTERS */}
                <EventsClient />

                <p className="pro-disclaimer">
                  IRA Club is providing access and member pricing
                  as an educational benefit. IRA Club does not
                  endorse specific investments, sponsors, or
                  strategies discussed at these events.
                </p>
              </div>
            </section>

            {/* PARTNER BENEFITS */}
            <section className="pro-partners">
              <div className="pro-shell">
                <div className="pro-section-heading">
                  <span>EXCLUSIVE ACCESS</span>

                  <h2>
                    More Investor&apos;s Pro Benefits
                  </h2>
                </div>

                <div className="pro-partner-grid">
                  {/* CAPITALQUEST */}
                  <article className="pro-partner-card">
                    <img
                      src="/member-assets/capitalquest.jpg"
                      alt="CapitalQuest"
                    />

                    <h3>
                      Free Due Diligence with CapitalQuest
                    </h3>

                    <p>
                      Investor&apos;s Pro members get access to
                      CapitalQuest&apos;s AI-assisted due diligence
                      tools to support their independent evaluation
                      of alternative investment opportunities.
                    </p>

                    <a href="#">
                      See Your CapitalQuest Benefit →
                    </a>
                  </article>

                  {/* IFLIP */}
                  <article className="pro-partner-card">
                    <img
                      src="/member-assets/iflip.png"
                      alt="iFlip"
                    />

                    <h3>
                      Additional SmartFolios Access
                    </h3>

                    <p>
                      Access additional SmartFolio options available
                      as part of your Investor&apos;s Pro
                      membership.
                    </p>

                    <a href="#">
                      Access iFlip →
                    </a>
                  </article>

                  {/* SBS */}
                  <article className="pro-partner-card">
                    <img
                      src="/member-assets/sbs.png"
                      alt="IRA Club SBS"
                    />

                    <h3>
                      Save 50% on Your Small Business Plan
                    </h3>

                    <p>
                      Investor&apos;s Pro members receive 50% off
                      eligible IRA Club SBS small-business
                      retirement plan tiers.
                    </p>

                    <a href="#">
                      View SBS Benefit →
                    </a>
                  </article>
                </div>
              </div>
            </section>

            {/* SMARTFOLIO */}
            <section className="pro-section">
              <div className="pro-shell">
                <div className="pro-smartfolio">
                  <div className="pro-smartfolio-content">
                    <span>SMARTFOLIOS</span>

                    <h2>
                      More Investing Options for Members
                    </h2>

                    <p>
                      Investor&apos;s Pro members receive access to
                      additional SmartFolio options through iFlip.
                    </p>

                    <a
                      href="#"
                      className="pro-light-button"
                    >
                      Access SmartFolios
                    </a>
                  </div>

                  <div className="pro-smartfolio-image">
                    <img
                      src="/member-assets/smartfolio.png"
                      alt="SmartFolio"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* BILLING */}
            <section className="pro-account">
              <div className="pro-shell pro-account-inner">
                <div>
                  <span>YOUR ACCOUNT</span>

                  <h2>Manage Your Membership</h2>

                  {cancelling && accessThrough ? (
                    <p>
                      Your membership remains active through{" "}
                      <strong>{accessThrough}</strong> and will
                      not renew.
                    </p>
                  ) : (
                    <p>
                      Your Investor&apos;s Pro membership is
                      currently active at $299 per year.
                    </p>
                  )}
                </div>

                <ManageMembershipButton />
              </div>
            </section>
          </>
        ) : (
          <section className="pro-section">
            <div className="pro-shell">
              <div className="pro-inactive-card">
                <h2>
                  Your membership is not active.
                </h2>

                <p>
                  Member benefits become available after your
                  annual $299 membership payment is confirmed.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}