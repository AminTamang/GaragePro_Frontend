import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Bell, Menu, Search, X } from 'lucide-react'
import { pageLinks, sidebarLinks } from '../data/navigation'

const pageTitles = {
  '/admin/staff-management': 'Admin Staff Management Page',
  '/admin/purchase-invoice': 'Admin Purchase Invoice / Stock Update Page',
  '/customer/profile': 'Customer Registration and Profile Page',
  '/notifications': 'Notification and Reminder Dashboard Page',
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = pageTitles[location.pathname] ?? 'GaragePro'

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <NavLink className="brand" to="/admin/staff-management" onClick={closeSidebar}>
          <div className="brand-mark">G</div>
          <span>GaragePro</span>
        </NavLink>

        <nav className="side-nav" aria-label="GaragePro navigation">
          <p>Main</p>
          {sidebarLinks.map(([label, path, Icon]) => (
            <NavLink
              className={({ isActive }) => (isActive ? 'active' : '')}
              end={path === '/'}
              key={label}
              to={path}
              onClick={closeSidebar}
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            type="button"
            aria-label="Toggle menu"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <h1>{title}</h1>

          <label className="search-box">
            <Search size={17} />
            <input type="search" placeholder="Search customers, parts..." />
          </label>

          <NavLink
            className={({ isActive }) =>
              `notification-link icon-button ${isActive ? 'active' : ''}`
            }
            to="/notifications"
            aria-label="Open notifications"
          >
            <Bell size={19} />
            <span>14</span>
          </NavLink>

          <div className="avatar">R</div>
        </header>

        <nav className="feature-tabs" aria-label="Main pages">
          {pageLinks.map((page) => {
            const Icon = page.icon

            return (
              <NavLink
                className={({ isActive }) => (isActive ? 'selected' : '')}
                key={page.path}
                to={page.path}
              >
                <Icon size={18} />
                <span>{page.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <Outlet />
      </main>
    </div>
  )
}

export default Layout
