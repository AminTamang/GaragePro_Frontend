export default function AlertBanner({ type = 'info', children }) {
  if (!children) return null;
  return <div className={`alert-banner alert-${type}`}>{children}</div>;
}
