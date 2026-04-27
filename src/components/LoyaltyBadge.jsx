// Feature 16: Loyalty Program — 10% discount if purchase > Rs. 5000
// Reusable: import this in Piyush's SalesInvoicePage too
// Usage: <LoyaltyBadge purchaseTotal={6000} />

import { Tag, TrendingUp } from 'lucide-react';

export default function LoyaltyBadge({ purchaseTotal = 0 }) {
  const eligible      = purchaseTotal > 5000;
  const discountAmt   = eligible ? purchaseTotal * 0.10 : 0;
  const finalTotal    = purchaseTotal - discountAmt;

  if (!eligible) {
    return (
      <div style={{
        background: '#f9fafb', border: '1px solid #e5e7eb',
        borderRadius: 10, padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <TrendingUp size={16} color="#9ca3af" />
        <p style={{ fontSize: 12, color: '#6b7280' }}>
          Spend over <strong>Rs. 5,000</strong> in a single purchase to unlock a <strong>10% loyalty discount</strong>.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: '#f0fdf4', border: '1px solid #86efac',
      borderRadius: 10, padding: '16px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Tag size={16} color="#16a34a" />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#15803d' }}>Loyalty Discount Applied!</span>
        <span style={{
          background: '#16a34a', color: '#fff', fontSize: 10,
          fontWeight: 700, padding: '2px 8px', borderRadius: 20,
        }}>10% OFF</span>
      </div>

      {/* Breakdown */}
      <div style={{ display: 'grid', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: '#6b7280' }}>Original Total</span>
          <span style={{ color: '#9ca3af', textDecoration: 'line-through' }}>Rs. {purchaseTotal.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: '#6b7280' }}>You Save</span>
          <span style={{ color: '#16a34a', fontWeight: 600 }}>− Rs. {discountAmt.toLocaleString()}</span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', fontSize: 14,
          fontWeight: 700, borderTop: '1px solid #bbf7d0', paddingTop: 8, marginTop: 2,
        }}>
          <span style={{ color: '#111827' }}>Final Total</span>
          <span style={{ color: '#15803d' }}>Rs. {finalTotal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
