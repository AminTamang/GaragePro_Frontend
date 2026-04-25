import api from './api';

// Feature 16 — Loyalty discount preview
// Reusable: Piyush's sales invoice page also imports this
export const getDiscountPreview = (customerId, purchaseTotal) =>
  api.get(`/customers/${customerId}/loyalty/discount-preview`, {
    params: { purchaseTotal },
  });
