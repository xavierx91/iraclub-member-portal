import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { logout } from "../login/actions";
import ManageMembershipButton from "./ManageMembershipButton";
import EventsClient from "../components/EventsClient";
import BenefitsCarousel from "../components/BenefitsCarousel";

function formatDate(value: string | null | undefined) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

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
          <div className="pro-brand pro-brand-stacked">
  <img
    src="/member-assets/ira-club-logo.png"
    alt="IRA Club"
    className="pro-main-logo"
  />

  <span className="pro-investors-pro-label">
    Investor&apos;s Pro
  </span>
</div>

          <div className="pro-header-actions">
            {active && <ManageMembershipButton />}

            <form action={logout}>
              <button
                type="submit"
                className="pro-outline-button"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
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
            {/* ALL SERVICES ARE NOW HERE */}
            <section className="pro-section pro-benefits-section">
              <div className="pro-shell">
                <div className="pro-section-heading">
                  <span>START EXPLORING</span>

                  <h2>Your Member Benefits</h2>

                  <p>
                    Take a look around and find the services and
                    benefits that are right for you.
                  </p>
                </div>

                <BenefitsCarousel />
              </div>
            </section>

            {/* MEMBER HELP */}
            <section className="pro-support">
              <div className="pro-shell pro-support-inner">
                <div>
                  <span>NEED HELP?</span>

                  <h2>
                    Questions about your benefits?
                  </h2>

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

                  <h2>
                    Events &amp; Live Sessions
                  </h2>

                  <p>
                    Get free and member-rate access to educational
                    events on alternative investing and wealth
                    building, from livestreams to in-person
                    experiences.
                  </p>
                </div>

                {/* Keeps the working event filters */}
                <EventsClient />

                <p className="pro-disclaimer">
                  IRA Club is providing access and member pricing
                  as an educational benefit. IRA Club does not
                  endorse specific investments, sponsors, or
                  strategies discussed at these events.
                </p>
              </div>
            </section>

            {/* MEMBERSHIP ACCOUNT */}
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