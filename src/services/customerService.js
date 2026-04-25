import api from './api';

// Feature 6 — Staff registers a new customer with vehicle details
export const registerCustomer = (data) =>
  api.post('/staff/customers', data);

// Feature 8 — Staff gets full customer details (profile, vehicles, history)
export const getCustomerById = (id) =>
  api.get(`/staff/customers/${id}`);

export const getCustomerDetails = (id) =>
  api.get(`/staff/customers/${id}/details`);
