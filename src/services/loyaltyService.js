import api from './api';

// Feature 16 — Loyalty discount preview
// Piyush's SalesInvoicePage can also import and call this
export const getDiscountPreview = (purchaseTotal) =>
  api.get('/loyalty/preview', { params: { purchaseTotal } });
