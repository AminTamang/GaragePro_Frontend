import { Link, useParams } from 'react-router-dom';
import PaginatedDataTable from '../../components/PaginatedDataTable';
import { usePagedList } from '../../hooks/usePagedList';

const columns = [
  { key: 'createdAt', label: 'Date', sortKey: 'date', render: (row) => new Date(row.createdAt).toLocaleString() },
  { key: 'movementType', label: 'Type', sortKey: 'type' },
  { key: 'quantityChange', label: 'Change', sortKey: 'quantity', render: (row) => (row.quantityChange > 0 ? `+${row.quantityChange}` : row.quantityChange) },
  { key: 'quantityAfter', label: 'Stock After' },
  { key: 'referenceId', label: 'Reference' },
  { key: 'notes', label: 'Notes' },
];

export default function StockHistoryPage() {
  const { id } = useParams();
  const list = usePagedList(`/api/admin/parts/${id}/stock-history`, { initialSortBy: 'date', initialSortDir: 'desc' });
  const partName = list.items[0]?.partName || `Part #${id}`;

  return (
    <>
      <section className="feature-hero">
        <div>
          <span className="eyebrow">Admin / Inventory</span>
          <h1>Stock History — {partName}</h1>
          <p>Audit trail of purchases, sales, and stock adjustments for this part.</p>
        </div>
        <Link to="/admin/parts" className="btn-secondary">Back to parts</Link>
      </section>

      {list.error && <p className="status-error">{list.error}</p>}
      {list.loading && <p className="status-text">Loading stock history...</p>}

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
        emptyMessage="No stock movements recorded yet."
      />
    </>
  );
}
