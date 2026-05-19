export function buildPagedQuery({ page = 1, pageSize = 10, search = '', sortBy = '', sortDir = 'desc', filters = {} } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  if (search?.trim()) params.set('search', search.trim());
  if (sortBy) params.set('sortBy', sortBy);
  if (sortDir) params.set('sortDir', sortDir);
  if (filters && typeof filters === 'object') {
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      params.set(key, String(value));
    });
  }
  return params.toString();
}

export function unwrapPagedData(payload) {
  const data = payload?.data ?? payload;

  if (data?.items) {
    return {
      items: data.items,
      page: data.page ?? 1,
      pageSize: data.pageSize ?? 10,
      totalCount: data.totalCount ?? data.items.length,
      totalPages: data.totalPages ?? 1,
      hasPrevious: data.hasPrevious ?? false,
      hasNext: data.hasNext ?? false,
      ...data,
    };
  }

  if (Array.isArray(data)) {
    return {
      items: data,
      page: 1,
      pageSize: data.length,
      totalCount: data.length,
      totalPages: 1,
      hasPrevious: false,
      hasNext: false,
    };
  }

  return {
    items: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPrevious: false,
    hasNext: false,
  };
}
