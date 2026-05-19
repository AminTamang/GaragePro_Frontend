import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, History, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import LoadingState from '../../components/LoadingState';
import AlertBanner from '../../components/AlertBanner';
import PaginatedDataTable from '../../components/PaginatedDataTable';
import { usePagedList } from '../../hooks/usePagedList';
import { apiRequest } from '../../services/apiClient';
import { useToast } from '../../components/ToastProvider';
import { getPreferences } from '../../utils/userPreferences';

const columns = [
  { key: 'partId', label: 'ID', sortKey: 'id' },
  { key: 'partName', label: 'Name', sortKey: 'name' },
  { key: 'partSku', label: 'SKU' },
  { key: 'partCategory', label: 'Category' },
  { key: 'partStockQty', label: 'Stock', sortKey: 'stock' },
  { key: 'partUnitPrice', label: 'Price', sortKey: 'price', render: (row) => `Rs. ${Number(row.partUnitPrice).toLocaleString()}` },
  {
    key: 'actions',
    label: 'Actions',
    render: (row) => (
      <div className="row-actions">
        <Link to={`/admin/parts/${row.partId}/edit`} className="link-btn">Edit</Link>
        <Link to={`/admin/parts/${row.partId}/stock-history`} className="link-btn"><History size={14} /> History</Link>
      </div>
    ),
  },
];

export default function PartsListPage() {
  const { showToast } = useToast();
  const prefs = getPreferences('Admin');
  const [filters, setFilters] = useState({ category: '', stockLevel: '' });
  const queryFilters = useMemo(
    () => ({
      category: filters.category || undefined,
      stockLevel: filters.stockLevel || undefined,
      threshold: filters.stockLevel === 'low' ? prefs.lowStockThreshold : undefined,
    }),
    [filters, prefs.lowStockThreshold]
  );
  const list = usePagedList('/api/admin/parts', {
    initialSortBy: 'name',
    initialSortDir: 'asc',
    filters: queryFilters,
  });

  const categories = Array.from(
    new Set(list.items.map((item) => item.partCategory).filter(Boolean))
  );

  async function deletePart(row) {
    try {
      await apiRequest(`/api/admin/parts/${row.partId}`, { method: 'DELETE' });
      showToast('Part deleted.', 'success');
      list.reload();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  const enrichedColumns = columns.map((col) =>
    col.key === 'actions'
      ? {
        ...col,
        render: (row) => (
          <div className="row-actions">
            <Link to={`/admin/parts/${row.partId}/edit`} className="link-btn">Edit</Link>
            <Link to={`/admin/parts/${row.partId}/stock-history`} className="link-btn"><History size={14} /> History</Link>
            <button type="button" className="link-btn" onClick={() => deletePart(row)}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        ),
      }
      : col
  );

  return (
    <>
      <PageHeader
        eyebrow="Admin / Inventory"
        title="Parts Management"
        description="Browse, search, and manage parts inventory with stock levels and pricing."
        actions={<Link to="/admin/parts/add" className="btn-primary"><Plus size={16} /> Add Part</Link>}
      />

      <AlertBanner type="error">{list.error}</AlertBanner>
      {list.loading ? <LoadingState label="Loading parts..." /> : (
        <section className="panel-card table-card animate-in">
          <div className="filter-bar">
            <label>
              Category
              <select value={filters.category} onChange={(e) => { setFilters((p) => ({ ...p, category: e.target.value })); list.setPage(1); }}>
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
            <label>
              Stock Level
              <select value={filters.stockLevel} onChange={(e) => { setFilters((p) => ({ ...p, stockLevel: e.target.value })); list.setPage(1); }}>
                <option value="">All</option>
                <option value="low">Low stock (&lt; {prefs.lowStockThreshold})</option>
                <option value="out">Out of stock</option>
                <option value="in">In stock</option>
              </select>
            </label>
          </div>
          <PaginatedDataTable
            columns={enrichedColumns}
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
        </section>
      )}
    </>
  );
}
