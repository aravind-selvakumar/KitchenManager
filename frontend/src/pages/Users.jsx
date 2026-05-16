import { useState, useEffect } from 'react'
import { usersApi } from '../services/api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const res = await usersApi.getAll()
      setUsers(res.data)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleRoleChange = async (id, role) => {
    try {
      await usersApi.updateRole(id, role)
      fetchUsers()
    } catch {}
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await usersApi.toggleStatus(id, !currentStatus)
      fetchUsers()
    } catch {}
  }

  if (loading) return <div className="loading-screen">Loading users...</div>

  return (
    <div>
      <div className="toolbar">
        <h3 style={{ marginRight: 'auto' }}>User Management ({users.length})</h3>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.username}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      style={{ padding: '0.3rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span style={{
                      color: u.isActive ? 'var(--success)' : 'var(--danger)',
                      fontWeight: 600
                    }}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${u.isActive ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => handleToggleStatus(u.id, u.isActive)}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
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
