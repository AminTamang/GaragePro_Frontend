import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import LoadingState from '../../components/LoadingState';
import AlertBanner from '../../components/AlertBanner';
import PaginatedDataTable from '../../components/PaginatedDataTable';
import { apiRequest } from '../../services/apiClient';

export default function CustomerSearchPage() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function handleSearch(event) {
    event?.preventDefault();
    if (!keyword.trim()) {
      setError('Enter a name, phone, email, or vehicle plate.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = await apiRequest(`/api/staff/customers/search?keyword=${encodeURIComponent(keyword.trim())}`);
      const data = Array.isArray(payload.data) ? payload.data : [];
      setResults(data);
      setSearched(true);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!keyword.trim()) {
      if (searched) {
        setResults([]);
        setSearched(false);
      }
      return;
    }
    const timer = setTimeout(() => {
      handleSearch();
    }, 400);
    return () => clearTimeout(timer);
  }, [keyword]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Customer' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { 
      key: 'vehiclePlate', 
      label: 'Vehicle',
      render: (row) => row.vehicles?.length > 0 ? row.vehicles[0].vehiclePlate : '-'
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <Link to={`/staff/customers/details?id=${row.id}`} className="link-btn">
          <User size={14} /> View
        </Link>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Staff / Customers"
        title="Customer Search"
        description="Find customers by name, phone, email, or vehicle registration."
      />

      <section className="panel-card search-card">
        <form className="inline-search-form" onSubmit={handleSearch}>
          <label className="search-field search-field-lg">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search customers... (type to see results)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </label>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </section>

      <AlertBanner type="error">{error}</AlertBanner>
      {loading && <LoadingState label="Searching customers..." />}

      {searched && !loading && (
        <section className="panel-card table-card animate-in">
          <PaginatedDataTable
            columns={columns}
            rows={results}
            page={1}
            pageSize={results.length || 10}
            totalCount={results.length}
            totalPages={1}
            emptyMessage="No customers matched your search."
          />
        </section>
      )}
    </>
  );
}
