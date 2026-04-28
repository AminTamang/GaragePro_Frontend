import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BadgeIndianRupee,
  CreditCard,
  FileBarChart2,
  Trophy,
  UsersRound,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import {
  getHighSpendersReport,
  getPendingCreditsReport,
  getRegularCustomersReport,
} from '../../services/reportService';

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
    gridTemplateColumns: 'minmax(0, 1.12fr) minmax(320px, 0.88fr)',
    gap: 12,
  },
  hero: {
    background: 'linear-gradient(135deg, #122033 0%, #244b5a 56%, #4d7c0f 100%)',
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
    alignContent: 'start',
    gap: 14,
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
    gridTemplateColumns: 'minmax(0, 1fr) 300px',
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

export default function ReportsPage() {
  const [highSpenders, setHighSpenders] = useState([]);
  const [regularCustomers, setRegularCustomers] = useState([]);
  const [pendingCredits, setPendingCredits] = useState([]);
  const [activeReport, setActiveReport] = useState('high-spenders');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadReports() {
      try {
        const [highSpendersResponse, regularCustomersResponse, pendingCreditsResponse] =
          await Promise.all([
            getHighSpendersReport(),
            getRegularCustomersReport(),
            getPendingCreditsReport(),
          ]);

        setHighSpenders(highSpendersResponse.data.data || []);
        setRegularCustomers(regularCustomersResponse.data.data || []);
        setPendingCredits(pendingCreditsResponse.data.data || []);
      } catch (requestError) {
        setError(getApiMessage(requestError, 'Could not load report data right now.'));
      }
    }

    loadReports();
  }, []);

  const reportConfig = useMemo(
    () => ({
      'high-spenders': {
        title: 'High Spenders',
        description: 'Customers ranked by total invoice value.',
        rows: highSpenders,
        columns: ['Customer', 'Invoices', 'Total Spent'],
        renderRow: (item) => (
          <>
            <td style={cellStyle.primary}>
              <div style={{ display: 'grid', gap: 3 }}>
                <strong style={{ fontSize: 14, color: '#111827' }}>{item.customerName}</strong>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Customer ID #{item.customerId}</span>
              </div>
            </td>
            <td style={cellStyle.middle}>{item.invoiceCount}</td>
            <td style={cellStyle.last}>
              <strong style={{ fontSize: 14, color: '#111827' }}>{formatMoney(item.totalSpent)}</strong>
            </td>
          </>
        ),
      },
      'regular-customers': {
        title: 'Regular Customers',
        description: 'Customers with the highest order activity.',
        rows: regularCustomers,
        columns: ['Customer', 'Orders'],
        renderRow: (item) => (
          <>
            <td style={cellStyle.primary}>
              <div style={{ display: 'grid', gap: 3 }}>
                <strong style={{ fontSize: 14, color: '#111827' }}>{item.customerName}</strong>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Customer ID #{item.customerId}</span>
              </div>
            </td>
            <td style={cellStyle.last}>
              <strong style={{ fontSize: 14, color: '#111827' }}>{item.orderCount}</strong>
            </td>
          </>
        ),
      },
      'pending-credits': {
        title: 'Pending Credits',
        description: 'Unpaid invoices that still need collection.',
        rows: pendingCredits,
        columns: ['Customer', 'Invoice', 'Due Date', 'Total'],
        renderRow: (item) => (
          <>
            <td style={cellStyle.primary}>
              <div style={{ display: 'grid', gap: 3 }}>
                <strong style={{ fontSize: 14, color: '#111827' }}>{item.customerName}</strong>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Customer ID #{item.customerId || '-'}</span>
              </div>
            </td>
            <td style={cellStyle.middle}>
              <div style={{ display: 'grid', gap: 3 }}>
                <strong style={{ fontSize: 13, color: '#111827' }}>#{item.invoiceId}</strong>
                <span style={{ fontSize: 12, color: '#6b7280' }}>{formatDate(item.invoiceDate)}</span>
              </div>
            </td>
            <td style={cellStyle.middle}>{formatDate(item.dueDate)}</td>
            <td style={cellStyle.last}>
              <strong style={{ fontSize: 14, color: '#111827' }}>{formatMoney(item.invoiceTotal)}</strong>
            </td>
          </>
        ),
      },
    }),
    [highSpenders, pendingCredits, regularCustomers]
  );

  const activeData = reportConfig[activeReport];
  const topSpender = highSpenders[0];
  const topRegularCustomer = regularCustomers[0];
  const pendingTotal = pendingCredits.reduce((sum, item) => sum + Number(item.invoiceTotal || 0), 0);

  return (
    <Layout title="Staff Reports">
      <div style={styles.page}>
        <div style={styles.topBand}>
          <section style={styles.hero} className="gp-fade-up">
            <div
              style={{
                position: 'absolute',
                inset: 'auto -36px -62px auto',
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
              <FileBarChart2 size={14} />
              Staff insights
            </div>
            <h2 style={{ fontSize: 28, lineHeight: 1.2, marginBottom: 10 }}>
              Track spending, repeat business, and unpaid invoices from one clear report workspace.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.84)', fontSize: 14, maxWidth: 560, marginBottom: 18 }}>
              Switch between the three required report views without losing context. The layout
              keeps the summary and detail tables balanced on the same page.
            </p>

            <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.74 }}>
                  Best spender
                </p>
                <strong style={{ fontSize: 24 }}>{topSpender?.customerName || 'No data yet'}</strong>
              </div>
              <div>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.74 }}>
                  Pending value
                </p>
                <strong style={{ fontSize: 24 }}>{formatMoney(pendingTotal)}</strong>
              </div>
              <div>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.74 }}>
                  Repeat customer
                </p>
                <strong style={{ fontSize: 24 }}>{topRegularCustomer?.customerName || 'No data yet'}</strong>
              </div>
            </div>
          </section>

          <aside style={styles.sideCard} className="gp-fade-up" data-delay="1">
            <div style={styles.titleWrap}>
              <div style={{ ...styles.iconBox, background: '#ecfdf5', color: '#15803d' }}>
                <Trophy size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, color: '#111827', marginBottom: 3 }}>Report Highlights</h3>
                <p style={{ fontSize: 13, color: '#6b7280' }}>A quick view before you open each table.</p>
              </div>
            </div>

            {[
              {
                label: 'Top spender',
                value: topSpender?.customerName || 'No customer yet',
                sub: topSpender ? formatMoney(topSpender.totalSpent) : 'No sales recorded',
              },
              {
                label: 'Most regular',
                value: topRegularCustomer?.customerName || 'No customer yet',
                sub: topRegularCustomer ? `${topRegularCustomer.orderCount} orders` : 'No orders recorded',
              },
              {
                label: 'Pending credits',
                value: `${pendingCredits.length} invoices`,
                sub: formatMoney(pendingTotal),
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: 14,
                  borderRadius: 14,
                  background: '#f8fafc',
                  border: '1px solid #e5e7eb',
                  display: 'grid',
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 12, color: '#6b7280' }}>{item.label}</span>
                <strong style={{ fontSize: 15, color: '#111827' }}>{item.value}</strong>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{item.sub}</span>
              </div>
            ))}
          </aside>
        </div>

        <div style={styles.stats}>
          {[
            {
              label: 'High Spenders',
              value: highSpenders.length,
              icon: <BadgeIndianRupee size={18} />,
              bg: '#ecfeff',
              accent: '#0f766e',
            },
            {
              label: 'Regular Customers',
              value: regularCustomers.length,
              icon: <UsersRound size={18} />,
              bg: '#eef2ff',
              accent: '#4f46e5',
            },
            {
              label: 'Pending Credits',
              value: pendingCredits.length,
              icon: <CreditCard size={18} />,
              bg: '#fff7ed',
              accent: '#c2410c',
            },
            {
              label: 'Pending Value',
              value: formatMoney(pendingTotal),
              icon: <AlertCircle size={18} />,
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
          <section style={styles.panel} className="gp-fade-up" data-delay="6">
            <div style={{ ...styles.titleWrap, marginBottom: 18 }}>
              <div style={styles.iconBox}>
                <FileBarChart2 size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 18, color: '#111827', marginBottom: 4 }}>{activeData.title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280' }}>{activeData.description}</p>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    {activeData.columns.map((column) => (
                      <th
                        key={column}
                        style={{
                          padding: '0 12px 8px',
                          fontSize: 12,
                          color: '#6b7280',
                          fontWeight: 700,
                        }}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeData.rows.map((item, index) => (
                    <tr key={`${activeReport}-${index}`} className="gp-table-row" style={{ animationDelay: `${index * 70}ms` }}>
                      {activeData.renderRow(item)}
                    </tr>
                  ))}
                  {!activeData.rows.length && (
                    <tr>
                      <td colSpan={activeData.columns.length} style={{ padding: '22px 8px' }}>
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
                          No report data available yet.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <aside style={styles.sideCard} className="gp-fade-up" data-delay="7">
            <div style={styles.titleWrap}>
              <div style={{ ...styles.iconBox, background: '#f0fdf4', color: '#15803d' }}>
                <Trophy size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, color: '#111827', marginBottom: 3 }}>Switch Report</h3>
                <p style={{ fontSize: 13, color: '#6b7280' }}>Move between report views without leaving the page.</p>
              </div>
            </div>

            {[
              ['high-spenders', 'High Spenders'],
              ['regular-customers', 'Regular Customers'],
              ['pending-credits', 'Pending Credits'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveReport(key)}
                style={{
                  ...styles.tabButton,
                  background: activeReport === key ? '#eefbf2' : '#fff',
                  borderColor: activeReport === key ? '#bbf7d0' : '#dbe3ea',
                  color: activeReport === key ? '#166534' : '#475569',
                  boxShadow: activeReport === key ? '0 14px 30px rgba(21, 128, 61, 0.10)' : 'none',
                }}
              >
                {label}
              </button>
            ))}
          </aside>
        </div>
      </div>
    </Layout>
  );
}

const cellBase = {
  padding: '14px 12px',
  background: '#fff',
  borderTop: '1px solid #eef2f7',
  borderBottom: '1px solid #eef2f7',
};

const cellStyle = {
  primary: {
    ...cellBase,
    borderLeft: '1px solid #eef2f7',
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  middle: cellBase,
  last: {
    ...cellBase,
    borderRight: '1px solid #eef2f7',
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
};
