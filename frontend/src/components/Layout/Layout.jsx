import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect } from 'react'
import { productsApi } from '../../services/api'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [lowStockCount, setLowStockCount] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await productsApi.getLowStock()
        setLowStockCount(res.data.length)
      } catch { setLowStockCount(0) }
    }
    fetch()
    const interval = setInterval(fetch, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span>🍳 Kitchen Manager</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard">
            <span>Dashboard</span>
            {lowStockCount > 0 && <span className="badge">{lowStockCount}</span>}
          </NavLink>
          <NavLink to="/products"><span>Products</span></NavLink>
          <NavLink to="/rationing"><span>Rationing</span></NavLink>
          <NavLink to="/reports"><span>Reports</span></NavLink>
          {user?.role === 'Admin' && <NavLink to="/users"><span>Users</span></NavLink>}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <strong>{user?.username}</strong>
            <span>{user?.role}</span>
          </div>
          <button className="btn btn-secondary btn-sm btn-block" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        <div className="topbar">
          <h2>Kitchen Stock Manager</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {user?.username} ({user?.role})
          </span>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
