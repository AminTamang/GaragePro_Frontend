import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import AlertBanner from '../../components/AlertBanner';
import PaginatedDataTable from '../../components/PaginatedDataTable';
import { usePagedList } from '../../hooks/usePagedList';
import { apiRequest } from '../../services/apiClient';

const columns = [
  { key: 'purchaseId', label: 'Purchase #', render: (r) => r.purchaseId || r.id },
  {
    key: 'purchaseDate',
    label: 'Date',
    sortKey: 'date',
    render: (r) => new Date(r.purchaseDate || r.createdAt || r.date).toLocaleDateString(),
  },
  { key: 'purchaseTotal', label: 'Total', render: (r) => `Rs. ${Number(r.purchaseTotal ?? r.totalAmount ?? r.total ?? 0).toLocaleString()}` },
  { key: 'status', label: 'Status', render: (r) => r.status || r.state || '-' },
  { key: 'notes', label: 'Notes', render: (r) => r.notes || '-' },
  {
    key: 'actions',
    label: '',
    render: (r) => (
      <Link to={`/admin/purchases/${r.purchaseId || r.id}`} className="link-btn">View</Link>
    ),
  },
];

export default function VendorHistoryPage() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState('');
  const list = usePagedList(`/api/admin/vendors/${id}/history`, { initialSortBy: 'date', initialSortDir: 'desc' });

  useEffect(() => {
    (async () => {
      setError('');
      try {
        const payload = await apiRequest(`/api/admin/vendors/${id}`);
        setVendor(payload.data || null);
      } catch (err) {
        setError(err.message);
        setVendor(null);
      }
    })();
  }, [id]);

  return (
    <>
      <PageHeader
        eyebrow="Admin / Vendors"
        title={vendor?.name ? `Vendor History — ${vendor.name}` : `Vendor History #${id}`}
        description="Purchase history and performance for this vendor."
        actions={<Link to="/admin/vendors" className="btn-secondary">Back to vendors</Link>}
      />

      <AlertBanner type="error">{error || list.error}</AlertBanner>

      <section className="panel-card table-card animate-in">
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
          emptyMessage="No purchase history found for this vendor."
        />
      </section>
    </>
  );
}
