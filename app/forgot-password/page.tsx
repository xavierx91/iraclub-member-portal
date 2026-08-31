"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "Password reset email sent. Check your inbox for the reset link."
      );
    }

    setLoading(false);
  }

  return (
    <div className="auth-shell">
      <div className="auth-side">
        <div className="brand">
          <span
            className="brand-mark"
            style={{
              borderColor: "#a8cf45",
              color: "#a8cf45",
            }}
          >
            IRA
          </span>
          <span>IRA CLUB</span>
        </div>

        <h1>Reset your password.</h1>

        <p>
          Enter the email address associated with your membership and we'll
          send you a secure reset link.
        </p>
      </div>

      <div className="auth-main">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Forgot password?</h2>

          <div className="sub">
            Enter your email address below.
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {message && (
            <div
              style={{
                padding: "12px",
                marginBottom: "16px",
                borderRadius: "8px",
                background: "#eef7df",
              }}
            >
              {message}
            </div>
          )}

          <div className="field">
            <label>Email address</label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <button
            className="btn btn-dark w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            <Link
              href="/login"
              style={{
                color: "#1d5f8f",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              ← Back to Member Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}