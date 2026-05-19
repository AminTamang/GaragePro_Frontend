import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import LoadingState from '../../components/LoadingState';
import AlertBanner from '../../components/AlertBanner';
import PaginatedDataTable from '../../components/PaginatedDataTable';
import { apiRequest } from '../../services/apiClient';
import { useAuth } from '../../auth/AuthContext';
import { printPdf } from '../../utils/exportUtils';

export default function PurchaseHistoryPage() {
  const { user } = useAuth();
  const customerId = user?.customerId;
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!customerId) {
      setError('Your account is not linked to a customer profile.');
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const payload = await apiRequest(`/api/customers/${customerId}/history`);
        setHistory(payload.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [customerId]);

  const rows = (history?.invoices || history?.orders || []).map((item) => ({
    id: item.invoiceId || item.orderId,
    date: item.invoiceDate || item.orderDate,
    vehicle: item.vehiclePlate || '-',
    total: item.invoiceTotal ?? item.totalAmount ?? 0,
    status: item.isPaid !== undefined ? (item.isPaid ? 'Paid' : 'Unpaid') : item.orderStatus,
    discountEligible: Number(item.invoiceTotal ?? item.totalAmount ?? 0) >= 5000,
  }));

  const services = history?.services || history?.serviceHistory || [];

  function downloadInvoice(row) {
    printPdf({
      title: `GaragePro Invoice ${row.id}`,
      subtitle: `Vehicle: ${row.vehicle} · ${new Date(row.date).toLocaleDateString()}`,
      summary: [
        { label: 'Invoice #', value: row.id },
        { label: 'Total', value: `Rs. ${Number(row.total).toLocaleString()}` },
        { label: 'Status', value: row.status },
        { label: 'Discount', value: row.discountEligible ? '10% Loyalty' : '—' },
      ],
      columns: [
        { key: 'label', label: 'Item' },
        { key: 'value', label: 'Value' },
      ],
      rows: [],
    });
  }

  const columns = [
    { key: 'id', label: 'Ref #' },
    { key: 'date', label: 'Date', render: (r) => new Date(r.date).toLocaleDateString() },
    { key: 'vehicle', label: 'Vehicle' },
    { key: 'total', label: 'Amount', render: (r) => `Rs. ${Number(r.total).toLocaleString()}` },
    { key: 'status', label: 'Status' },
    {
      key: 'discount',
      label: 'Discount',
      render: (r) => (r.discountEligible ? <span className="status-pill status-paid">10% Loyalty</span> : '-'),
    },
    {
      key: 'actions',
      label: '',
      render: (r) => <button type="button" className="link-btn" onClick={() => downloadInvoice(r)}>Download PDF</button>,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Customer"
        title="Purchase & Service History"
        description={history?.customerName ? `Records for ${history.customerName}` : 'Your invoices and service visits.'}
      />
      <AlertBanner type="error">{error}</AlertBanner>
      {loading ? <LoadingState /> : (
        <div className="detail-sections animate-in">
          <section className="panel-card table-card">
            <h2>Invoices</h2>
            <PaginatedDataTable
              columns={columns}
              rows={rows}
              page={1}
              pageSize={rows.length || 10}
              totalCount={rows.length}
              totalPages={1}
              emptyMessage="No purchase history yet."
            />
          </section>

          <section className="panel-card table-card">
            <h2>Service Timeline</h2>
            <div className="table-wrap">
              <table className="report-table">
                <thead><tr><th>Date</th><th>Vehicle</th><th>Service</th><th>Status</th></tr></thead>
                <tbody>
                  {services.length === 0 ? (
                    <tr><td colSpan="4" className="empty-cell">No service visits recorded.</td></tr>
                  ) : (
                    services.map((svc, index) => (
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
