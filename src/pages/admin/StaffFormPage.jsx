import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CrudForm from '../../components/CrudForm';
import { apiRequest } from '../../services/apiClient';
import { useToast } from '../../components/ToastProvider';

const fields = [
  { name: 'fullName', label: 'Full Name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'staffRole', label: 'Role', required: true },
  { name: 'phoneNumber', label: 'Phone Number' },
];

export default function StaffFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [values, setValues] = useState({ fullName: '', email: '', staffRole: 'Staff', phoneNumber: '' });
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const payload = await apiRequest(`/api/admin/staff/${id}`);
        const staff = payload.data;
        setValues({
          fullName: staff.fullName || '',
          email: staff.email || '',
          staffRole: staff.staffRole || 'Staff',
          phoneNumber: staff.phoneNumber || '',
        });
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, showToast]);

  async function handleSubmit(formValues) {
    const body = {
      fullName: formValues.fullName.trim(),
      email: formValues.email.trim(),
      staffRole: formValues.staffRole.trim(),
      phoneNumber: formValues.phoneNumber.trim(),
    };
    try {
      if (isEdit) {
        await apiRequest(`/api/admin/staff/${id}`, { method: 'PUT', body: JSON.stringify(body) });
        showToast('Staff updated.', 'success');
      } else {
        await apiRequest('/api/admin/staff', { method: 'POST', body: JSON.stringify(body) });
        showToast('Staff created.', 'success');
      }
      navigate('/admin/staff');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  if (loading) return <p className="status-text">Loading...</p>;

  return (
    <>
      <section className="feature-hero">
        <div><h1>{isEdit ? 'Edit Staff' : 'Add Staff'}</h1></div>
        <Link to="/admin/staff" className="btn-secondary">Back</Link>
      </section>
      <section className="panel-card">
        <CrudForm fields={fields} values={values} onChange={(n, v) => setValues((p) => ({ ...p, [n]: v }))} onSubmit={handleSubmit} submitLabel={isEdit ? 'Save' : 'Create'} />
      </section>
    </>
  );
}
