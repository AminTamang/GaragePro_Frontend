import api from './api';

export const getHighSpendersReport = () => api.get('/staff/reports/high-spenders');

export const getRegularCustomersReport = () => api.get('/staff/reports/regular-customers');

export const getPendingCreditsReport = () => api.get('/staff/reports/pending-credits');
