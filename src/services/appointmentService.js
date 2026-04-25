import api from './api';

// Feature 13 — Appointments
export const bookAppointment = (customerId, data) =>
  api.post(`/customers/${customerId}/appointments`, data);

export const getAppointments = (customerId) =>
  api.get(`/customers/${customerId}/appointments`);

export const cancelAppointment = (customerId, appointmentId) =>
  api.put(`/customers/${customerId}/appointments/${appointmentId}/cancel`);

// Feature 13 — Unavailable Part Requests
export const requestUnavailablePart = (customerId, data) =>
  api.post(`/customers/${customerId}/unavailable-part-requests`, data);

export const getUnavailablePartRequests = (customerId) =>
  api.get(`/customers/${customerId}/unavailable-part-requests`);
