import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import CrudForm from '../../components/CrudForm';
import { apiRequest } from '../../services/apiClient';
import { useToast } from '../../components/ToastProvider';

const fields = [
  { name: 'fullName', label: 'Full Name', required: true, placeholder: 'Amit Sharma' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'customer@example.com' },
  { name: 'phoneNumber', label: 'Phone', required: true, placeholder: '98XXXXXXXX' },
  { name: 'address', label: 'Address', placeholder: 'City, district' },
  { name: 'vehiclePlate', label: 'Vehicle Plate', required: true, placeholder: 'BA-2-PA-1234' },
  { name: 'make', label: 'Make', required: true, placeholder: 'Toyota' },
  { name: 'model', label: 'Model', required: true, placeholder: 'Yaris' },
  {
    name: 'vehicleType',
    label: 'Vehicle Type',
    type: 'select',
    required: true,
    options: [
      { value: 'Car', label: 'Car' },
      { value: 'Bike', label: 'Bike' },
      { value: 'Jeep', label: 'Jeep' },
      { value: 'Other', label: 'Other' },
    ],
  },
  { name: 'manufactureYear', label: 'Year', type: 'number', min: 1990, max: 2030, placeholder: '2020' },
];

export default function RegisterCustomerPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [values, setValues] = useState({
    fullName: '', email: '', phoneNumber: '', address: '',
    vehiclePlate: '', make: '', model: '', vehicleType: 'Car', manufactureYear: '2020',
  });

  async function handleSubmit(formValues) {
    const body = {
      fullName: formValues.fullName.trim(),
      email: formValues.email.trim(),
      phoneNumber: formValues.phoneNumber.trim(),
      address: formValues.address.trim(),
      vehiclePlate: formValues.vehiclePlate.trim(),
      make: formValues.make.trim(),
      model: formValues.model.trim(),
      vehicleType: formValues.vehicleType,
      manufactureYear: Number(formValues.manufactureYear) || null,
    };
    try {
      const payload = await apiRequest('/api/staff/customers/register-with-vehicle', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      showToast('Customer registered successfully.', 'success');
      const id = payload.data?.id || payload.data?.customerId;
      navigate(id ? `/staff/customers/details?id=${id}` : '/staff/customers/search');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Staff"
        title="Register Customer + Vehicle"
        description="Create a new customer record and link their vehicle in one step."
      />
      <section className="panel-card form-card animate-in">
        <CrudForm
          fields={fields}
          values={values}
          onChange={(n, v) => setValues((p) => ({ ...p, [n]: v }))}
          onSubmit={handleSubmit}
          submitLabel="Register Customer"
        />
      </section>
    </>
  );
}
