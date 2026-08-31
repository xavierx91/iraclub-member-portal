import Link from "next/link";

export default function Header() {
  return (
    <>
      <div className="topbar">Exclusive services and resources for IRA Club clients.</div>
      <nav className="nav">
        <div className="container nav-inner">
          <Link className="brand" href="/">
            <span className="brand-mark">IRA</span>
            <span>IRA CLUB</span>
          </Link>
          <div className="nav-links">
            <Link href="/#benefits">Benefits</Link>
            <Link href="/#how-it-works">How It Works</Link>
            <Link href="/#pricing">Membership</Link>
          </div>
          <div className="nav-actions">
            <Link className="btn btn-outline" href="/login">Log In</Link>
            <Link className="btn btn-primary" href="/signup">Sign Up</Link>
          </div>
        </div>
      </nav>
    </>
  );
}
