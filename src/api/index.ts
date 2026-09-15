import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 응답 인터셉터 — 에러 공통 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default api

// ── API 모듈 ──

// User API
export const userApi = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
}

// Sermon API
export const sermonApi = {
  getAll: () => api.get('/sermons'),
  getById: (id: number) => api.get(`/sermons/${id}`),
  create: (data: any) => api.post('/sermons', data),
  update: (id: number, data: any) => api.put(`/sermons/${id}`, data),
  delete: (id: number) => api.delete(`/sermons/${id}`),
}

// QT API
export const qtApi = {
  getAll: () => api.get('/qts'),
  getById: (id: number) => api.get(`/qts/${id}`),
  create: (data: any) => api.post('/qts', data),
  update: (id: number, data: any) => api.put(`/qts/${id}`, data),
  delete: (id: number) => api.delete(`/qts/${id}`),
}

// PBS API
export const pbsApi = {
  getAll: () => api.get('/pbs'),
  getById: (id: number) => api.get(`/pbs/${id}`),
  create: (data: any) => api.post('/pbs', data),
  update: (id: number, data: any) => api.put(`/pbs/${id}`, data),
  delete: (id: number) => api.delete(`/pbs/${id}`),
}

// Reading Note API
export const readingApi = {
  getAll: () => api.get('/readings'),
  getById: (id: number) => api.get(`/readings/${id}`),
  create: (data: any) => api.post('/readings', data),
  update: (id: number, data: any) => api.put(`/readings/${id}`, data),
  delete: (id: number) => api.delete(`/readings/${id}`),
}