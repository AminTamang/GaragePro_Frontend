import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="logo-text auth-logo" to="/">GaragePro</Link>
        <h1>Forgot Password</h1>
        <p>Password reset is not enabled yet. Ask an administrator to reset your account for now.</p>
        <Link className="btn-primary" to="/login">Back to Login</Link>
      </section>
    </main>
  );
}
