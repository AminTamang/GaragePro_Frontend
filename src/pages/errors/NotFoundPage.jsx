import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Page Not Found</h1>
        <p>The page you requested does not exist in GaragePro.</p>
        <Link className="btn-primary" to="/">Go Home</Link>
      </section>
    </main>
  );
}
