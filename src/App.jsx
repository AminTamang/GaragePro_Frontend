import { useState } from 'react';
import Layout from './components/Layout';
import FinancialReportsPage from './pages/FinancialReportsPage';
import VendorManagementPage from './pages/VendorManagementPage';
import CustomerSearchPage from './pages/CustomerSearchPage';
import InvoiceEmailPage from './pages/InvoiceEmailPage';
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

const pages = {
  financials: <FinancialReportsPage />,
  vendors: <VendorManagementPage />,
  customers: <CustomerSearchPage />,
  invoiceEmail: <InvoiceEmailPage />,
  staffManagement: <StaffManagementPage />,
  purchaseStock: <PurchaseStockPage />,
  customerRegistration: <CustomerRegistrationPage />,
  notifications: <NotificationsPage />,
  partsManagement: <PartsManagementPage />,
  salesInvoice: <SalesInvoicePage />,
  customerReports: <CustomerReportsPage />,
  purchaseHistory: <PurchaseServiceHistoryPage />,
  registerVehicle: <RegisterCustomerVehiclePage />,
  customerDetails: <CustomerDetailsPage />,
  appointmentsRequestsReviews: <AppointmentsRequestsReviewsPage />,
  loyaltyOffers: <LoyaltyOffersPage />,
};

export default function App() {
  const [activePage, setActivePage] = useState('financials');

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {pages[activePage]}
    </Layout>
  );
}
