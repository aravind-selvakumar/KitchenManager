import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data)
}

export const productsApi = {
  getAll: () => api.get('/products'),
  getLowStock: () => api.get('/products/low-stock'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
}

export const rationsApi = {
  getAll: (from, to) => api.get('/rations', { params: { from, to } }),
  getById: (id) => api.get(`/rations/${id}`),
  create: (data) => api.post('/rations', data),
  delete: (id) => api.delete(`/rations/${id}`)
}

export const reportsApi = {
  daily: (date) => api.get('/reports/daily', { params: { date } }),
  monthly: (year, month) => api.get('/reports/monthly', { params: { year, month } }),
  custom: (from, to) => api.get('/reports/custom', { params: { from, to } })
}

export const usersApi = {
  getAll: () => api.get('/users'),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  toggleStatus: (id, isActive) => api.put(`/users/${id}/status`, { isActive })
}

export default api
