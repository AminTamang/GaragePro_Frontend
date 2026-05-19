import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PaginatedDataTable from '../../components/PaginatedDataTable';
import { usePagedList } from '../../hooks/usePagedList';

const columns = [
  { key: 'invoiceId', label: 'Invoice #' },
  { key: 'orderId', label: 'Order #' },
  { key: 'customerName', label: 'Customer', sortKey: 'customer' },
  { key: 'vehiclePlate', label: 'Vehicle' },
  { key: 'finalTotal', label: 'Total', sortKey: 'total', render: (r) => `Rs. ${Number(r.finalTotal).toLocaleString()}` },
  { key: 'discountPct', label: 'Discount', render: (r) => `${r.discountPct}%` },
  { key: 'isPaid', label: 'Paid', render: (r) => (r.isPaid ? 'Yes' : 'No') },
  {
    key: 'emailStatus',
    label: 'Email',
    render: (r) => (
      <span className={`status-pill ${r.invoiceEmailed ? 'status-sent' : 'status-draft'}`}>
        {r.invoiceEmailed ? 'Sent' : 'Not sent'}
      </span>
    ),
  },
  { key: 'invoiceDate', label: 'Date', sortKey: 'date', render: (r) => new Date(r.invoiceDate).toLocaleDateString() },
  {
    key: 'actions',
    label: '',
    render: (r) => (
      <div className="row-actions">
        <Link to={`/staff/invoices/${r.invoiceId}`} className="link-btn">View</Link>
      </div>
    ),
  },
];

export default function SalesHistoryPage() {
  const list = usePagedList('/api/staff/sales', { initialSortBy: 'date', initialSortDir: 'desc' });

  return (
    <>
      <section className="feature-hero">
        <div>
          <span className="eyebrow">Staff / Sales</span>
          <h1>Sales History</h1>
          <p>Search and review completed sales and invoices.</p>
        </div>
        <Link to="/staff/sales/create" className="btn-primary"><Plus size={16} /> New Sale</Link>
      </section>

      {list.error && <p className="status-error">{list.error}</p>}
      {list.loading && <p className="status-text">Loading sales...</p>}

      <PaginatedDataTable
        columns={columns}
        rows={list.items}
        page={list.page}
        pageSize={list.pageSize}
        totalCount={list.totalCount}
        totalPages={list.totalPages}
        search={list.search}
        onSearchChange={(v) => { list.setSearch(v); list.setPage(1); }}
        sortBy={list.sortBy}
        sortDir={list.sortDir}
        onSort={list.handleSort}
        onPageChange={list.setPage}
        onPageSizeChange={(size) => { list.setPageSize(size); list.setPage(1); }}
      />
    </>
  );
}
