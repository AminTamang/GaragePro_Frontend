import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CrudForm from '../../components/CrudForm';
import { apiRequest } from '../../services/apiClient';
import { useToast } from '../../components/ToastProvider';

const fields = [
  { name: 'partName', label: 'Part Name', required: true },
  { name: 'partSku', label: 'SKU' },
  { name: 'partCategory', label: 'Category' },
  { name: 'partUnitPrice', label: 'Unit Price', type: 'number', required: true, min: 0.01, step: '0.01' },
  { name: 'partStockQty', label: 'Stock Quantity', type: 'number', required: true, min: 0 },
];

const emptyValues = { partName: '', partSku: '', partCategory: '', partUnitPrice: '', partStockQty: '0' };

export default function PartFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [values, setValues] = useState(emptyValues);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const payload = await apiRequest(`/api/admin/parts/${id}`);
        const part = payload.data;
        setValues({
          partName: part.partName || '',
          partSku: part.partSku || '',
          partCategory: part.partCategory || '',
          partUnitPrice: String(part.partUnitPrice ?? ''),
          partStockQty: String(part.partStockQty ?? '0'),
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
      partName: formValues.partName.trim(),
      partSku: formValues.partSku.trim() || null,
      partCategory: formValues.partCategory.trim() || null,
      partUnitPrice: Number(formValues.partUnitPrice),
      partStockQty: Number(formValues.partStockQty),
    };

    try {
      if (isEdit) {
        await apiRequest(`/api/admin/parts/${id}`, { method: 'PUT', body: JSON.stringify(body) });
        showToast('Part updated successfully.', 'success');
      } else {
        await apiRequest('/api/admin/parts', { method: 'POST', body: JSON.stringify(body) });
        showToast('Part created successfully.', 'success');
      }
      navigate('/admin/parts');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  if (loading) return <p className="status-text">Loading part...</p>;

  return (
    <>
      <section className="feature-hero">
        <div>
          <span className="eyebrow">Admin / Parts</span>
          <h1>{isEdit ? 'Edit Part' : 'Add Part'}</h1>
        </div>
        <Link to="/admin/parts" className="btn-secondary">Back to list</Link>
      </section>
      <section className="panel-card">
        <CrudForm
          fields={fields}
          values={values}
          onChange={(name, value) => setValues((prev) => ({ ...prev, [name]: value }))}
          onSubmit={handleSubmit}
          submitLabel={isEdit ? 'Save Changes' : 'Create Part'}
        />
      </section>
    </>
  );
}
