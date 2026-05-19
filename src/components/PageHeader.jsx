export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <section className="page-hero">
      <div className="page-hero-copy">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-hero-actions">{actions}</div>}
    </section>
  );
}
