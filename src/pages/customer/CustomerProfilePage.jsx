import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import LoadingState from '../../components/LoadingState';
import AlertBanner from '../../components/AlertBanner';
import CrudForm from '../../components/CrudForm';
import { apiRequest } from '../../services/apiClient';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../../components/ToastProvider';

const fields = [
  { name: 'fullName', label: 'Full Name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phoneNumber', label: 'Phone Number' },
  { name: 'address', label: 'Address', type: 'textarea', fullWidth: true },
];

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const customerId = user?.customerId;
  const [values, setValues] = useState({ fullName: '', email: '', phoneNumber: '', address: '' });
  const [passwordValues, setPasswordValues] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
        const payload = await apiRequest(`/api/customers/${customerId}`);
        const c = payload.data;
        setValues({
          fullName: c.fullName || c.customerName || '',
          email: c.email || c.customerEmail || '',
          phoneNumber: c.phoneNumber || c.customerPhone || '',
          address: c.address || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [customerId]);

  async function handleSubmit(formValues) {
    try {
      await apiRequest(`/api/customers/${customerId}`, {
        method: 'PUT',
        body: JSON.stringify({
          fullName: formValues.fullName.trim(),
          email: formValues.email.trim(),
          phoneNumber: formValues.phoneNumber.trim(),
          address: formValues.address.trim(),
        }),
      });
      showToast('Profile updated successfully.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function handlePasswordSubmit(formValues) {
    if (!formValues.newPassword || formValues.newPassword !== formValues.confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    try {
      await apiRequest(`/api/customers/${customerId}/password`, {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: formValues.currentPassword,
          newPassword: formValues.newPassword,
        }),
      });
      showToast('Password updated successfully.', 'success');
      setPasswordValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  return (
    <>
      <PageHeader eyebrow="Customer" title="My Profile" description="View and update your account details." />
      <AlertBanner type="error">{error}</AlertBanner>
      {loading ? (
        <LoadingState />
      ) : (
        <div className="detail-sections animate-in">
          <section className="panel-card">
            <CrudForm
              fields={fields}
              values={values}
              onChange={(n, v) => setValues((p) => ({ ...p, [n]: v }))}
              onSubmit={handleSubmit}
              submitLabel="Save Profile"
            />
          </section>
          <section className="panel-card">
            <h2>Change Password</h2>
            <CrudForm
              fields={[
                { name: 'currentPassword', label: 'Current Password', type: 'password', required: true },
                { name: 'newPassword', label: 'New Password', type: 'password', required: true },
                { name: 'confirmPassword', label: 'Confirm Password', type: 'password', required: true },
              ]}
              values={passwordValues}
              onChange={(n, v) => setPasswordValues((p) => ({ ...p, [n]: v }))}
              onSubmit={handlePasswordSubmit}
              submitLabel="Update Password"
            />
          </section>
        </div>
      )}
    </>
  );
}
