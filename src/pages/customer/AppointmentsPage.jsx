import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, MessageSquare, Package } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import LoadingState from '../../components/LoadingState';
import AlertBanner from '../../components/AlertBanner';
import CrudForm from '../../components/CrudForm';
import PaginatedDataTable from '../../components/PaginatedDataTable';
import { apiRequest } from '../../services/apiClient';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../../components/ToastProvider';

const TABS = [
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  { id: 'parts', label: 'Part Requests', icon: Package },
];

export default function AppointmentsPage() {
  const location = useLocation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const customerId = user?.customerId;

  const defaultTab = location.pathname.includes('reviews')
    ? 'reviews'
    : location.pathname.includes('request-part')
      ? 'parts'
      : 'appointments';

  const [tab, setTab] = useState(defaultTab);
  const [appointments, setAppointments] = useState([]);
  const [partRequests, setPartRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    vehiclePlate: '',
    appointmentDate: '',
    serviceType: '',
    notes: '',
    partName: '',
    comment: '',
    rating: '5',
  });

  const resetForm = () => {
    setForm({
      vehiclePlate: '',
      appointmentDate: '',
      serviceType: '',
      notes: '',
      partName: '',
      comment: '',
      rating: '5',
    });
  };

  const normalizeAppointmentDate = (value) => {
    if (!value) return value;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toISOString();
  };

  useEffect(() => {
    if (!customerId) {
      setError('Your account is not linked to a customer profile.');
      setLoading(false);
      return;
    }
    loadAll();
  }, [customerId]);

  async function loadAll() {
    setLoading(true);
    try {
      const [appointmentsRes, requestsRes, reviewsRes] = await Promise.all([
        apiRequest(`/api/customers/appointments?customerId=${customerId}`),
        apiRequest(`/api/customers/part-requests?customerId=${customerId}`),
        apiRequest(`/api/customers/reviews?customerId=${customerId}`),
      ]);
      setAppointments(Array.isArray(appointmentsRes.data) ? appointmentsRes.data : []);
      setPartRequests(Array.isArray(requestsRes.data) ? requestsRes.data : []);
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function bookAppointment(values) {
    const appointmentDate = normalizeAppointmentDate(values.appointmentDate);
    if (!appointmentDate) {
      const message = 'Enter a valid appointment date.';
      setError(message);
      showToast(message, 'error');
      return;
    }
    try {
      setSubmitting(true);
        await apiRequest('/api/customers/appointments', {
          method: 'POST',
          body: JSON.stringify({
            customerId: Number(customerId),
            vehiclePlate: values.vehiclePlate,
            appointmentDate,
            status: 'Pending',
            serviceType: values.serviceType,
            notes: values.notes,
          }),
        });
        showToast('Appointment booked.', 'success');
        resetForm();
        loadAll();
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function submitReview(values) {
    try {
      setSubmitting(true);
      await apiRequest('/api/customers/reviews', {
        method: 'POST',
        body: JSON.stringify({
          customerId: Number(customerId),
          vehiclePlate: values.vehiclePlate,
          rating: Number(values.rating) || 5,
          comment: values.comment,
        }),
      });
      showToast('Review submitted.', 'success');
      resetForm();
      loadAll();
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function requestPart(values) {
    try {
      setSubmitting(true);
      await apiRequest('/api/customers/part-requests', {
        method: 'POST',
        body: JSON.stringify({
          customerId: Number(customerId),
          vehiclePlate: values.vehiclePlate,
          partName: values.partName,
          description: values.notes,
        }),
      });
      showToast('Part request submitted.', 'success');
      resetForm();
      loadAll();
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const appointmentColumns = [
    { key: 'appointmentId', label: 'ID' },
    { key: 'vehiclePlate', label: 'Vehicle' },
    { key: 'serviceType', label: 'Service', render: (r) => r.serviceType || r.service || '-' },
    { key: 'status', label: 'Status', render: (r) => <span className="status-pill status-new">{r.status || r.apptStatus}</span> },
    { key: 'appointmentDate', label: 'Date', render: (r) => new Date(r.appointmentDate || r.apptDate).toLocaleString() },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        r.status === 'Cancelled'
          ? '-'
          : (
            <button type="button" className="link-btn" onClick={() => cancelAppointment(r.appointmentId || r.id)}>
              Cancel
            </button>
          )
      ),
    },
  ];

  const requestColumns = [
    { key: 'partName', label: 'Part' },
    { key: 'vehiclePlate', label: 'Vehicle' },
    { key: 'status', label: 'Status', render: (r) => r.status || 'Submitted' },
    { key: 'createdAt', label: 'Requested', render: (r) => new Date(r.createdAt || r.requestedAt || Date.now()).toLocaleDateString() },
  ];

  const reviewColumns = [
    { key: 'vehiclePlate', label: 'Vehicle' },
    { key: 'rating', label: 'Rating', render: (r) => `${r.rating || 5} ★` },
    { key: 'comment', label: 'Comment' },
    { key: 'createdAt', label: 'Date', render: (r) => new Date(r.createdAt || Date.now()).toLocaleDateString() },
  ];

  return (
    <>
      <PageHeader eyebrow="Customer" title="Service Hub" description="Book appointments, request parts, and leave reviews." />

      <div className="tab-bar">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={`tab-btn ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      <AlertBanner type="error">{error}</AlertBanner>

      {tab === 'appointments' && (
        <>
          <section className="panel-card animate-in">
            <h2>Book appointment</h2>
            <CrudForm
              fields={[
                { name: 'vehiclePlate', label: 'Vehicle Plate', required: true },
                {
                  name: 'serviceType',
                  label: 'Service Type',
                  type: 'select',
                  required: true,
                  options: [
                    { value: 'General Service', label: 'General Service' },
                    { value: 'Oil Change', label: 'Oil Change' },
                    { value: 'Brake Service', label: 'Brake Service' },
                    { value: 'Diagnostics', label: 'Diagnostics' },
                    { value: 'Other', label: 'Other' },
                  ],
                },
                { name: 'appointmentDate', label: 'Date & Time', type: 'datetime-local', required: true },
                { name: 'notes', label: 'Notes', type: 'textarea', fullWidth: true },
              ]}
              values={form}
              onChange={(n, v) => setForm((p) => ({ ...p, [n]: v }))}
              onSubmit={bookAppointment}
              submitLabel={submitting ? 'Submitting...' : 'Book Appointment'}
              disabled={submitting}
            />
          </section>
          {loading ? <LoadingState /> : (
            <section className="panel-card table-card">
              <h2>Your appointments</h2>
              <PaginatedDataTable columns={appointmentColumns} rows={appointments} page={1} pageSize={appointments.length || 5} totalCount={appointments.length} totalPages={1} />
            </section>
          )}
        </>
      )}

      {tab === 'reviews' && (
        <>
          <section className="panel-card animate-in">
            <h2>Submit a review</h2>
            <CrudForm
              fields={[
                { name: 'vehiclePlate', label: 'Vehicle Plate', required: true },
                { name: 'rating', label: 'Rating (1-5)', type: 'number', required: true, min: 1, max: 5 },
                { name: 'comment', label: 'Comment', type: 'textarea', required: true, fullWidth: true },
              ]}
              values={form}
              onChange={(n, v) => setForm((p) => ({ ...p, [n]: v }))}
              onSubmit={submitReview}
              submitLabel={submitting ? 'Submitting...' : 'Submit Review'}
              disabled={submitting}
            />
          </section>
          {loading ? <LoadingState /> : (
            <section className="panel-card table-card">
              <h2>Your past reviews</h2>
              <PaginatedDataTable columns={reviewColumns} rows={reviews} page={1} pageSize={reviews.length || 5} totalCount={reviews.length} totalPages={1} />
            </section>
          )}
        </>
      )}

      {tab === 'parts' && (
        <>
          <section className="panel-card animate-in">
            <h2>Request unavailable part</h2>
            <CrudForm
              fields={[
                { name: 'vehiclePlate', label: 'Vehicle Plate', required: true },
                { name: 'partName', label: 'Part Name', required: true },
                { name: 'notes', label: 'Description', type: 'textarea', required: true, fullWidth: true },
              ]}
              values={form}
              onChange={(n, v) => setForm((p) => ({ ...p, [n]: v }))}
              onSubmit={requestPart}
              submitLabel={submitting ? 'Submitting...' : 'Submit Request'}
              disabled={submitting}
            />
          </section>
          {loading ? <LoadingState /> : (
            <section className="panel-card table-card">
              <h2>Request status</h2>
              <PaginatedDataTable columns={requestColumns} rows={partRequests} page={1} pageSize={partRequests.length || 5} totalCount={partRequests.length} totalPages={1} />
            </section>
          )}
        </>
      )}
    </>
  );
}
  async function cancelAppointment(appointmentId) {
    try {
      await apiRequest(`/api/customers/appointments/${appointmentId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'Cancelled' }),
      });
      showToast('Appointment cancelled.', 'success');
      loadAll();
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    }
  }
