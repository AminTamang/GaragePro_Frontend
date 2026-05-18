import { Check } from 'lucide-react';

export default function StatusBadge({ status }) {
  const normalized = status.toLowerCase().replace(/\s+/g, '-');
  return (
    <span className={`status-badge ${normalized}`}>
      {['Preferred', 'Regular', 'Fleet'].includes(status) && <Check size={12} />}
      {status}
    </span>
  );
}