import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="auth-main" style={{minHeight:"100vh"}}>
      <div className="auth-card">
        <div className="form-success">Payment received.</div>
        <h2>You're all set.</h2>
        <p className="muted">Your membership is being activated. You can now log in to your client portal.</p>
        <Link href="/login" className="btn btn-primary w-full">Go to Member Login</Link>
      </div>
    </div>
  );
}
