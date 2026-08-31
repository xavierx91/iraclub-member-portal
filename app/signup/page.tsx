import Link from "next/link";
import { signUp } from "./actions";

export default async function Signup({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;

  return (
    <div className="auth-shell">
      <div className="auth-side">
        <div className="brand"><span className="brand-mark" style={{borderColor:"#a8cf45",color:"#a8cf45"}}>IRA</span><span>IRA CLUB</span></div>
        <h1>Join Investor's Pro.</h1>
        <p>Create your secure login first. You'll then complete payment and your member access will be activated automatically.</p>
      </div>
      <div className="auth-main">
        <form className="auth-card" action={signUp}>
          <h2>Create account</h2>
          <div className="sub">Already registered? <Link href="/login" style={{color:"#1d5f8f",fontWeight:700}}>Log in</Link></div>
          {params.error && <div className="form-error">{params.error}</div>}
          <div className="field"><label>Full name</label><input name="fullName" required autoComplete="name" /></div>
          <div className="field"><label>Email address</label><input type="email" name="email" required autoComplete="email" /></div>
          <div className="field"><label>Password</label><input type="password" name="password" minLength={8} required autoComplete="new-password" /></div>
          <button className="btn btn-primary w-full" type="submit">Create Account & Continue to Payment</button>
          <p className="muted" style={{fontSize:13,marginTop:18}}>Payment is processed securely by Stripe. Your site never stores card numbers.</p>
        </form>
      </div>
    </div>
  );
}
