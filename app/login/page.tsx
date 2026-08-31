import Link from "next/link";
import { login } from "./actions";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="auth-shell">
      <div className="auth-side">
        <div className="brand">
          <span
            className="brand-mark"
            style={{ borderColor: "#a8cf45", color: "#a8cf45" }}
          >
            IRA
          </span>
          <span>IRA CLUB</span>
        </div>

        <h1>Welcome back.</h1>

        <p>
          Sign in to access your paid client services and member resources.
        </p>
      </div>

      <div className="auth-main">
        <form className="auth-card" action={login}>
          <h2>Member login</h2>

          <div className="sub">
            Need access?{" "}
            <Link
              href="/signup"
              style={{ color: "#1d5f8f", fontWeight: 700 }}
            >
              Sign up
            </Link>
          </div>

          {params.error && (
            <div className="form-error">{params.error}</div>
          )}

          <div className="field">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
            />
          </div>

          {/* FORGOT PASSWORD */}
          <div
            style={{
              textAlign: "right",
              marginTop: "-8px",
              marginBottom: "18px",
            }}
          >
            <Link
              href="/forgot-password"
              style={{
                color: "#1d5f8f",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Forgot password?
            </Link>
          </div>

          <button className="btn btn-dark w-full" type="submit">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}