import { useEffect, useMemo, useState } from 'react';
import {
  CalendarClock,
  CarFront,
  ClipboardList,
  History,
  Receipt,
  Search,
  Star,
  Wrench,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import {
  getCustomers,
  getPurchaseHistory,
  getServiceHistory,
} from '../../services/customerService';

const styles = {
  page: {
    display: 'grid',
    gap: 12,
    width: '100%',
    maxWidth: 1280,
    margin: '0 auto',
  },
  topBand: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.1fr) minmax(320px, 0.9fr)',
    gap: 12,
  },
  hero: {
    background: 'linear-gradient(135deg, #1f2937 0%, #334155 56%, #0f766e 100%)',
    color: '#fff',
    borderRadius: 16,
    padding: 18,
    boxShadow: '0 24px 48px rgba(15, 23, 42, 0.18)',
    position: 'relative',
    overflow: 'hidden',
  },
  sideCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.06)',
    display: 'grid',
    gap: 14,
    alignContent: 'start',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 10,
  },
  statCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    padding: 14,
    boxShadow: '0 18px 34px rgba(15, 23, 42, 0.05)',
  },
  shell: {
    display: 'grid',
    gridTemplateColumns: '320px minmax(0, 1fr)',
    gap: 12,
    alignItems: 'stretch',
  },
  panel: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 22px 42px rgba(15, 23, 42, 0.05)',
  },
  activityPanel: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 22px 42px rgba(15, 23, 42, 0.05)',
    display: 'grid',
    alignContent: 'start',
    gap: 14,
  },
  titleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#eef2ff',
    color: '#4f46e5',
    flexShrink: 0,
  },
  input: {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: 12,
    padding: '11px 13px',
    fontSize: 13,
    color: '#111827',
    background: '#fff',
    outline: 'none',
  },
  tabButton: {
    border: '1px solid #dbe3ea',
    borderRadius: 12,
    padding: '10px 14px',
    background: '#fff',
    color: '#475569',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    textAlign: 'left',
  },
};

function formatMoney(value) {
  return `Rs. ${Number(value || 0).toFixed(2)}`;
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
}

function getApiMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

export default function HistoryPage() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [activeView, setActiveView] = useState('purchases');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await getCustomers();
        setCustomers(response.data.data || []);
      } catch (requestError) {
        setError(getApiMessage(requestError, 'Could not load customers right now.'));
      }
    }

    loadCustomers();
  }, []);

  async function handleLookup() {
    if (!selectedCustomerId) {
      setError('Please select a customer first.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const [purchaseResponse, serviceResponse] = await Promise.all([
        getPurchaseHistory(selectedCustomerId),
        getServiceHistory(selectedCustomerId),
      ]);

      setPurchaseHistory(purchaseResponse.data.data || []);
      setServiceHistory(serviceResponse.data.data || []);
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Could not load customer history right now.'));
    } finally {
      setIsLoading(false);
    }
  }

  const selectedCustomer = useMemo(
    () => customers.find((customer) => String(customer.id) === String(selectedCustomerId)),
    [customers, selectedCustomerId]
  );

  const totalSpent = useMemo(
    () => purchaseHistory.reduce((sum, item) => sum + Number(item.invoiceTotal || 0), 0),
    [purchaseHistory]
  );

  const totalReviews = useMemo(
    () => serviceHistory.reduce((sum, item) => sum + (item.reviews?.length || 0), 0),
    [serviceHistory]
  );

  return (
    <Layout title="Customer History">
      <div style={styles.page}>
        <div style={styles.topBand}>
          <section style={styles.hero} className="gp-fade-up">
            <div
              style={{
                position: 'absolute',
                inset: 'auto auto -52px 72%',
                width: 180,
                height: 180,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
              }}
            />
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.12)',
                fontSize: 12,
                marginBottom: 14,
              }}
            >
              <History size={14} />
              Customer records
            </div>
            <h2 style={{ fontSize: 28, lineHeight: 1.2, marginBottom: 10 }}>
              View purchase and service history in one balanced customer timeline.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.84)', fontSize: 14, maxWidth: 560, marginBottom: 18 }}>
              Select a customer, load both histories together, and switch between parts
              purchases and service activity without opening another page.
            </p>

            <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.74 }}>
                  Purchase records
                </p>
                <strong style={{ fontSize: 24 }}>{purchaseHistory.length}</strong>
              </div>
              <div>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.74 }}>
                  Service visits
                </p>
                <strong style={{ fontSize: 24 }}>{serviceHistory.length}</strong>
              </div>
              <div>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.74 }}>
                  Review count
                </p>
                <strong style={{ fontSize: 24 }}>{totalReviews}</strong>
              </div>
            </div>
          </section>

          <aside style={styles.sideCard} className="gp-fade-up" data-delay="1">
            <div style={styles.titleWrap}>
              <div style={{ ...styles.iconBox, background: '#ecfeff', color: '#0f766e' }}>
                <Search size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, color: '#111827', marginBottom: 3 }}>Find Customer Record</h3>
                <p style={{ fontSize: 13, color: '#6b7280' }}>Load both history views with one customer selection.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <select
                style={styles.input}
                value={selectedCustomerId}
                onChange={(event) => setSelectedCustomerId(event.target.value)}
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.fullName}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleLookup}
                disabled={isLoading}
                style={{
                  border: 'none',
                  borderRadius: 12,
                  padding: '11px 14px',
                  background: 'linear-gradient(135deg, #0f766e 0%, #0f172a 100%)',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 16px 28px rgba(15, 23, 42, 0.18)',
                }}
              >
                {isLoading ? 'Loading...' : 'Load History'}
              </button>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 14,
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                display: 'grid',
                gap: 6,
              }}
            >
              <span style={{ fontSize: 12, color: '#6b7280' }}>Selected customer</span>
              <strong style={{ fontSize: 15, color: '#111827' }}>{selectedCustomer?.fullName || 'Not selected'}</strong>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{selectedCustomer?.email || 'Choose a customer to begin'}</span>
            </div>
          </aside>
        </div>

        <div style={styles.stats}>
          {[
            {
              label: 'Customers Loaded',
              value: customers.length,
              icon: <ClipboardList size={18} />,
              bg: '#eef2ff',
              accent: '#4f46e5',
            },
            {
              label: 'Purchase History',
              value: purchaseHistory.length,
              icon: <Receipt size={18} />,
              bg: '#ecfeff',
              accent: '#0f766e',
            },
            {
              label: 'Service History',
              value: serviceHistory.length,
              icon: <Wrench size={18} />,
              bg: '#fff7ed',
              accent: '#c2410c',
            },
            {
              label: 'Customer Spend',
              value: formatMoney(totalSpent),
              icon: <CarFront size={18} />,
              bg: '#ecfdf5',
              accent: '#15803d',
            },
          ].map((item, index) => (
            <section key={item.label} style={styles.statCard} className="gp-fade-up" data-delay={index + 2}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{item.label}</p>
                  <p style={{ fontSize: 26, fontWeight: 700, color: '#111827' }}>{item.value}</p>
                </div>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: item.bg,
                    color: item.accent,
                  }}
                >
                  {item.icon}
                </div>
              </div>
            </section>
          ))}
        </div>

        {error && (
          <div
            className="gp-toast-slide"
            style={{
              padding: '14px 16px',
              borderRadius: 14,
              border: '1px solid #fecaca',
              background: '#fff1f2',
              color: '#b91c1c',
              boxShadow: '0 18px 34px rgba(15, 23, 42, 0.06)',
            }}
          >
            {error}
          </div>
        )}

        <div style={styles.shell}>
          <aside style={styles.sideCard} className="gp-fade-up" data-delay="6">
            <div style={styles.titleWrap}>
              <div style={{ ...styles.iconBox, background: '#ecfdf5', color: '#15803d' }}>
                <CalendarClock size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, color: '#111827', marginBottom: 3 }}>History View</h3>
                <p style={{ fontSize: 13, color: '#6b7280' }}>Choose which timeline you want to read first.</p>
              </div>
            </div>

            {[
              ['purchases', 'Purchase History'],
              ['services', 'Service History'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveView(key)}
                style={{
                  ...styles.tabButton,
                  background: activeView === key ? '#eefbf2' : '#fff',
                  borderColor: activeView === key ? '#bbf7d0' : '#dbe3ea',
                  color: activeView === key ? '#166534' : '#475569',
                  boxShadow: activeView === key ? '0 14px 30px rgba(21, 128, 61, 0.10)' : 'none',
                }}
              >
                {label}
              </button>
            ))}
          </aside>

          <section style={styles.activityPanel} className="gp-fade-up" data-delay="7">
            <div style={styles.titleWrap}>
              <div style={styles.iconBox}>
                {activeView === 'purchases' ? <Receipt size={18} /> : <Wrench size={18} />}
              </div>
              <div>
                <h3 style={{ fontSize: 18, color: '#111827', marginBottom: 4 }}>
                  {activeView === 'purchases' ? 'Purchase History' : 'Service History'}
                </h3>
                <p style={{ fontSize: 13, color: '#6b7280' }}>
                  {activeView === 'purchases'
                    ? 'Orders, invoice totals, discounts, and ordered parts.'
                    : 'Appointments and linked review records for the customer.'}
                </p>
              </div>
            </div>

            {activeView === 'purchases' ? (
              <div style={{ display: 'grid', gap: 12 }}>
                {purchaseHistory.map((order, index) => (
                  <article
                    key={order.orderId}
                    className="gp-fade-up"
                    data-delay={index + 1}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: 16,
                      padding: 16,
                      background: '#fff',
                      display: 'grid',
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 12,
                        flexWrap: 'wrap',
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: 16, color: '#111827', marginBottom: 4 }}>Order #{order.orderId}</h4>
                        <p style={{ fontSize: 12, color: '#6b7280' }}>
                          Ordered on {formatDate(order.orderDate)} | Invoice date {formatDate(order.invoiceDate)}
                        </p>
                      </div>
                      <div
                        style={{
                          padding: '7px 10px',
                          borderRadius: 999,
                          background: '#eefbf2',
                          color: '#166534',
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {formatMoney(order.invoiceTotal)}
                      </div>
                    </div>

                    <div className="gp-scroll-panel" style={{ display: 'grid', gap: 10, maxHeight: 220 }}>
                      {order.items.map((item) => (
                        <div
                          key={`${order.orderId}-${item.partId}`}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 12,
                            padding: 12,
                            borderRadius: 14,
                            background: '#f8fafc',
                            border: '1px solid #e5e7eb',
                          }}
                        >
                          <div>
                            <strong style={{ display: 'block', fontSize: 13, color: '#111827', marginBottom: 3 }}>
                              {item.partName}
                            </strong>
                            <span style={{ fontSize: 12, color: '#6b7280' }}>
                              Qty {item.quantity} | Unit {formatMoney(item.unitPrice)}
                            </span>
                          </div>
                          <strong style={{ fontSize: 13, color: '#111827' }}>{formatMoney(item.lineTotal)}</strong>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          padding: 12,
                          borderRadius: 14,
                          background: '#f8fafc',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        <span style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Invoice Total</span>
                        <strong style={{ fontSize: 15, color: '#111827' }}>{formatMoney(order.invoiceTotal)}</strong>
                      </div>
                      <div
                        style={{
                          padding: 12,
                          borderRadius: 14,
                          background: '#f8fafc',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        <span style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Discount</span>
                        <strong style={{ fontSize: 15, color: '#111827' }}>{order.discountPct}%</strong>
                      </div>
                      <div
                        style={{
                          padding: 12,
                          borderRadius: 14,
                          background: '#f8fafc',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        <span style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Parts Count</span>
                        <strong style={{ fontSize: 15, color: '#111827' }}>{order.items.length}</strong>
                      </div>
                    </div>
                  </article>
                ))}

                {!purchaseHistory.length && (
                  <div
                    style={{
                      borderRadius: 16,
                      border: '1px dashed #d1d5db',
                      background: '#f8fafc',
                      padding: 28,
                      textAlign: 'center',
                      color: '#6b7280',
                    }}
                  >
                    No purchase history found for this customer.
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {serviceHistory.map((appointment, index) => (
                  <article
                    key={appointment.appointmentId}
                    className="gp-fade-up"
                    data-delay={index + 1}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: 16,
                      padding: 16,
                      background: '#fff',
                      display: 'grid',
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 12,
                        flexWrap: 'wrap',
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: 16, color: '#111827', marginBottom: 4 }}>
                          Appointment #{appointment.appointmentId}
                        </h4>
                        <p style={{ fontSize: 12, color: '#6b7280' }}>
                          {formatDate(appointment.apptDate)} | Vehicle {appointment.vehiclePlate || 'Not assigned'}
                        </p>
                      </div>
                      <div
                        style={{
                          padding: '7px 10px',
                          borderRadius: 999,
                          background: '#ecfeff',
                          color: '#0f766e',
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {appointment.apptStatus}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: 12,
                        borderRadius: 14,
                        background: '#f8fafc',
                        border: '1px solid #e5e7eb',
                        fontSize: 13,
                        color: '#475569',
                      }}
                    >
                      {appointment.apptNotes || 'No service note added for this appointment.'}
                    </div>

                    <div className="gp-scroll-panel" style={{ display: 'grid', gap: 10, maxHeight: 220 }}>
                      {appointment.reviews.length ? (
                        appointment.reviews.map((review) => (
                          <div
                            key={review.reviewId}
                            style={{
                              padding: 12,
                              borderRadius: 14,
                              background: '#fff',
                              border: '1px solid #e5e7eb',
                              display: 'grid',
                              gap: 6,
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                              <strong style={{ fontSize: 13, color: '#111827' }}>Review #{review.reviewId}</strong>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  fontSize: 12,
                                  color: '#c2410c',
                                  fontWeight: 700,
                                }}
                              >
                                <Star size={13} />
                                {review.rating}/5
                              </span>
                            </div>
                            <span style={{ fontSize: 12, color: '#6b7280' }}>{formatDate(review.reviewDate)}</span>
                            <p style={{ fontSize: 13, color: '#475569' }}>{review.comment || 'No review comment added.'}</p>
                          </div>
                        ))
                      ) : (
                        <div
                          style={{
                            padding: 14,
                            borderRadius: 14,
                            border: '1px dashed #d1d5db',
                            background: '#f8fafc',
                            color: '#6b7280',
                            fontSize: 13,
                          }}
                        >
                          No reviews linked to this appointment yet.
                        </div>
                      )}
                    </div>
                  </article>
                ))}

                {!serviceHistory.length && (
                  <div
                    style={{
                      borderRadius: 16,
                      border: '1px dashed #d1d5db',
                      background: '#f8fafc',
                      padding: 28,
                      textAlign: 'center',
                      color: '#6b7280',
                    }}
                  >
                    No service history found for this customer.
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}
