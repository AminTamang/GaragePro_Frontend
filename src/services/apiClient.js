import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5006';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function friendlyError(error) {
  if (error instanceof SyntaxError) return 'The API returned an unreadable response.';
  if (error?.name === 'TypeError' || error?.message === 'Failed to fetch') {
    return `Could not reach the API at ${API_BASE_URL}. Start the GaragePro backend and confirm PostgreSQL is running.`;
  }
  return error?.message || 'The API request could not be completed.';
}

export function getAuthToken() {
  return localStorage.getItem('garagepro_token') || '';
}

export function setAuthToken(token) {
  localStorage.setItem('garagepro_token', token.trim());
}

export function clearAuthToken() {
  localStorage.removeItem('garagepro_token');
}

export async function apiRequest(path, options = {}) {
  try {
    const response = await axiosClient.request({
      url: path,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(options.body) : undefined,
      headers: options.headers,
    });

    return response.data;
  } catch (error) {
    let message = error.response?.data?.message || error.response?.data?.title || friendlyError(error);
    
    // Append detailed errors if present (ApiResponse.Errors array or ASP.NET validation errors object)
    if (error.response?.data?.errors) {
      const errs = error.response.data.errors;
      if (Array.isArray(errs)) {
        message += ' ' + errs.join(' ');
      } else if (typeof errs === 'object') {
        const errMessages = Object.values(errs).flat();
        message += ' ' + errMessages.join(' ');
      }
    }
    
    throw new Error(message);
  }
}

export function unwrapData(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (payload?.data) return Array.isArray(payload.data) ? payload.data : [payload.data];
  return [];
}
