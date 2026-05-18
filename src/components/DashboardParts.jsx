function PageHero({ icon: Icon, eyebrow, description, stats }) {
  return (
    <div className="hero-panel">
      <div className="pill">
        <Icon size={16} />
        <span>{eyebrow}</span>
      </div>
      <h2>{description}</h2>
      <div className="hero-stats">
        {stats.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuickPanel({ icon: Icon, title, note, fields, action }) {
  return (
    <aside className="action-card">
      <div className="card-heading">
        <div className="soft-icon teal">
          <Icon size={22} />
        </div>
        <div>
          <h3>{title}</h3>
          <p>{note}</p>
        </div>
      </div>
      <div className="form-stack">
        {fields.map((field) => (
          <input key={field} placeholder={field} />
        ))}
        <button type="button">{action}</button>
      </div>
    </aside>
  )
}

function PageIntro({ hero, quickPanel }) {
  return (
    <section className="page-grid">
      <PageHero {...hero} />
      <QuickPanel {...quickPanel} />
    </section>
  )
}

function MetricStrip({ metrics }) {
  return (
    <section className="metric-strip">
      {metrics.map(([label, value, Icon], index) => (
        <article className="metric-card" key={label}>
          <div>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
          <div className={`soft-icon tone-${index}`}>
            <Icon size={19} />
          </div>
        </article>
      ))}
    </section>
  )
}

function Panel({ title, subtitle, icon: Icon, children }) {
  return (
    <article className="panel">
      <div className="card-heading">
        <div className="soft-icon violet">
          <Icon size={21} />
        </div>
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
      {children}
    </article>
  )
}

function DataTable({ headers, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('-')}>
              {row.map((cell, index) => (
                <td key={`${cell}-${index}`}>
                  {index === row.length - 1 ? <span className="status">{cell}</span> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProgressList({ items }) {
  return (
    <div className="progress-list">
      {items.map(([label, detail, value]) => (
        <div className="progress-item" key={label}>
          <div>
            <strong>{label}</strong>
            <span>{detail}</span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function Timeline({ items }) {
  return (
    <div className="timeline">
      {items.map(([title, detail]) => (
        <div className="timeline-item" key={title}>
          <span />
          <div>
            <strong>{title}</strong>
            <p>{detail}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export { DataTable, MetricStrip, PageIntro, Panel, ProgressList, Timeline }
