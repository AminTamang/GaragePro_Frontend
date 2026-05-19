import { useEffect, useState } from 'react';
import PaginatedDataTable from '../../components/PaginatedDataTable';
import { apiRequest } from '../../services/apiClient';
import { buildPagedQuery, unwrapPagedData } from '../../utils/pagedApi';

const columns = [
  { key: 'partName', label: 'Part' },
  { key: 'partSku', label: 'SKU' },
  { key: 'partCategory', label: 'Category' },
  { key: 'stockQty', label: 'Qty' },
  { key: 'unitPrice', label: 'Unit Price', render: (r) => `Rs. ${Number(r.unitPrice).toLocaleString()}` },
  { key: 'stockValue', label: 'Value', render: (r) => `Rs. ${Number(r.stockValue).toLocaleString()}` },
  {
    key: 'stockStatus',
    label: 'Status',
    render: (r) => (
      <span className={`status-pill status-${r.stockStatus.replace(/\s/g, '-').toLowerCase()}`}>{r.stockStatus}</span>
    ),
  },
];

export default function InventoryReportPage() {
  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const query = buildPagedQuery({ page, pageSize, search });
        const payload = await apiRequest(`/api/admin/reports/inventory?${query}`);
        const data = payload.data || {};
        setSummary({
          totalParts: data.totalParts,
          lowStockCount: data.lowStockCount,
          outOfStockCount: data.outOfStockCount,
          totalInventoryValue: data.totalInventoryValue,
        });
        const paged = unwrapPagedData(payload);
        setItems(paged.items);
        setTotalCount(paged.totalCount);
        setTotalPages(paged.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [page, pageSize, search]);

  return (
    <>
      <section className="feature-hero">
        <div>
          <span className="eyebrow">Admin / Reports</span>
          <h1>Inventory Report</h1>
          <p>Stock valuation, low-stock alerts, and out-of-stock summary.</p>
        </div>
      </section>

      {summary && (
        <section className="kpi-grid">
          <article className="kpi-card"><span>Total Parts</span><strong>{summary.totalParts}</strong></article>
          <article className="kpi-card"><span>Low Stock</span><strong>{summary.lowStockCount}</strong></article>
          <article className="kpi-card"><span>Out of Stock</span><strong>{summary.outOfStockCount}</strong></article>
          <article className="kpi-card"><span>Inventory Value</span><strong>Rs. {Number(summary.totalInventoryValue).toLocaleString()}</strong></article>
        </section>
      )}

      {error && <p className="status-error">{error}</p>}
      {loading && <p className="status-text">Loading report...</p>}

      <PaginatedDataTable
        columns={columns}
        rows={items}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        totalPages={totalPages}
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        onPageChange={setPage}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
      />
    </>
  );
}
