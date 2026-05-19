import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PaginatedDataTable from '../../components/PaginatedDataTable';
import { apiRequest, unwrapData } from '../../services/apiClient';
import { useToast } from '../../components/ToastProvider';

export default function StaffListPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  async function loadStaff() {
    setLoading(true);
    try {
      const payload = await apiRequest('/api/admin/staff');
      setItems(unwrapData(payload));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStaff();
  }, []);

  function getActiveStatus(row) {
    if (row.isActive !== undefined) return Boolean(row.isActive);
    if (row.active !== undefined) return Boolean(row.active);
    if (row.status) return String(row.status).toLowerCase() === 'active';
    return true;
  }

  async function toggleStatus(row) {
    const nextActive = !getActiveStatus(row);
    const body = {
      fullName: row.fullName,
      email: row.email,
      staffRole: row.staffRole,
      phoneNumber: row.phoneNumber,
      isActive: nextActive,
      status: nextActive ? 'Active' : 'Inactive',
    };
    try {
      await apiRequest(`/api/admin/staff/${row.id}`, { method: 'PUT', body: JSON.stringify(body) });
      showToast(`Staff ${nextActive ? 'activated' : 'deactivated'}.`, 'success');
      loadStaff();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function deleteStaff(row) {
    try {
      await apiRequest(`/api/admin/staff/${row.id}`, { method: 'DELETE' });
      showToast('Staff deleted.', 'success');
      loadStaff();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  const filtered = items.filter((row) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return [row.fullName, row.email, row.staffRole, row.phoneNumber].some((v) => String(v || '').toLowerCase().includes(term));
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'staffRole', label: 'Role' },
    { key: 'phoneNumber', label: 'Phone' },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span className={`status-pill ${getActiveStatus(r) ? 'status-paid' : 'status-overdue'}`}>
          {getActiveStatus(r) ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <div className="row-actions">
          <Link to={`/admin/staff/${r.id}/edit`} className="link-btn">Edit</Link>
          <button type="button" className="link-btn" onClick={() => toggleStatus(r)}>
            {getActiveStatus(r) ? 'Deactivate' : 'Activate'}
          </button>
          <button type="button" className="link-btn" onClick={() => deleteStaff(r)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <section className="feature-hero">
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Staff Management</h1>
        </div>
        <Link to="/admin/staff/add" className="btn-primary"><Plus size={16} /> Add Staff</Link>
      </section>
      {loading && <p className="status-text">Loading staff...</p>}
      <PaginatedDataTable
        columns={columns}
        rows={filtered}
        page={1}
        pageSize={filtered.length || 10}
        totalCount={filtered.length}
        totalPages={1}
        search={search}
        onSearchChange={setSearch}
      />
    </>
  );
}
