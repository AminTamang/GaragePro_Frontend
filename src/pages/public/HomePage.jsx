import { Link } from 'react-router-dom';
import { BarChart2, CalendarCheck, PackageCheck, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="public-page">
      <nav className="public-nav">
        <span className="logo-text public-logo">GaragePro</span>
        <div>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
          <Link className="public-cta" to="/register">Register</Link>
        </div>
      </nav>

      <section className="public-hero">
        <div>
          <span className="eyebrow">Vehicle Parts Selling and Inventory Management</span>
          <h1>GaragePro</h1>
          <p>
            Manage parts inventory, vendor purchases, sales invoices, customers, appointments,
            notifications, and loyalty discounts from one role-based system.
          </p>
          <div className="public-actions">
            <Link className="btn-primary" to="/login">Open Dashboard</Link>
            <Link className="btn-ghost" to="/about">View Services</Link>
          </div>
        </div>
      </section>

      <section className="public-feature-grid">
        {[
          ['Inventory', 'Track stock, purchases, low-stock alerts, and vendor supply.', PackageCheck],
          ['Sales', 'Create invoices, apply loyalty discounts, and send emails.', BarChart2],
          ['Service', 'Book appointments, collect reviews, and handle part requests.', CalendarCheck],
          ['Security', 'JWT authentication with Admin, Staff, and Customer access.', ShieldCheck],
        ].map(([title, copy, Icon]) => (
          <article className="public-card" key={title}>
            <Icon size={22} />
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
