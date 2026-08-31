"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "Your password has been updated. You can now log in with your new password."
      );

      setPassword("");
      setConfirmPassword("");
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

        <h1>Create a new password.</h1>

        <p>
          Choose a new password for your Investor's Pro member account.
        </p>
      </div>

      <div className="auth-main">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>New password</h2>

          <div className="sub">
            Your password must contain at least 8 characters.
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
            <label>New password</label>

            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="field">
            <label>Confirm new password</label>

            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button
            className="btn btn-dark w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
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