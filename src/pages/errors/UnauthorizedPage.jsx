import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Unauthorized</h1>
        <p>Your account does not have permission to open this area.</p>
        <Link className="btn-primary" to="/login">Switch Account</Link>
      </section>
    </main>
  );
}
