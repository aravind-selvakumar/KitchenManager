import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productsApi } from '../services/api'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      try {
        const [prodRes, lowRes] = await Promise.all([
          productsApi.getAll(),
          productsApi.getLowStock()
        ])
        setProducts(prodRes.data)
        setLowStock(lowRes.data)
      } catch {} finally { setLoading(false) }
    }
    fetch()
  }, [])

  const totalProducts = products.length
  const totalValue = products.reduce((s, p) => s + (p.currentStock * p.unitCost), 0)
  const lowStockCount = lowStock.length

  if (loading) return <div className="loading-screen">Loading dashboard...</div>

  return (
    <div>
      {lowStockCount > 0 && (
        <div className="alert-banner">
          <h3>Low Stock Alert — {lowStockCount} product(s) below threshold</h3>
          <ul>
            {lowStock.map(p => (
              <li key={p.id}>
                {p.name} — {p.currentStock} {p.unit} left (threshold: {p.minStockLevel} {p.unit})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-value">{totalProducts}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="card stat-card success">
          <div className="stat-value">₹{totalValue.toFixed(2)}</div>
          <div className="stat-label">Total Inventory Value</div>
        </div>
        <div className="card stat-card danger">
          <div className="stat-value">{lowStockCount}</div>
          <div className="stat-label">Low Stock Items</div>
        </div>
        <div className="card stat-card warning">
          <div className="stat-value">{products.filter(p => p.currentStock > 0).length}</div>
          <div className="stat-label">In-Stock Products</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '0.8rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>Manage Products</button>
          <button className="btn btn-success" onClick={() => navigate('/rationing')}>Record Ration Usage</button>
          <button className="btn btn-warning" onClick={() => navigate('/reports')}>View Reports</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h3 style={{ marginBottom: '0.8rem' }}>All Products Stock Status</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Threshold</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className={p.isLowStock ? 'low-stock' : ''}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.currentStock} <span className="unit-badge">{p.unit}</span></td>
                  <td>{p.minStockLevel} <span className="unit-badge">{p.unit}</span></td>
                  <td>
                    {p.isLowStock
                      ? <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Low Stock</span>
                      : <span style={{ color: 'var(--success)' }}>OK</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
