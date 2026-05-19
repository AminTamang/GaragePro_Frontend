import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Layout from './components/Layout';
import { ToastProvider } from './components/ToastProvider';
import AboutPage from './pages/public/AboutPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import NotFoundPage from './pages/errors/NotFoundPage';
import UnauthorizedPage from './pages/errors/UnauthorizedPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/shared/SettingsPage';
import FinancialReportsPage from './pages/FinancialReportsPage';
import VendorManagementPage from './pages/VendorManagementPage';
import CustomerSearchPage from './pages/CustomerSearchPage';
import StaffManagementPage from './pages/StaffManagementPage';
import PurchaseStockPage from './pages/PurchaseStockPage';
import CustomerRegistrationPage from './pages/CustomerRegistrationPage';
import NotificationsPage from './pages/NotificationsPage';
import PartsManagementPage from './pages/PartsManagementPage';
import SalesInvoicePage from './pages/SalesInvoicePage';
import CustomerReportsPage from './pages/CustomerReportsPage';
import PurchaseServiceHistoryPage from './pages/PurchaseServiceHistoryPage';
import RegisterCustomerVehiclePage from './pages/RegisterCustomerVehiclePage';
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import AppointmentsRequestsReviewsPage from './pages/AppointmentsRequestsReviewsPage';
import LoyaltyOffersPage from './pages/LoyaltyOffersPage';
import PartFormPage from './pages/admin/PartFormPage';
import StockHistoryPage from './pages/admin/StockHistoryPage';
import InventoryReportPage from './pages/admin/InventoryReportPage';
import StaffFormPage from './pages/admin/StaffFormPage';
import VendorFormPage from './pages/admin/VendorFormPage';
import VendorHistoryPage from './pages/admin/VendorHistoryPage';
import PurchaseCreatePage from './pages/admin/PurchaseCreatePage';
import PurchaseDetailPage from './pages/admin/PurchaseDetailPage';
import SalesHistoryPage from './pages/staff/SalesHistoryPage';
import SalesCreatePage from './pages/staff/SalesCreatePage';
import InvoiceDetailPage from './pages/staff/InvoiceDetailPage';
import CustomerVehiclesPage from './pages/customer/CustomerVehiclesPage';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<ProtectedRoute roles={['Admin']} />}>
            <Route path="/admin" element={<Layout role="Admin" />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage role="Admin" />} />
              <Route path="staff" element={<StaffManagementPage />} />
              <Route path="staff/add" element={<StaffFormPage />} />
              <Route path="staff/:id/edit" element={<StaffFormPage />} />
              <Route path="vendors" element={<VendorManagementPage />} />
              <Route path="vendors/add" element={<VendorFormPage />} />
              <Route path="vendors/:id/edit" element={<VendorFormPage />} />
              <Route path="vendors/:id/history" element={<VendorHistoryPage />} />
              <Route path="parts" element={<PartsManagementPage />} />
              <Route path="parts/add" element={<PartFormPage />} />
              <Route path="parts/:id/edit" element={<PartFormPage />} />
              <Route path="parts/:id/stock-history" element={<StockHistoryPage />} />
              <Route path="purchases" element={<PurchaseStockPage />} />
              <Route path="purchases/create" element={<PurchaseCreatePage />} />
              <Route path="purchases/:id" element={<PurchaseDetailPage />} />
              <Route path="reports/daily" element={<FinancialReportsPage />} />
              <Route path="reports/monthly" element={<FinancialReportsPage />} />
              <Route path="reports/yearly" element={<FinancialReportsPage />} />
              <Route path="reports/sales" element={<FinancialReportsPage />} />
              <Route path="reports/inventory" element={<InventoryReportPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="customer-analytics" element={<CustomerReportsPage />} />
              <Route path="settings" element={<SettingsPage role="Admin" />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['Staff']} />}>
            <Route path="/staff" element={<Layout role="Staff" />}>
              <Route index element={<Navigate to="/staff/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage role="Staff" />} />
              <Route path="customers" element={<CustomerSearchPage />} />
              <Route path="customers/register" element={<RegisterCustomerVehiclePage />} />
              <Route path="customers/details" element={<CustomerDetailsPage />} />
              <Route path="customers/:id/vehicles" element={<CustomerDetailsPage />} />
              <Route path="sales/create" element={<SalesCreatePage />} />
              <Route path="sales/history" element={<SalesHistoryPage />} />
              <Route path="invoices/:id" element={<InvoiceDetailPage />} />
              <Route path="customers/search" element={<CustomerSearchPage />} />
              <Route path="reports/high-spenders" element={<CustomerReportsPage />} />
              <Route path="reports/regular-customers" element={<CustomerReportsPage />} />
              <Route path="reports/pending-credits" element={<CustomerReportsPage />} />
              <Route path="appointments" element={<AppointmentsRequestsReviewsPage />} />
              <Route path="profile" element={<SettingsPage role="Staff" />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['Customer']} />}>
            <Route path="/customer" element={<Layout role="Customer" />}>
              <Route index element={<Navigate to="/customer/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage role="Customer" />} />
              <Route path="profile" element={<CustomerRegistrationPage />} />
              <Route path="vehicles" element={<CustomerVehiclesPage />} />
              <Route path="appointments" element={<AppointmentsRequestsReviewsPage />} />
              <Route path="appointments/book" element={<AppointmentsRequestsReviewsPage />} />
              <Route path="appointments/history" element={<AppointmentsRequestsReviewsPage />} />
              <Route path="purchase-history" element={<PurchaseServiceHistoryPage />} />
              <Route path="service-history" element={<PurchaseServiceHistoryPage />} />
              <Route path="request-part" element={<AppointmentsRequestsReviewsPage />} />
              <Route path="reviews" element={<AppointmentsRequestsReviewsPage />} />
              <Route path="loyalty-offers" element={<LoyaltyOffersPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage role="Customer" />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
