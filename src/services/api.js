import axios from 'axios';

// Base URL for the VehiclePartsApi backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5006/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
