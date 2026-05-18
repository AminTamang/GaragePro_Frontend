export const navItems = [
  { id: 'financials', label: 'Financial Reports', role: 'Admin', feature: 'Feature 1' },
  { id: 'staffManagement', label: 'Staff Management', role: 'Admin', feature: 'Feature 2' },
  { id: 'partsManagement', label: 'Parts Management', role: 'Admin', feature: 'Feature 3' },
  { id: 'purchaseStock', label: 'Purchase Invoice / Stock', role: 'Admin', feature: 'Feature 4' },
  { id: 'vendors', label: 'Vendor Management', role: 'Admin', feature: 'Feature 5' },
  { id: 'registerVehicle', label: 'Register Customer + Vehicle', role: 'Staff', feature: 'Feature 6' },
  { id: 'salesInvoice', label: 'Sales & Invoice Creation', role: 'Staff', feature: 'Feature 7' },
  { id: 'customerDetails', label: 'Customer Details', role: 'Staff', feature: 'Feature 8' },
  { id: 'customerReports', label: 'Customer Reports', role: 'Staff', feature: 'Feature 9' },
  { id: 'customers', label: 'Customer Search', role: 'Staff', feature: 'Feature 10' },
  { id: 'invoiceEmail', label: 'Invoice Email', role: 'Staff', feature: 'Feature 11' },
  { id: 'customerRegistration', label: 'Customer Registration', role: 'Customer', feature: 'Feature 12' },
  { id: 'appointmentsRequestsReviews', label: 'Appointments / Requests / Reviews', role: 'Customer', feature: 'Feature 13' },
  { id: 'purchaseHistory', label: 'Purchase & Service History', role: 'Customer', feature: 'Feature 14' },
  { id: 'notifications', label: 'Notifications & Reminders', role: 'Admin', feature: 'Feature 15' },
  { id: 'loyaltyOffers', label: 'Loyalty Offers', role: 'Customer', feature: 'Feature 16' },
];

export const financialCards = [
  { label: 'Total Revenue', value: 'Rs. 4.82L', change: '+12.4%', trend: 'up', sub: 'vs Rs. 4.29L last month' },
  { label: 'Invoices Issued', value: '138', change: '+8.1%', trend: 'up', sub: '127 last month' },
  { label: 'Outstanding Amount', value: 'Rs. 38,400', change: '+3 overdue', trend: 'down', sub: '14 invoices pending' },
  { label: 'Avg Invoice Value', value: 'Rs. 3,492', change: '+5.2%', trend: 'up', sub: 'Median Rs. 2,800' },
];

export const revenueBreakdown = [
  { month: 'Jan', parts: 42, service: 30, labour: 20 },
  { month: 'Feb', parts: 38, service: 35, labour: 22 },
  { month: 'Mar', parts: 55, service: 28, labour: 18 },
  { month: 'Apr', parts: 61, service: 40, labour: 25 },
  { month: 'May', parts: 48, service: 45, labour: 30 },
  { month: 'Jun', parts: 70, service: 38, labour: 24 },
  { month: 'Jul', parts: 65, service: 50, labour: 35 },
  { month: 'Aug', parts: 58, service: 44, labour: 28 },
  { month: 'Sep', parts: 72, service: 55, labour: 32 },
  { month: 'Oct', parts: 80, service: 48, labour: 38 },
  { month: 'Nov', parts: 68, service: 60, labour: 28 },
  { month: 'Dec', parts: 90, service: 72, labour: 42 },
];

export const transactionRows = [
  { invoice: 'INV-2041', customer: 'Anil Sharma', category: 'Parts', amount: 'Rs. 4,800', status: 'Paid', date: '12 May' },
  { invoice: 'INV-2040', customer: 'Priya Paudel', category: 'Service', amount: 'Rs. 5,500', status: 'Overdue', date: '11 May' },
  { invoice: 'INV-2039', customer: 'Ramesh Thapa', category: 'Labour', amount: 'Rs. 24,000', status: 'Paid', date: '10 May' },
  { invoice: 'INV-2038', customer: 'Sita Karki', category: 'Parts', amount: 'Rs. 1,200', status: 'Pending', date: '09 May' },
  { invoice: 'INV-2037', customer: 'Bikash Rai', category: 'Other', amount: 'Rs. 850', status: 'Paid', date: '08 May' },
];

export const categoryStats = [
  { label: 'Parts Sales', value: 'Rs. 2,12,000', percent: 44, color: 'var(--electric-blue)' },
  { label: 'Service Charges', value: 'Rs. 1,54,000', percent: 32, color: 'var(--clean-green)' },
  { label: 'Labour', value: 'Rs. 82,000', percent: 17, color: 'var(--burnt-orange)' },
  { label: 'Other', value: 'Rs. 34,000', percent: 7, color: 'var(--steel-navy)' },
];

export const monthlySummary = [
  { label: 'Gross Revenue', value: 'Rs. 4,82,000', tone: '' },
  { label: 'Expenses', value: '– Rs. 1,24,000', tone: 'red' },
  { label: 'Net Profit', value: 'Rs. 3,58,000', tone: 'green' },
  { label: 'Tax (13% VAT)', value: 'Rs. 46,540', tone: '' },
  { label: 'Profit Margin', value: '74.3%', tone: 'green' },
  { label: 'Collection Rate', value: '92.1%', tone: 'green' },
];

export const vendorRows = [
  { name: 'Apex Auto Parts', category: 'Parts', contact: 'Maya Chen', phone: '(555) 018-2211', status: 'Preferred', rating: 4.8, balance: 'Rs. 3,420' },
  { name: 'RoadKing Tires', category: 'Tires', contact: 'Nolan Reed', phone: '(555) 011-9034', status: 'Active', rating: 4.4, balance: 'Rs. 1,180' },
  { name: 'Prime Fluids Co.', category: 'Fluids', contact: 'Iris Patel', phone: '(555) 019-7720', status: 'Review', rating: 3.9, balance: 'Rs. 740' },
  { name: 'Metro Paint Supply', category: 'Body Shop', contact: 'Owen Brooks', phone: '(555) 012-4508', status: 'Active', rating: 4.2, balance: 'Rs. 2,050' },
];

export const customerRows = [
  { name: 'Ariana Miller', phone: '(555) 017-4402', email: 'ariana.miller@example.com', vehicle: '2021 Toyota Camry', vin: '4T1G11AK7MU450239', lastVisit: 'May 14, 2026', balance: 'Rs. 0', tag: 'Regular' },
  { name: 'Dev Sharma', phone: '(555) 016-9127', email: 'dev.sharma@example.com', vehicle: '2018 Honda Civic', vin: '2HGFC2F59JH548219', lastVisit: 'May 11, 2026', balance: 'Rs. 284', tag: 'Pickup Due' },
  { name: 'Lena Ortiz', phone: '(555) 013-6550', email: 'lena.ortiz@example.com', vehicle: '2022 Ford F-150', vin: '1FTEW1EP4NFA11209', lastVisit: 'Apr 29, 2026', balance: 'Rs. 0', tag: 'Fleet' },
  { name: 'Marcus Green', phone: '(555) 014-8876', email: 'marcus.green@example.com', vehicle: '2017 BMW 330i', vin: 'WBA8B9G52HNU51422', lastVisit: 'Apr 18, 2026', balance: 'Rs. 612', tag: 'Follow Up' },
];

export const invoiceRows = [
  { id: 'INV-2048', customer: 'Dev Sharma', email: 'dev.sharma@example.com', total: 'Rs. 4,800', status: 'Ready', service: 'Brake pad replacement' },
  { id: 'INV-2047', customer: 'Marcus Green', email: 'marcus.green@example.com', total: 'Rs. 5,500', status: 'Draft', service: 'Cooling system repair' },
  { id: 'INV-2046', customer: 'Ariana Miller', email: 'ariana.miller@example.com', total: 'Rs. 1,200', status: 'Sent', service: 'Oil service and inspection' },
];
