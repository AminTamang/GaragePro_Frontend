import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export default function PaginatedDataTable({
  columns,
  rows,
  page,
  pageSize,
  totalCount,
  totalPages,
  search = '',
  onSearchChange,
  sortBy,
  sortDir = 'desc',
  onSort,
  onPageChange,
  onPageSizeChange,
  emptyMessage = 'No records found.',
  actions,
}) {
  function handleSort(column) {
    if (!column.sortKey || !onSort) return;
    const nextDir = sortBy === column.sortKey && sortDir === 'asc' ? 'desc' : 'asc';
    onSort(column.sortKey, nextDir);
  }

  return (
    <div className="paged-table">
      <div className="table-toolbar">
        {onSearchChange && (
          <label className="search-field">
            <Search size={16} />
            <input
              type="search"
              placeholder="Search..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </label>
        )}
        {actions}
        {onPageSizeChange && (
          <label className="page-size-field">
            Rows
            <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="table-wrap">
        <table className="report-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>
                  {col.sortKey && onSort ? (
                    <button type="button" className="sort-btn" onClick={() => handleSort(col)}>
                      {col.label}
                      {sortBy === col.sortKey ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty-cell">{emptyMessage}</td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id ?? row.partId ?? row.invoiceId ?? index}>
                  {columns.map((col) => (
                    <td key={col.key}>{col.render ? col.render(row) : row[col.key] ?? '-'}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {onPageChange && (
        <div className="table-pagination">
          <span>{totalCount} record{totalCount === 1 ? '' : 's'}</span>
          <div className="pagination-controls">
            <button type="button" className="btn-secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
              <ChevronLeft size={16} /> Prev
            </button>
            <span>Page {page} of {Math.max(totalPages, 1)}</span>
            <button type="button" className="btn-secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
