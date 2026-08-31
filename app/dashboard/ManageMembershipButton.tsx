"use client";

import { useState } from "react";

export default function ManageMembershipButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function openPortal() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to open billing portal."
        );
      }

      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to open billing portal."
      );

      setLoading(false);
    }
  }

  return (
    <div>
      <button
        className="btn btn-dark"
        onClick={openPortal}
        disabled={loading}
        type="button"
      >
        {loading ? "Opening..." : "Manage Membership"}
      </button>

      {error && (
        <div
          style={{
            marginTop: "10px",
            color: "#b42318",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
