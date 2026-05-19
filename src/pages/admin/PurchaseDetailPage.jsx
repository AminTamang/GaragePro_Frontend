import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiRequest } from '../../services/apiClient';

export default function PurchaseDetailPage() {
  const { id } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const payload = await apiRequest(`/api/admin/purchases/${id}`);
        setPurchase(payload.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="status-text">Loading purchase...</p>;
  if (!purchase) return <p className="status-error">Purchase not found.</p>;

  return (
    <>
      <section className="feature-hero">
        <div><h1>Purchase #{purchase.id}</h1><p>{purchase.vendorName}</p></div>
        <Link to="/admin/purchases" className="btn-secondary">Back</Link>
      </section>
      <section className="panel-card">
        <dl className="detail-list">
          <div><dt>Total</dt><dd>Rs. {Number(purchase.purchaseTotal).toLocaleString()}</dd></div>
          <div><dt>Date</dt><dd>{new Date(purchase.purchaseDate).toLocaleString()}</dd></div>
        </dl>
        <div className="table-wrap">
          <table className="report-table">
            <thead><tr><th>Part</th><th>Qty</th><th>Unit Cost</th><th>Line Total</th></tr></thead>
            <tbody>
              {(purchase.items || []).map((item) => (
                <tr key={item.partId}>
                  <td>{item.partName}</td>
                  <td>{item.quantity}</td>
                  <td>Rs. {Number(item.unitCost).toLocaleString()}</td>
                  <td>Rs. {Number(item.lineTotal).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
