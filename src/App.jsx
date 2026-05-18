import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import CustomerProfilePage from './pages/CustomerProfilePage'
import NotificationDashboardPage from './pages/NotificationDashboardPage'
import PurchaseInvoicePage from './pages/PurchaseInvoicePage'
import StaffManagementPage from './pages/StaffManagementPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/admin/staff-management" replace />} />
        <Route path="/admin/staff-management" element={<StaffManagementPage />} />
        <Route path="/admin/purchase-invoice" element={<PurchaseInvoicePage />} />
        <Route path="/customer/profile" element={<CustomerProfilePage />} />
        <Route path="/notifications" element={<NotificationDashboardPage />} />
        <Route path="*" element={<Navigate to="/admin/staff-management" replace />} />
      </Route>
    </Routes>
  )
}

export default App
