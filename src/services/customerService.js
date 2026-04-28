import api from './api';

export const getCustomers = () => api.get('/customers');

export const getCustomerById = (id) => api.get(`/customers/${id}`);

export const registerCustomer = (data) => api.post('/customers/register', data);

export const getPurchaseHistory = (customerId) =>
  api.get(`/customers/${customerId}/history/purchases`);

export const getServiceHistory = (customerId) =>
  api.get(`/customers/${customerId}/history/services`);
