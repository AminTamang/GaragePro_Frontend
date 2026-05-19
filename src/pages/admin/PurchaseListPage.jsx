import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PaginatedDataTable from '../../components/PaginatedDataTable';
import { apiRequest, unwrapData } from '../../services/apiClient';

export default function PurchaseListPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const payload = await apiRequest('/api/admin/purchases');
        setItems(unwrapData(payload));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = items.filter((row) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return [row.id, row.vendorName, row.notes].some((v) => String(v || '').toLowerCase().includes(term));
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'vendorName', label: 'Vendor' },
    { key: 'purchaseTotal', label: 'Total', render: (r) => `Rs. ${Number(r.purchaseTotal).toLocaleString()}` },
    { key: 'purchaseDate', label: 'Date', render: (r) => new Date(r.purchaseDate).toLocaleDateString() },
    { key: 'actions', label: '', render: (r) => <Link to={`/admin/purchases/${r.id}`} className="link-btn">View</Link> },
  ];

  return (
    <>
      <section className="feature-hero">
        <div>
          <span className="eyebrow">Admin / Purchases</span>
          <h1>Purchase Invoices</h1>
          <p>Vendor purchases that increase part stock.</p>
        </div>
        <Link to="/admin/purchases/create" className="btn-primary"><Plus size={16} /> New Purchase</Link>
      </section>
      {loading && <p className="status-text">Loading purchases...</p>}
      <PaginatedDataTable columns={columns} rows={filtered} page={1} pageSize={filtered.length || 10} totalCount={filtered.length} totalPages={1} search={search} onSearchChange={setSearch} />
    </>
  );
}
