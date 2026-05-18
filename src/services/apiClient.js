export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5006';

export function getAuthToken() {
  return localStorage.getItem('garagepro_token') || '';
}

export function setAuthToken(token) {
  localStorage.setItem('garagepro_token', token.trim());
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = payload?.message || payload?.title || `Request failed with ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

export function unwrapData(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (payload?.data) return Array.isArray(payload.data) ? payload.data : [payload.data];
  return [];
}
