import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PaginatedDataTable from '../../components/PaginatedDataTable';
import { apiRequest, unwrapData } from '../../services/apiClient';
import { useToast } from '../../components/ToastProvider';

export default function VendorListPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadVendors();
  }, []);

  async function loadVendors() {
    setLoading(true);
    try {
      const payload = await apiRequest('/api/admin/vendors');
      setItems(unwrapData(payload));
    } finally {
      setLoading(false);
    }
  }

  async function deleteVendor(row) {
    try {
      await apiRequest(`/api/admin/vendors/${row.id}`, { method: 'DELETE' });
      showToast('Vendor deleted.', 'success');
      loadVendors();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  const filtered = items.filter((row) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return [row.name, row.email, row.phone, row.address].some((v) => String(v || '').toLowerCase().includes(term));
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <div className="row-actions">
          <Link to={`/admin/vendors/${r.id}/edit`} className="link-btn">Edit</Link>
          <Link to={`/admin/vendors/${r.id}/history`} className="link-btn">History</Link>
          <button type="button" className="link-btn" onClick={() => deleteVendor(r)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <section className="feature-hero">
        <div><h1>Vendor Management</h1></div>
        <Link to="/admin/vendors/add" className="btn-primary"><Plus size={16} /> Add Vendor</Link>
      </section>
      {loading && <p className="status-text">Loading vendors...</p>}
      <PaginatedDataTable columns={columns} rows={filtered} page={1} pageSize={filtered.length || 10} totalCount={filtered.length} totalPages={1} search={search} onSearchChange={setSearch} />
    </>
  );
}
