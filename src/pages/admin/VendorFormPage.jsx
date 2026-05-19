import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CrudForm from '../../components/CrudForm';
import { apiRequest } from '../../services/apiClient';
import { useToast } from '../../components/ToastProvider';

const fields = [
  { name: 'name', label: 'Vendor Name', required: true },
  { name: 'phone', label: 'Phone', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'address', label: 'Address', required: true, fullWidth: true, type: 'textarea' },
];

export default function VendorFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [values, setValues] = useState({ name: '', phone: '', email: '', address: '' });
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const payload = await apiRequest(`/api/admin/vendors/${id}`);
        const vendor = payload.data;
        setValues({ name: vendor.name || '', phone: vendor.phone || '', email: vendor.email || '', address: vendor.address || '' });
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, showToast]);

  async function handleSubmit(formValues) {
    const body = {
      name: formValues.name.trim(),
      phone: formValues.phone.trim(),
      email: formValues.email.trim(),
      address: formValues.address.trim(),
    };
    try {
      if (isEdit) {
        await apiRequest(`/api/admin/vendors/${id}`, { method: 'PUT', body: JSON.stringify(body) });
        showToast('Vendor updated.', 'success');
      } else {
        await apiRequest('/api/admin/vendors', { method: 'POST', body: JSON.stringify(body) });
        showToast('Vendor created.', 'success');
      }
      navigate('/admin/vendors');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  if (loading) return <p className="status-text">Loading...</p>;

  return (
    <>
      <section className="feature-hero">
        <div><h1>{isEdit ? 'Edit Vendor' : 'Add Vendor'}</h1></div>
        <Link to="/admin/vendors" className="btn-secondary">Back</Link>
      </section>
      <section className="panel-card">
        <CrudForm fields={fields} values={values} onChange={(n, v) => setValues((p) => ({ ...p, [n]: v }))} onSubmit={handleSubmit} submitLabel={isEdit ? 'Save' : 'Create'} />
      </section>
    </>
  );
}
