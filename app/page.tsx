import Link from "next/link";
import Header from "../components/Header";

export default function Home() {
  const serviceName = process.env.NEXT_PUBLIC_SERVICE_NAME || "Investor's Pro Membership";
  const priceLabel = process.env.NEXT_PUBLIC_SERVICE_PRICE_LABEL || "$299/year";

  return (
    <>
      <Header />

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <div className="eyebrow">Exclusive Client Membership</div>
              <h1>More value. More access. One simple membership.</h1>
              <p>
                Join a dedicated client experience designed to make it easy to access
                your paid services, member resources and support in one secure place.
              </p>
              <div className="hero-buttons">
                <Link className="btn btn-primary" href="/signup">Become a Member</Link>
                <Link className="btn btn-outline" href="/login">Member Login</Link>
              </div>
            </div>

            <div className="hero-card">
              <div className="eyebrow">Member Access</div>
              <h3>Everything you need after you enroll.</h3>
              <div className="check"><span className="check-badge">✓</span><span>Secure personal login</span></div>
              <div className="check"><span className="check-badge">✓</span><span>Access activated after payment</span></div>
              <div className="check"><span className="check-badge">✓</span><span>Member-only resources and services</span></div>
              <div className="check"><span className="check-badge">✓</span><span>Easy billing and account management</span></div>
            </div>
          </div>
        </section>

        <section id="benefits" className="section">
          <div className="container">
            <div className="section-title">
              <div className="eyebrow">Featured Benefits</div>
              <h2>A cleaner way to serve your paid clients.</h2>
              <p>
                This first version is built as a standalone paid-client portal. It can
                grow later without connecting to Salesforce or InnoTrust.
              </p>
            </div>
            <div className="grid-3">
              <div className="feature"><h3>Secure Member Login</h3><p>Clients create their account and securely sign in to their private member area.</p></div>
              <div className="feature"><h3>Automatic Paid Access</h3><p>Stripe confirms successful payment before membership access is activated.</p></div>
              <div className="feature"><h3>Member Dashboard</h3><p>Give paying clients access to resources, links, downloads, instructions and support.</p></div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="section soft">
          <div className="container">
            <div className="section-title">
              <div className="eyebrow">How It Works</div>
              <h2>From signup to access in three steps.</h2>
            </div>
            <div className="grid-3">
              <div className="step"><div className="step-number">1</div><h3>Create an account</h3><p>The client signs up using their name, email and password.</p></div>
              <div className="step"><div className="step-number">2</div><h3>Complete payment</h3><p>The client is sent to secure Stripe Checkout to pay for the service.</p></div>
              <div className="step"><div className="step-number">3</div><h3>Access is activated</h3><p>Stripe's payment confirmation updates the member's access automatically.</p></div>
            </div>
          </div>
        </section>

        <section id="pricing" className="section">
          <div className="container">
            <div className="section-title">
              <div className="eyebrow">Membership</div>
              <h2>Built for members who want more.</h2>
              <p>Unlock exclusive services, partner resources and member perks for $299 per year.</p>
            </div>

            <div className="pricing-card">
              <div>
                <div className="eyebrow">Client Service</div>
                <h2>{serviceName}</h2>
                <p className="muted">Includes private member access plus exclusive partner links, resources, savings and member-only perks.</p>
              </div>
              <div>
                <div className="price">{priceLabel}</div>
                <div style={{height: 14}} />
                <Link className="btn btn-primary" href="/signup">Get Started</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="brand"><span className="brand-mark">IRA</span><span>IRA CLUB</span></div>
          <small>© {new Date().getFullYear()} IRA Club. All rights reserved.</small>
        </div>
      </footer>
    </>
  );
}
