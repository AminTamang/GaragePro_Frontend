import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import LoadingState from '../../components/LoadingState';
import AlertBanner from '../../components/AlertBanner';
import { apiRequest, unwrapData } from '../../services/apiClient';
import { useToast } from '../../components/ToastProvider';

export default function SalesCreatePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [customerId, setCustomerId] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [dueDate, setDueDate] = useState('');
  const [partId, setPartId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState('');
  const [partSearch, setPartSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [lookups, setLookups] = useState({ customers: [], parts: [] });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [partsRes, customersRes] = await Promise.all([
          apiRequest('/api/staff/lookup/parts'),
          apiRequest('/api/staff/lookup/customers'),
        ]);
        setLookups({
          parts: unwrapData(partsRes),
          customers: unwrapData(customersRes),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!customerId) {
      setVehicles([]);
      return;
    }
    (async () => {
      try {
        const payload = await apiRequest(`/api/staff/customers/${customerId}/details`);
        setVehicles(payload.data?.vehicles || []);
        if (payload.data?.vehicles?.length === 1) {
          setVehiclePlate(payload.data.vehicles[0].vehiclePlate);
        }
      } catch (err) {
        setError(err.message);
        setVehicles([]);
      }
    })();
  }, [customerId]);

  useEffect(() => {
    if (paymentMethod === 'credit' && !dueDate) {
      const next = new Date();
      next.setDate(next.getDate() + 30);
      setDueDate(next.toISOString().slice(0, 10));
    }
    if (paymentMethod === 'cash') {
      setDueDate('');
    }
  }, [paymentMethod]);

  const filteredParts = useMemo(() => {
    if (!partSearch.trim()) return lookups.parts;
    const term = partSearch.toLowerCase();
    return lookups.parts.filter((p) => `${p.partName} ${p.partSku}`.toLowerCase().includes(term));
  }, [lookups.parts, partSearch]);

  const selectedPart = useMemo(
    () => lookups.parts.find((p) => String(p.partId) === String(partId)),
    [lookups.parts, partId]
  );

  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountPct = subtotal >= 5000 ? 10 : 0;
  const discountAmount = subtotal * (discountPct / 100);
  const finalTotal = subtotal - discountAmount;

  function addItem() {
    if (!partId || !quantity) {
      showToast('Select a part and quantity.', 'error');
      return;
    }
    const qty = Number(quantity);
    const price = Number(unitPrice || selectedPart?.partUnitPrice || 0);
    if (!qty || qty <= 0 || !price) {
      showToast('Enter a valid quantity and unit price.', 'error');
      return;
    }
    setCart((current) => [
      ...current,
      {
        partId: Number(partId),
        partName: selectedPart?.partName || `Part #${partId}`,
        quantity: qty,
        unitPrice: price,
      },
    ]);
    setPartId('');
    setQuantity('1');
    setUnitPrice('');
  }

  function removeItem(index) {
    setCart((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!customerId || !vehiclePlate) {
      showToast('Select a customer and vehicle.', 'error');
      return;
    }
    if (cart.length === 0) {
      showToast('Add at least one part to the invoice.', 'error');
      return;
    }
    if (paymentMethod === 'credit' && !dueDate) {
      showToast('Select a due date for credit sales.', 'error');
      return;
    }

    const body = {
      customerId: Number(customerId),
      vehiclePlate: vehiclePlate.trim(),
      paymentMethod,
      dueDate: paymentMethod === 'credit' ? dueDate : null,
      discountPct,
      items: cart.map((item) => ({
        partId: Number(item.partId),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    };
    try {
      const payload = await apiRequest('/api/staff/sales', { method: 'POST', body: JSON.stringify(body) });
      showToast('Sale created successfully.', 'success');
      navigate(`/staff/invoices/${payload.data.invoiceId}`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Staff / Sales"
        title="Create Sales Invoice"
        description="Add parts to the cart, apply loyalty discount automatically, and generate an invoice."
      />
      <AlertBanner type="error">{error}</AlertBanner>
      {loading ? <LoadingState /> : (
        <form className="panel-card form-card animate-in" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Customer
              <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
                <option value="">Select customer</option>
                {lookups.customers.map((c) => (
                  <option key={c.customerId || c.id} value={c.customerId || c.id}>
                    {c.customerName || c.fullName} (ID {c.customerId || c.id})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Vehicle
              {vehicles.length ? (
                <select value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} required>
                  <option value="">Select vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.vehiclePlate} value={v.vehiclePlate}>
                      {v.vehiclePlate} — {v.make || v.vehicleMake} {v.model || v.vehicleModel}
                    </option>
                  ))}
                </select>
              ) : (
                <input value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} placeholder="Vehicle plate" />
              )}
            </label>
            <label>
              Payment Method
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="credit">Credit</option>
              </select>
            </label>
            {paymentMethod === 'credit' && (
              <label>
                Due Date
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </label>
            )}
          </div>

          <div className="panel-card" style={{ marginTop: 16 }}>
            <h2>Add parts to cart</h2>
            <div className="form-grid">
              <label className="full-field">
                Search parts
                <input value={partSearch} onChange={(e) => setPartSearch(e.target.value)} placeholder="Brake pad, oil filter..." />
              </label>
              <label>
                Part
                <select value={partId} onChange={(e) => { setPartId(e.target.value); setUnitPrice(''); }}>
                  <option value="">Select part</option>
                  {filteredParts.map((part) => (
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
                Unit Price
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={unitPrice || selectedPart?.partUnitPrice || ''}
                  onChange={(e) => setUnitPrice(e.target.value)}
                />
              </label>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={addItem}>Add to Cart</button>
              </div>
            </div>

            {cart.length > 0 && (
              <div className="table-wrap" style={{ marginTop: 16 }}>
                <table className="report-table">
                  <thead><tr><th>Part</th><th>Qty</th><th>Unit</th><th>Line Total</th><th></th></tr></thead>
                  <tbody>
                    {cart.map((item, index) => (
                      <tr key={`${item.partId}-${index}`}>
                        <td>{item.partName}</td>
                        <td>{item.quantity}</td>
                        <td>Rs. {Number(item.unitPrice).toLocaleString()}</td>
                        <td>Rs. {(item.quantity * item.unitPrice).toLocaleString()}</td>
                        <td><button type="button" className="link-btn" onClick={() => removeItem(index)}>Remove</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <section className="panel-card" style={{ marginTop: 16 }}>
            <h2>Invoice Preview</h2>
            <dl className="detail-list">
              <div><dt>Subtotal</dt><dd>Rs. {subtotal.toLocaleString()}</dd></div>
              <div><dt>Loyalty Discount</dt><dd>{discountPct}% (Rs. {discountAmount.toLocaleString()})</dd></div>
              <div><dt>Final Total</dt><dd>Rs. {finalTotal.toLocaleString()}</dd></div>
            </dl>
            {discountPct > 0 && (
              <p className="field-hint">10% discount applied automatically for invoices over Rs. 5,000.</p>
            )}
          </section>

          <div className="form-actions" style={{ marginTop: 16 }}>
            <button type="submit" className="btn-primary">Generate Invoice</button>
          </div>
        </form>
      )}
    </>
  );
}
