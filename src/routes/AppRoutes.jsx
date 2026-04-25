import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DashboardPage from '../pages/DashboardPage';

// Staff pages — Feature 6 & 8
import RegisterCustomerPage from '../pages/staff/RegisterCustomerPage';
import CustomerDetailsPage from '../pages/staff/CustomerDetailsPage';

// Customer pages — Feature 13
import AppointmentsPage from '../pages/customer/AppointmentsPage';
import UnavailablePartsPage from '../pages/customer/UnavailablePartsPage';
import ReviewsPage from '../pages/customer/ReviewsPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                          element={<DashboardPage />} />
        <Route path="/staff/register-customer"   element={<RegisterCustomerPage />} />
        <Route path="/staff/customers"           element={<CustomerDetailsPage />} />
        <Route path="/customer/appointments"     element={<AppointmentsPage />} />
        <Route path="/customer/unavailable-parts" element={<UnavailablePartsPage />} />
        <Route path="/customer/reviews"          element={<ReviewsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
