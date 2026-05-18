import api from './api';

// Feature 6 — Register customer then attach vehicle
export const registerCustomer = (data) =>
  api.post('/customers/register', data);

export const addVehicle = (customerId, data) =>
  api.post(`/customers/${customerId}/vehicles`, data);

// Feature 8 — Get customer by ID (includes vehicles)
export const getCustomerById = (id) =>
  api.get(`/customers/${id}`);

// Feature 10 — Search customers by name, phone, email, plate, ID
export const searchCustomers = (query) =>
  api.get('/customers', { params: { q: query } });
