import {
  Bell,
  CalendarClock,
  ClipboardList,
  FileText,
  History,
  LayoutDashboard,
  PackageCheck,
  PackagePlus,
  Star,
  UserCog,
  UserPlus,
  Users,
  Wrench,
} from 'lucide-react'

export const pageLinks = [
  {
    path: '/admin/staff-management',
    label: 'Staff Management',
    icon: UserCog,
  },
  {
    path: '/admin/purchase-invoice',
    label: 'Purchase Invoice',
    icon: PackagePlus,
  },
  {
    path: '/customer/profile',
    label: 'Customer Profile',
    icon: UserPlus,
  },
  {
    path: '/notifications',
    label: 'Notifications',
    icon: Bell,
  },
]

export const sidebarLinks = [
  ['Dashboard', '/', LayoutDashboard],
  ['Parts Management', '/admin/purchase-invoice', PackageCheck],
  ['Register Customer', '/customer/profile', UserPlus],
  ['Customer Details', '/customer/profile', Users],
  ['Sales Invoices', '/admin/purchase-invoice', FileText],
  ['Staff Reports', '/admin/staff-management', ClipboardList],
  ['Customer History', '/customer/profile', History],
  ['Appointments', '/notifications', CalendarClock],
  ['Part Requests', '/admin/purchase-invoice', Wrench],
  ['Reviews', '/notifications', Star],
]
