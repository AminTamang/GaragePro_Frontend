import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import CrudForm from '../../components/CrudForm';
import { apiRequest } from '../../services/apiClient';
import { useToast } from '../../components/ToastProvider';

const emailFields = [
  { name: 'subject', label: 'Subject', required: true },
  { name: 'message', label: 'Message', type: 'textarea', required: true, fullWidth: true },
];

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailStatus, setEmailStatus] = useState('');
  const [emailValues, setEmailValues] = useState({
    subject: 'GaragePro Invoice',
    message: 'Please find your invoice details attached below.',
  });

  useEffect(() => {
    (async () => {
        try {
          const payload = await apiRequest(`/api/staff/invoices/${id}`);
          setInvoice(payload.data);
          if (payload.data?.invoiceEmailed) {
            setEmailStatus('sent');
          }
        } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, showToast]);

  async function sendEmail() {
    try {
      await apiRequest(`/api/staff/invoices/${id}/email`, {
        method: 'POST',
        body: JSON.stringify(emailValues),
      });
      setEmailStatus('sent');
      showToast('Invoice email sent successfully.', 'success');
    } catch (err) {
      setEmailStatus('failed');
      showToast(err.message, 'error');
    }
  }

  if (loading) return <p className="status-text">Loading invoice...</p>;
  if (!invoice) return <p className="status-error">Invoice not found.</p>;

  return (
    <>
      <section className="feature-hero">
        <div>
          <span className="eyebrow">Staff / Invoices</span>
          <h1>Invoice #{invoice.invoiceId}</h1>
          <p>{invoice.customerName} · {new Date(invoice.invoiceDate).toLocaleString()}</p>
        </div>
        <Link to="/staff/sales/history" className="btn-secondary"><ArrowLeft size={16} /> Back</Link>
      </section>

      <section className="detail-grid">
        <article className="panel-card">
          <h2>Invoice Summary</h2>
          <dl className="detail-list">
            <div><dt>Customer</dt><dd>{invoice.customerName}</dd></div>
            <div><dt>Email</dt><dd>{invoice.customerEmail}</dd></div>
            <div><dt>Vehicle</dt><dd>{invoice.vehiclePlate || '-'}</dd></div>
            <div><dt>Staff</dt><dd>{invoice.staffName}</dd></div>
            <div><dt>Total</dt><dd>Rs. {Number(invoice.invoiceTotal).toLocaleString()}</dd></div>
            <div><dt>Discount</dt><dd>{invoice.discountPct}%</dd></div>
            <div><dt>Paid</dt><dd>{invoice.isPaid ? 'Yes' : 'No'}</dd></div>
            <div><dt>Emailed</dt><dd>{invoice.invoiceEmailed ? 'Yes' : 'No'}</dd></div>
            <div><dt>Due Date</dt><dd>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}</dd></div>
            <div><dt>Email Status</dt><dd>{emailStatus ? emailStatus.toUpperCase() : '-'}</dd></div>
          </dl>
        </article>

        <article className="panel-card">
          <h2>Line Items</h2>
          <div className="table-wrap">
            <table className="report-table">
              <thead>
                <tr><th>Part</th><th>Qty</th><th>Unit</th><th>Total</th></tr>
              </thead>
              <tbody>
                {(invoice.items || []).map((item) => (
                  <tr key={item.partId}>
                    <td>{item.partName}</td>
                    <td>{item.quantity}</td>
                    <td>Rs. {Number(item.unitPrice).toLocaleString()}</td>
                    <td>Rs. {Number(item.lineTotal).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="panel-card">
        <h2><Mail size={18} /> Send Invoice Email</h2>
        <CrudForm
          fields={emailFields}
          values={emailValues}
          onChange={(name, value) => setEmailValues((prev) => ({ ...prev, [name]: value }))}
          onSubmit={sendEmail}
          submitLabel="Send Email"
        />
      </section>
    </>
  );
}
