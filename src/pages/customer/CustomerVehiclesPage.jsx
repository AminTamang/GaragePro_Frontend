import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import LoadingState from '../../components/LoadingState';
import AlertBanner from '../../components/AlertBanner';
import { apiRequest } from '../../services/apiClient';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../../components/ToastProvider';

export default function CustomerVehiclesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const customerId = user?.customerId;
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    vehiclePlate: '',
    make: '',
    model: '',
    vehicleType: 'Car',
    manufactureYear: '',
  });
  const [editingPlate, setEditingPlate] = useState('');

  useEffect(() => {
    if (!customerId) {
      setError('Your account is not linked to a customer profile.');
      setLoading(false);
      return;
    }
    loadVehicles();
  }, [customerId]);

  async function loadVehicles() {
    setLoading(true);
    try {
      const payload = await apiRequest(`/api/customers/${customerId}`);
      setVehicles(payload.data?.vehicles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(vehicle) {
    setEditingPlate(vehicle.vehiclePlate);
    setForm({
      vehiclePlate: vehicle.vehiclePlate || '',
      make: vehicle.make || vehicle.vehicleMake || '',
      model: vehicle.model || vehicle.vehicleModel || '',
      vehicleType: vehicle.vehicleType || 'Car',
      manufactureYear: vehicle.manufactureYear || vehicle.vehicleYear || '',
    });
  }

  function resetForm() {
    setEditingPlate('');
    setForm({ vehiclePlate: '', make: '', model: '', vehicleType: 'Car', manufactureYear: '' });
  }

  async function saveVehicle(event) {
    event.preventDefault();
    if (!form.vehiclePlate || !form.make || !form.model) {
      showToast('Vehicle plate, make, and model are required.', 'error');
      return;
    }
    const body = {
      vehiclePlate: form.vehiclePlate.trim(),
      make: form.make.trim(),
      model: form.model.trim(),
      vehicleType: form.vehicleType,
      manufactureYear: Number(form.manufactureYear) || null,
    };
    try {
      if (editingPlate) {
        await apiRequest(`/api/customers/${customerId}/vehicles/${editingPlate}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
        showToast('Vehicle updated.', 'success');
      } else {
        await apiRequest(`/api/customers/${customerId}/vehicles`, {
          method: 'POST',
          body: JSON.stringify(body),
        });
        showToast('Vehicle added.', 'success');
      }
      resetForm();
      loadVehicles();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  return (
    <>
      <PageHeader eyebrow="Customer" title="My Vehicles" description="Vehicles registered under your account." />
      <AlertBanner type="error">{error}</AlertBanner>
      {loading ? <LoadingState /> : (
        <div className="detail-sections animate-in">
          <section className="panel-card">
            <h2>{editingPlate ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
            <form className="form-grid" onSubmit={saveVehicle}>
              <label>
                Vehicle Plate
                <input value={form.vehiclePlate} onChange={(e) => setForm((p) => ({ ...p, vehiclePlate: e.target.value }))} />
              </label>
              <label>
                Make
                <input value={form.make} onChange={(e) => setForm((p) => ({ ...p, make: e.target.value }))} />
              </label>
              <label>
                Model
                <input value={form.model} onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))} />
              </label>
              <label>
                Vehicle Type
                <select value={form.vehicleType} onChange={(e) => setForm((p) => ({ ...p, vehicleType: e.target.value }))}>
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                  <option value="Jeep">Jeep</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label>
                Year
                <input type="number" min="1990" max="2035" value={form.manufactureYear} onChange={(e) => setForm((p) => ({ ...p, manufactureYear: e.target.value }))} />
              </label>
              <div className="form-actions">
                <button type="submit" className="btn-primary">{editingPlate ? 'Save Changes' : 'Add Vehicle'}</button>
                {editingPlate && <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>}
              </div>
            </form>
          </section>

          <section className="panel-card">
            <h2>My Vehicles</h2>
            {vehicles.length === 0 ? (
              <div className="empty-panel">No vehicles on file yet.</div>
            ) : (
              <div className="vehicle-grid">
                {vehicles.map((v) => (
                  <article className="vehicle-card panel-card" key={v.vehiclePlate}>
                    <h3>{v.vehiclePlate}</h3>
                    <p>{v.make || v.vehicleMake} {v.model || v.vehicleModel}</p>
                    <div className="offer-meta">
                      <span>{v.vehicleType || 'Vehicle'}</span>
                      {v.manufactureYear || v.vehicleYear ? <span>Year {v.manufactureYear || v.vehicleYear}</span> : null}
                    </div>
                    <button type="button" className="link-btn" onClick={() => startEdit(v)}>Edit</button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
