import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import LoadingState from '../../components/LoadingState';
import { apiRequest, unwrapData } from '../../services/apiClient';
import { buildPagedQuery, unwrapPagedData } from '../../utils/pagedApi';
import { useToast } from '../../components/ToastProvider';

export default function PurchaseCreatePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [vendors, setVendors] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendorId, setVendorId] = useState('');
  const [notes, setNotes] = useState('');
  const [partId, setPartId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitCost, setUnitCost] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [vendorsRes, partsRes] = await Promise.all([
          apiRequest('/api/admin/vendors'),
          apiRequest(`/api/admin/parts?${buildPagedQuery({ page: 1, pageSize: 200 })}`),
        ]);
        setVendors(unwrapData(vendorsRes));
        const pagedParts = unwrapPagedData(partsRes);
        setParts(pagedParts.items);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  const selectedPart = useMemo(
    () => parts.find((p) => String(p.partId) === String(partId)),
    [parts, partId]
  );

  function addItem() {
    if (!partId || !quantity || !unitCost) {
      showToast('Select a part, quantity, and unit cost.', 'error');
      return;
    }
    const parsedQty = Number(quantity);
    const parsedCost = Number(unitCost);
    if (!parsedQty || parsedQty <= 0 || !parsedCost || parsedCost <= 0) {
      showToast('Enter a valid quantity and unit cost.', 'error');
      return;
    }
    setItems((current) => [
      ...current,
      {
        partId: Number(partId),
        partName: selectedPart?.partName || `Part #${partId}`,
        quantity: parsedQty,
        unitCost: parsedCost,
      },
    ]);
    setPartId('');
    setQuantity('1');
    setUnitCost('');
  }

  function removeItem(index) {
    setItems((current) => current.filter((_, i) => i !== index));
  }

  const total = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);

  async function handleSubmit() {
    if (!vendorId) {
      showToast('Select a vendor.', 'error');
      return;
    }
    if (items.length === 0) {
      showToast('Add at least one part to the invoice.', 'error');
      return;
    }
    const body = {
      vendorId: Number(vendorId),
      notes: notes.trim() || null,
      items: items.map((item) => ({
        partId: Number(item.partId),
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
      })),
    };
    try {
      const payload = await apiRequest('/api/admin/purchases', { method: 'POST', body: JSON.stringify(body) });
      showToast('Purchase recorded.', 'success');
      navigate(`/admin/purchases/${payload.data?.id || ''}`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin / Purchases"
        title="Create Purchase Invoice"
        description="Select a vendor, add parts with quantity and unit cost, then generate the invoice."
      />

      {loading ? <LoadingState /> : (
        <>
          <section className="panel-card form-card animate-in">
            <div className="form-grid">
              <label>
                Vendor
                <select value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
                  <option value="">Select vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                  ))}
                </select>
              </label>
              <label className="full-field">
                Notes
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Invoice notes or delivery details." />
              </label>
            </div>
          </section>

          <section className="panel-card form-card animate-in">
            <h2>Add part line items</h2>
            <div className="form-grid">
              <label>
                Part
                <select
                  value={partId}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    const part = parts.find((p) => String(p.partId) === String(nextId));
                    setPartId(nextId);
                    setUnitCost(part?.partUnitPrice ?? '');
                  }}
                >
                  <option value="">Select part</option>
                  {parts.map((part) => (
                    <option key={part.partId} value={part.partId}>
                      {part.partName} (stock {part.partStockQty})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Quantity
                <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </label>
              <label>
                Unit Cost
                <input type="number" min="0.01" step="0.01" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} />
              </label>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={addItem}>Add Item</button>
              </div>
            </div>

            {items.length > 0 && (
              <div className="table-wrap" style={{ marginTop: 16 }}>
                <table className="report-table">
                  <thead>
                    <tr><th>Part</th><th>Qty</th><th>Unit Cost</th><th>Line Total</th><th></th></tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={`${item.partId}-${index}`}>
                        <td>{item.partName}</td>
                        <td>{item.quantity}</td>
                        <td>Rs. {Number(item.unitCost).toLocaleString()}</td>
                        <td>Rs. {(item.quantity * item.unitCost).toLocaleString()}</td>
                        <td>
                          <button type="button" className="link-btn" onClick={() => removeItem(index)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="panel-card">
            <div className="detail-list">
              <div><dt>Invoice Total</dt><dd>Rs. {Number(total).toLocaleString()}</dd></div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-primary" onClick={handleSubmit}>Create Purchase</button>
            </div>
          </section>
        </>
      )}
    </>
  );
}
