import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import LoadingState from '../../components/LoadingState';
import AlertBanner from '../../components/AlertBanner';
import PaginatedDataTable from '../../components/PaginatedDataTable';
import { apiRequest } from '../../services/apiClient';
import { downloadCsv, printPdf } from '../../utils/exportUtils';

const REPORTS = [
  { path: '/staff/reports/high-spenders', href: '/staff/reports/high-spenders', title: 'High Spenders', api: '/api/staff/customers/reports/high-spenders', description: 'Customers with the highest total spend.' },
  { path: '/staff/reports/regular-customers', href: '/staff/reports/regular-customers', title: 'Regular Customers', api: '/api/staff/customers/reports/regulars', description: 'Frequent visitors and repeat business.' },
  { path: '/staff/reports/pending-credits', href: '/staff/reports/pending-credits', title: 'Pending Credits', api: '/api/staff/customers/reports/pending-credits', description: 'Customers with unpaid credits overdue by more than 1 month.' },
  { path: '/admin/customer-analytics', href: '/admin/customer-analytics', title: 'Customer Analytics', api: '/api/staff/customers/reports/high-spenders', description: 'Overview of top customer segments.' },
];

export default function CustomerReportsPage() {
  const location = useLocation();
  const config = REPORTS.find((r) => r.path === location.pathname) || REPORTS[0];
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ minSpend: '', minVisits: '', minOverdueDays: '' });

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const payload = await apiRequest(config.api);
        setRows(Array.isArray(payload.data) ? payload.data : []);
      } catch (err) {
        setError(err.message);
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [config.api]);

  useEffect(() => {
    setFilters({ minSpend: '', minVisits: '', minOverdueDays: '' });
  }, [config.path]);

  const columns = [
    { key: 'customerId', label: 'ID' },
    { key: 'customerName', label: 'Customer', render: (r) => r.customerName || r.fullName },
    { key: 'totalSpend', label: 'Total Spend', render: (r) => r.totalSpend != null ? `Rs. ${Number(r.totalSpend).toLocaleString()}` : '-' },
    { key: 'visitCount', label: 'Visits', render: (r) => r.visitCount ?? r.visits ?? '-' },
    { key: 'pendingCredit', label: 'Credit', render: (r) => r.pendingCredit != null ? `Rs. ${Number(r.pendingCredit).toLocaleString()}` : (r.credit ?? '-') },
    { key: 'overdueDays', label: 'Overdue Days', render: (r) => r.overdueDays ?? r.creditOverdueDays ?? '-' },
  ];

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const spendOk = filters.minSpend ? Number(row.totalSpend || 0) >= Number(filters.minSpend) : true;
      const visitsOk = filters.minVisits ? Number(row.visitCount || row.visits || 0) >= Number(filters.minVisits) : true;
      const overdueOk = filters.minOverdueDays ? Number(row.overdueDays || row.creditOverdueDays || 0) >= Number(filters.minOverdueDays) : true;
      return spendOk && visitsOk && overdueOk;
    });
  }, [rows, filters]);

  function exportCsv() {
    downloadCsv(`garagepro-${config.title.toLowerCase().replace(/\s/g, '-')}.csv`, filteredRows, [
      { key: 'customerId', label: 'ID' },
      { key: 'customerName', label: 'Customer', value: (r) => r.customerName || r.fullName },
      { key: 'totalSpend', label: 'Total Spend', value: (r) => r.totalSpend ?? '-' },
      { key: 'visitCount', label: 'Visits', value: (r) => r.visitCount ?? r.visits ?? '-' },
      { key: 'pendingCredit', label: 'Credit', value: (r) => r.pendingCredit ?? r.credit ?? '-' },
      { key: 'overdueDays', label: 'Overdue Days', value: (r) => r.overdueDays ?? r.creditOverdueDays ?? '-' },
    ]);
  }

  function exportPdf() {
    printPdf({
      title: `GaragePro ${config.title}`,
      subtitle: config.description,
      columns: [
        { key: 'customerId', label: 'ID' },
        { key: 'customerName', label: 'Customer' },
        { key: 'totalSpend', label: 'Total Spend' },
        { key: 'visitCount', label: 'Visits' },
        { key: 'pendingCredit', label: 'Credit' },
        { key: 'overdueDays', label: 'Overdue Days' },
      ],
      rows: filteredRows.map((row) => ({
        customerId: row.customerId,
        customerName: row.customerName || row.fullName,
        totalSpend: row.totalSpend ?? '-',
        visitCount: row.visitCount ?? row.visits ?? '-',
        pendingCredit: row.pendingCredit ?? row.credit ?? '-',
        overdueDays: row.overdueDays ?? row.creditOverdueDays ?? '-',
      })),
    });
  }

  const tabs = location.pathname.startsWith('/admin')
    ? [REPORTS[3]]
  : REPORTS.slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title={config.title}
        description={config.description}
        actions={
          <div className="action-row">
            <button type="button" className="btn-secondary" onClick={exportCsv} disabled={!filteredRows.length}>CSV</button>
            <button type="button" className="btn-secondary" onClick={exportPdf} disabled={!filteredRows.length}>PDF</button>
          </div>
        }
      />

      {tabs.length > 1 && (
        <nav className="report-tabs">
          {tabs.map((tab) => (
            <Link key={tab.href} to={tab.href} className={`report-tab ${tab.path === location.pathname ? 'active' : ''}`}>
              {tab.title}
            </Link>
          ))}
        </nav>
      )}

      <section className="panel-card filter-card">
        <div className="filter-row">
          <label>
            Min Spend
            <input type="number" min="0" value={filters.minSpend} onChange={(e) => setFilters((p) => ({ ...p, minSpend: e.target.value }))} />
          </label>
          <label>
            Min Visits
            <input type="number" min="0" value={filters.minVisits} onChange={(e) => setFilters((p) => ({ ...p, minVisits: e.target.value }))} />
          </label>
          {config.path.includes('pending-credits') && (
            <label>
              Overdue Days
              <input type="number" min="0" value={filters.minOverdueDays} onChange={(e) => setFilters((p) => ({ ...p, minOverdueDays: e.target.value }))} />
            </label>
          )}
        </div>
      </section>

      <AlertBanner type="error">{error}</AlertBanner>
      {loading ? <LoadingState /> : (
        <section className="panel-card table-card animate-in">
          <PaginatedDataTable
            columns={columns}
            rows={filteredRows}
            page={1}
            pageSize={filteredRows.length || 10}
            totalCount={filteredRows.length}
            totalPages={1}
            emptyMessage="No records for this report."
          />
        </section>
      )}
    </>
  );
}
