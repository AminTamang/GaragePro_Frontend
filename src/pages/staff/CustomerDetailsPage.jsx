import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import LoadingState from '../../components/LoadingState';
import AlertBanner from '../../components/AlertBanner';
import { apiRequest } from '../../services/apiClient';

export default function CustomerDetailsPage() {
  const [params, setParams] = useSearchParams();
  const initialId = params.get('id') || '';
  const [customerId, setCustomerId] = useState(initialId);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialId) loadDetails(initialId);
  }, [initialId]);

  async function loadDetails(id = customerId) {
    if (!id) {
      setError('Enter a customer ID.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = await apiRequest(`/api/staff/customers/${id}/details`);
      setDetail(payload.data);
      setParams({ id: String(id) });
    } catch (err) {
      setError(err.message);
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }

  const customer = detail?.customer;

  return (
    <>
      <PageHeader
        eyebrow="Staff / Customers"
        title={customer ? customer.customerName : 'Customer Details'}
        description="Full profile, vehicles, invoices, and service history."
        actions={<Link to="/staff/customers/search" className="btn-secondary">Back to search</Link>}
      />

      <section className="panel-card search-card">
        <form className="inline-search-form" onSubmit={(e) => { e.preventDefault(); loadDetails(); }}>
          <label className="search-field search-field-lg">
            <Search size={18} />
            <input
              type="number"
              min="1"
              placeholder="Enter customer ID..."
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </label>
          <button type="submit" className="btn-primary">Load details</button>
        </form>
        <p className="field-hint" style={{ marginTop: 12 }}>Tip: use Customer Search to find an ID, then open details from there.</p>
      </section>

      <AlertBanner type="error">{error}</AlertBanner>
      {loading && <LoadingState />}

      {detail && !loading && (
        <div className="detail-sections animate-in">
          <section className="panel-card">
            <h2>Profile</h2>
            <dl className="detail-list">
              <div><dt>Email</dt><dd>{customer?.customerEmail}</dd></div>
              <div><dt>Phone</dt><dd>{customer?.customerPhone || '-'}</dd></div>
              <div><dt>Address</dt><dd>{customer?.address || '-'}</dd></div>
            </dl>
          </section>

          <section className="panel-card">
            <h2>Credit Status</h2>
            <dl className="detail-list">
              <div><dt>Balance</dt><dd>Rs. {Number(detail.creditBalance ?? detail.balance ?? 0).toLocaleString()}</dd></div>
              <div><dt>Status</dt><dd>{detail.creditStatus || (detail.creditBalance > 0 ? 'Pending' : 'Clear')}</dd></div>
              <div><dt>Overdue Days</dt><dd>{detail.overdueDays ?? detail.creditOverdueDays ?? '-'}</dd></div>
            </dl>
          </section>

          <section className="panel-card">
            <h2>Vehicles ({detail.vehicles?.length || 0})</h2>
            <div className="chip-list">
              {(detail.vehicles || []).map((v) => (
                <span key={v.vehiclePlate} className="chip">{v.vehiclePlate} · {v.make || v.vehicleMake} {v.model || v.vehicleModel}</span>
              ))}
            </div>
          </section>

          <section className="panel-card table-card">
            <h2>Purchase History</h2>
            <div className="table-wrap">
              <table className="report-table">
                <thead><tr><th>#</th><th>Date</th><th>Total</th><th>Paid</th></tr></thead>
                <tbody>
                  {(detail.invoices || []).map((inv) => (
                    <tr key={inv.invoiceId}>
                      <td><Link to={`/staff/invoices/${inv.invoiceId}`} className="link-btn">{inv.invoiceId}</Link></td>
                      <td>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                      <td>Rs. {Number(inv.invoiceTotal).toLocaleString()}</td>
                      <td>{inv.isPaid ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel-card table-card">
            <h2>Service History</h2>
            <div className="table-wrap">
              <table className="report-table">
                <thead><tr><th>Date</th><th>Vehicle</th><th>Service</th><th>Status</th></tr></thead>
                <tbody>
                  {(detail.serviceHistory || detail.services || []).length === 0 ? (
                    <tr><td colSpan="4" className="empty-cell">No service history recorded.</td></tr>
                  ) : (
                    (detail.serviceHistory || detail.services || []).map((svc, index) => (
                      <tr key={svc.serviceId || index}>
                        <td>{new Date(svc.serviceDate || svc.date).toLocaleDateString()}</td>
                        <td>{svc.vehiclePlate || '-'}</td>
                        <td>{svc.serviceName || svc.description || '-'}</td>
                        <td>{svc.status || svc.serviceStatus || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
