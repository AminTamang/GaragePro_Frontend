import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../services/apiClient';
import { buildPagedQuery, unwrapPagedData } from '../utils/pagedApi';

export function usePagedList(path, { initialSortBy = '', initialSortDir = 'desc', enabled = true, filters = {} } = {}) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDir, setSortDir] = useState(initialSortDir);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [meta, setMeta] = useState({});

  const filtersJson = JSON.stringify(filters);

  const load = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError('');
    try {
      const query = buildPagedQuery({ page, pageSize, search, sortBy, sortDir, filters });
      const payload = await apiRequest(`${path}?${query}`);
      const paged = unwrapPagedData(payload);
      setItems(paged.items);
      setTotalCount(paged.totalCount);
      setTotalPages(paged.totalPages);
      setMeta(paged);
    } catch (err) {
      setError(err.message || 'Failed to load data.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [path, page, pageSize, search, sortBy, sortDir, enabled, filtersJson]);

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  function handleSort(nextSortBy, nextSortDir) {
    setSortBy(nextSortBy);
    setSortDir(nextSortDir);
    setPage(1);
  }

  return {
    items,
    page,
    pageSize,
    search,
    sortBy,
    sortDir,
    totalCount,
    totalPages,
    loading,
    error,
    meta,
    setPage,
    setPageSize,
    setSearch,
    handleSort,
    reload: load,
  };
}
