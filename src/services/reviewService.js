import api from './api';

// Feature 13 — Reviews
export const submitReview = (customerId, data) =>
  api.post(`/customers/${customerId}/reviews`, data);

export const getReviews = (customerId) =>
  api.get(`/customers/${customerId}/reviews`);
