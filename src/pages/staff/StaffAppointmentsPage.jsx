import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import LoadingState from '../../components/LoadingState';
import AlertBanner from '../../components/AlertBanner';
import PaginatedDataTable from '../../components/PaginatedDataTable';
import { apiRequest } from '../../services/apiClient';

export default function StaffAppointmentsPage() {
  const [customerId, setCustomerId] = useState('1');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadAppointments(event) {
    event?.preventDefault();
    if (!customerId) {
      setError('Enter a customer ID.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = await apiRequest(`/api/staff/customers/${customerId}/details`);
      setRows(Array.isArray(payload.data?.appointments) ? payload.data.appointments : []);
    } catch (err) {
      setError(err.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: 'appointmentId', label: 'ID' },
    { key: 'vehiclePlate', label: 'Vehicle' },
    { key: 'status', label: 'Status', render: (r) => <span className="status-pill status-new">{r.status || r.apptStatus}</span> },
    { key: 'appointmentDate', label: 'Date', render: (r) => new Date(r.appointmentDate || r.apptDate).toLocaleString() },
    { key: 'notes', label: 'Notes', render: (r) => r.notes || r.apptNotes || '-' },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Staff"
        title="Appointments"
        description="View appointments for a customer by ID."
      />
      <section className="panel-card search-card">
        <form className="inline-search-form" onSubmit={loadAppointments}>
          <label>
            Customer ID
            <input type="number" min="1" value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
          </label>
          <button type="submit" className="btn-primary">Load appointments</button>
        </form>
      </section>
      <AlertBanner type="error">{error}</AlertBanner>
      {loading ? <LoadingState /> : (
        <section className="panel-card table-card animate-in">
          <PaginatedDataTable
            columns={columns}
            rows={rows}
            page={1}
            pageSize={rows.length || 10}
            totalCount={rows.length}
            totalPages={1}
            emptyMessage="No appointments for this customer."
          />
        </section>
      )}
    </>
  );
}
