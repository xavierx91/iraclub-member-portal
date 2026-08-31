import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { logout } from "../login/actions";
import ManageMembershipButton from "./ManageMembershipButton";

const perks = [
  {
    name: "IRA Club Member Savings",
    kicker: "Exclusive Member Benefit",
    description:
      "Access IRA Club member-only pricing and savings available through Investor's Pro.",
    href: "#",
    linkLabel: "Open Member Savings",
  },
  {
    name: "CapitalQuest",
    kicker: "AI-Powered Due Diligence",
    description:
      "Access your Investor's Pro benefit for AI-powered due diligence tools and resources.",
    href: "#",
    linkLabel: "Access CapitalQuest",
  },
  {
    name: "iFlip",
    kicker: "AI-Powered Smartfolios",
    description:
      "Connect to the exclusive smartfolio offering available through your paid membership.",
    href: "#",
    linkLabel: "Access iFlip",
  },
  {
    name: "IRA Club Resource Center",
    kicker: "Guidance & Events",
    description:
      "Access member resources, education, events and expert guidance in one place.",
    href: "#",
    linkLabel: "Open Resource Center",
  },
];

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
    active &&
    profile?.cancel_at_period_end === true;

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="container dash-row">
          <div className="brand">
            <span className="brand-mark">IRA</span>
            <span>IRA CLUB</span>
          </div>

          <form action={logout}>
            <button className="btn btn-outline">
              Log Out
            </button>
          </form>
        </div>
      </header>

      <main className="container dash-main">
        <div className="welcome">
          <div className="eyebrow">
            Investor's Pro Member Portal
          </div>

          <h1>
            Welcome, {profile?.full_name || user.email}.
          </h1>

          <span className="status">
            {active
              ? "ACTIVE — $299/YEAR"
              : "MEMBERSHIP NOT ACTIVE"}
          </span>

          <p
            className="muted"
            style={{
              maxWidth: 720,
            }}
          >
            Your Investor's Pro membership gives you access to
            exclusive partner links, resources, savings and member
            perks.
          </p>

          {active && accessThrough && (
            <div
              style={{
                marginTop: "18px",
                padding: "16px 18px",
                background: cancelling
                  ? "#fff8e6"
                  : "#eef7df",
                borderRadius: "12px",
                maxWidth: "720px",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  color: "#0d3150",
                }}
              >
                Access through {accessThrough}
              </div>

              {cancelling ? (
                <div
                  style={{
                    marginTop: "5px",
                    color: "#8a5a00",
                    fontWeight: 700,
                  }}
                >
                  Your membership will not renew after this date.
                </div>
              ) : (
                <div
                  style={{
                    marginTop: "5px",
                    color: "#41610f",
                  }}
                >
                  Your annual membership is set to renew automatically.
                </div>
              )}
            </div>
          )}
        </div>

        {active ? (
          <>
            <div className="panel">
              <div className="eyebrow">
                Your Benefits
              </div>

              <h2>Investor's Pro Services</h2>

              <p className="muted">
                Use the cards below to connect directly with the
                services included with your membership.
              </p>

              <div className="member-grid">
                {perks.map((perk) => (
                  <article
                    className="member-card"
                    key={perk.name}
                  >
                    <div className="member-kicker">
                      {perk.kicker}
                    </div>

                    <h3>{perk.name}</h3>

                    <p>{perk.description}</p>

                    <a
                      className="member-link"
                      href={perk.href}
                      target={
                        perk.href === "#"
                          ? undefined
                          : "_blank"
                      }
                      rel={
                        perk.href === "#"
                          ? undefined
                          : "noreferrer"
                      }
                    >
                      {perk.linkLabel} →
                    </a>
                  </article>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="eyebrow">
                Membership
              </div>

              <h2>Your Annual Access</h2>

              {cancelling && accessThrough ? (
                <>
                  <p className="muted">
                    Your $299 annual membership remains active
                    through <strong>{accessThrough}</strong>.
                  </p>

                  <p
                    style={{
                      fontWeight: 700,
                      color: "#8a5a00",
                    }}
                  >
                    Your membership is scheduled to end and will
                    not renew.
                  </p>
                </>
              ) : (
                <p className="muted">
                  Your membership is currently active at $299 per
                  year and is set to renew automatically.
                </p>
              )}

              <p className="muted">
                Use Stripe's secure billing portal to update your
                payment method, view invoices, cancel your
                subscription or resume renewal.
              </p>

              <div
                style={{
                  marginTop: "20px",
                }}
              >
                <ManageMembershipButton />
              </div>
            </div>
          </>
        ) : (
          <div className="panel">
            <h2>
              Your membership is not active.
            </h2>

            <p className="muted">
              Access to member perks is unlocked only after
              the annual $299 payment is confirmed.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}