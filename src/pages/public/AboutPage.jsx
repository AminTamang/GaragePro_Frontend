import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <main className="public-page narrow-public">
      <nav className="public-nav">
        <Link className="logo-text public-logo" to="/">GaragePro</Link>
        <Link className="public-cta" to="/login">Login</Link>
      </nav>
      <section className="public-panel">
        <span className="eyebrow">About Service Center</span>
        <h1>Built for vehicle parts sales, inventory, and service workflows.</h1>
        <p>
          GaragePro supports administrators, staff, and customers with separate dashboards,
          PostgreSQL-backed transactions, JWT role access, and coursework-focused service center flows.
        </p>
      </section>
    </main>
  );
}
