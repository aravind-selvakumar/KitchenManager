import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { rationsApi, productsApi } from '../services/api'

export default function Rationing() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'
  const [rations, setRations] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], notes: '' })
  const [items, setItems] = useState([{ productId: '', quantityUsed: '' }])

  const fetchData = async () => {
    try {
      const [ratRes, prodRes] = await Promise.all([
        rationsApi.getAll(),
        productsApi.getAll()
      ])
      setRations(ratRes.data)
      setProducts(prodRes.data)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const addItem = () => setItems([...items, { productId: '', quantityUsed: '' }])

  const removeItem = (idx) => {
    if (items.length === 1) return
    setItems(items.filter((_, i) => i !== idx))
  }

  const updateItem = (idx, field, value) => {
    const newItems = [...items]
    newItems[idx][field] = value
    setItems(newItems)
  }

  const getProductCost = (productId) => {
    const p = products.find(p => p.id === parseInt(productId))
    return p ? p.unitCost : 0
  }

  const getTotalCost = () => {
    return items.reduce((sum, item) => {
      if (!item.productId || !item.quantityUsed) return sum
      return sum + (parseFloat(item.quantityUsed) || 0) * getProductCost(item.productId)
    }, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      date: form.date,
      notes: form.notes,
      items: items
        .filter(i => i.productId && i.quantityUsed)
        .map(i => ({
          productId: parseInt(i.productId),
          quantityUsed: parseFloat(i.quantityUsed)
        }))
    }
    if (payload.items.length === 0) return alert('Add at least one item')
    try {
      await rationsApi.create(payload)
      setShowModal(false)
      setItems([{ productId: '', quantityUsed: '' }])
      setForm({ date: new Date().toISOString().split('T')[0], notes: '' })
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create ration entry')
    }
  }

  if (loading) return <div className="loading-screen">Loading rations...</div>

  return (
    <div>
      <div className="toolbar">
        <h3 style={{ marginRight: 'auto' }}>Ration Usage History</h3>
        {isAdmin && <button className="btn btn-success" onClick={() => setShowModal(true)}>+ New Ration Entry</button>}
      </div>

      <div className="card">
        {rations.length === 0 ? (
          <div className="empty-state"><p>No ration entries yet</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Notes</th>
                  <th>Items</th>
                  <th>Total Cost</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody>
                {rations.map(r => (
                  <tr key={r.id}>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>{r.notes || '-'}</td>
                    <td>
                      {r.items.map(i => (
                        <div key={i.id} style={{ fontSize: '0.85rem' }}>
                          {i.productName}: {i.quantityUsed} {i.productUnit} (₹{i.totalCost.toFixed(2)})
                        </div>
                      ))}
                    </td>
                    <td><strong>₹{r.totalCost.toFixed(2)}</strong></td>
                    <td>{r.createdByUsername}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h2>Record Ration Usage</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea rows="2" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Items Used</label>
              {items.map((item, idx) => {
                const cost = item.productId ? getProductCost(item.productId) : 0
                const total = (item.productId && item.quantityUsed) ? (parseFloat(item.quantityUsed) || 0) * cost : 0
                return (
                  <div key={idx} className="ration-item-row">
                    <select value={item.productId} onChange={e => updateItem(idx, 'productId', e.target.value)} required>
                      <option value="">Select product</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (₹{p.unitCost}/{p.unit}) — Stock: {p.currentStock} {p.unit}
                        </option>
                      ))}
                    </select>
                    <input type="number" step="0.01" min="0.01" placeholder="Quantity" value={item.quantityUsed}
                      onChange={e => updateItem(idx, 'quantityUsed', e.target.value)} required />
                    <span style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', minWidth: '80px' }}>
                      {total > 0 ? `₹${total.toFixed(2)}` : ''}
                    </span>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeItem(idx)}>✕</button>
                  </div>
                )
              })}
              <button type="button" className="btn btn-sm btn-secondary" onClick={addItem} style={{ marginTop: '0.3rem' }}>+ Add Item</button>

              <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'right', fontWeight: 700 }}>
                Estimated Total: ₹{getTotalCost().toFixed(2)}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success">Save Ration</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
