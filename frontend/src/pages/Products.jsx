import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { productsApi } from '../services/api'

const UNITS = ['kg', 'g', 'L', 'ml']

export default function Products() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', category: '', unit: 'kg', currentStock: '', unitCost: '', minStockLevel: '' })

  const fetchProducts = async () => {
    try {
      const res = await productsApi.getAll()
      setProducts(res.data)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', category: '', unit: 'kg', currentStock: '', unitCost: '', minStockLevel: '' })
    setShowModal(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      name: p.name, category: p.category, unit: p.unit,
      currentStock: p.currentStock.toString(),
      unitCost: p.unitCost.toString(),
      minStockLevel: p.minStockLevel.toString()
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      name: form.name, category: form.category, unit: form.unit,
      currentStock: parseFloat(form.currentStock) || 0,
      unitCost: parseFloat(form.unitCost) || 0,
      minStockLevel: parseFloat(form.minStockLevel) || 0
    }
    try {
      if (editing) {
        await productsApi.update(editing.id, data)
      } else {
        await productsApi.create(data)
      }
      setShowModal(false)
      fetchProducts()
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await productsApi.delete(id)
      fetchProducts()
    } catch {}
  }

  if (loading) return <div className="loading-screen">Loading products...</div>

  return (
    <div>
      <div className="toolbar">
        <h3 style={{ marginRight: 'auto' }}>Products ({products.length})</h3>
        {isAdmin && <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>}
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Stock</th>
                <th>Unit Cost</th>
                <th>Stock Value</th>
                <th>Min Stock</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr><td colSpan={isAdmin ? 9 : 8}><div className="empty-state"><p>No products yet</p></div></td></tr>
              )}
              {products.map(p => (
                <tr key={p.id} className={p.isLowStock ? 'low-stock' : ''}>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.category}</td>
                  <td><span className="unit-badge">{p.unit}</span></td>
                  <td>{p.currentStock}</td>
                  <td>₹{p.unitCost.toFixed(2)}/{p.unit}</td>
                  <td>₹{(p.currentStock * p.unitCost).toFixed(2)}</td>
                  <td>{p.minStockLevel}</td>
                  <td>
                    {p.isLowStock
                      ? <span style={{ color: 'var(--danger)', fontWeight: 600 }}>⚠ Low</span>
                      : <span style={{ color: 'var(--success)' }}>OK</span>
                    }
                  </td>
                  {isAdmin && (
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button className="btn btn-sm btn-primary" onClick={() => openEdit(p)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Del</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Unit *</label>
                  <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Current Stock *</label>
                  <input type="number" step="0.01" min="0" value={form.currentStock} onChange={e => setForm({...form, currentStock: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Unit Cost (₹) *</label>
                  <input type="number" step="0.01" min="0" value={form.unitCost} onChange={e => setForm({...form, unitCost: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Min Stock Level (Low Quantity Threshold) *</label>
                <input type="number" step="0.01" min="0" value={form.minStockLevel} onChange={e => setForm({...form, minStockLevel: e.target.value})} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
