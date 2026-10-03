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
  changePassword: (id: number, data: { currentPassword: string; newPassword: string }) =>
    api.put(`/users/${id}/password`, data),
  getSettings: (id: number) => api.get(`/users/${id}/settings`),
  updateSettings: (id: number, data: { bibleVersion: string; qtSource: string }) =>
    api.put(`/users/${id}/settings`, data),
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

// QT Daily (크롤링된 오늘 QT) API
export const qtDailyApi = {
  getToday: (source?: string) => api.get('/qt-daily/today', { params: source ? { source } : {} }),
  getAllToday: () => api.get('/qt-daily'),
  getByDate: (date: string, source?: string) => api.get('/qt-daily/by-date', { params: { date, ...(source ? { source } : {}) } }),
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

// Group Code API
export const groupCodeApi = {
  getAll: (keyword?: string) => api.get('/group-codes', { params: keyword ? { keyword } : {} }),
  getById: (groupCode: string) => api.get(`/group-codes/${groupCode}`),
  create: (data: any) => api.post('/group-codes', data),
  update: (groupCode: string, data: any) => api.put(`/group-codes/${groupCode}`, data),
  delete: (groupCode: string) => api.delete(`/group-codes/${groupCode}`),
}

// Common Code API
export const commonCodeApi = {
  getAll: (groupCode?: string) => api.get('/common-codes', { params: groupCode ? { groupCode } : {} }),
  getById: (id: number) => api.get(`/common-codes/${id}`),
  create: (data: any) => api.post('/common-codes', data),
  update: (id: number, data: any) => api.put(`/common-codes/${id}`, data),
  delete: (id: number) => api.delete(`/common-codes/${id}`),
}

// Menu API
export const menuApi = {
  getAll: () => api.get('/menus'),
  getTree: () => api.get('/menus/tree'),
  getById: (id: number) => api.get(`/menus/${id}`),
  getChildMenus: (parentId: number) => api.get(`/menus/${parentId}/children`),
  create: (data: any) => api.post('/menus', data),
  update: (id: number, data: any) => api.put(`/menus/${id}`, data),
  delete: (id: number) => api.delete(`/menus/${id}`),
  updateOrder: (orders: { menuId: number; sortOrder: number }[]) =>
    api.put('/menus/order', { orders }),
  moveMenu: (menuId: number, parentId: number) => api.put(`/menus/${menuId}/move`, { parentId }),
}

// File Upload API
export const fileApi = {
  upload: (file: File, category: string = 'general') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', category)
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    })
  },
  uploadMultiple: (files: File[], category: string = 'general') => {
    const formData = new FormData()
    files.forEach(f => formData.append('files', f))
    formData.append('category', category)
    return api.post('/files/uploadMultiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    })
  },
  delete: (filePath: string) => api.delete('/files/delete', { params: { filePath } }),
}

// Bible API
export const bibleApi = {
  getVerses: (bookCode: string, chapter: number, verseFrom?: number, verseTo?: number, versionId?: number) =>
    api.get('/bible/verses', { params: { bookCode, chapter, verseFrom, verseTo, versionId } }),
  getBooks: (versionId?: number) => api.get('/bible/books', { params: { versionId } }),
}

// Role API
export const roleApi = {
  getAll: () => api.get('/roles'),
  getById: (id: number) => api.get(`/roles/${id}`),
  create: (data: any) => api.post('/roles', data),
  update: (id: number, data: any) => api.put(`/roles/${id}`, data),
  delete: (id: number) => api.delete(`/roles/${id}`),
}

// Permission API
export const permissionApi = {
  getAll: () => api.get('/permissions'),
  getByRole: (roleId: number) => api.get(`/permissions/role/${roleId}/menus`),
  updateByRole: (roleId: number, data: any) => api.put(`/permissions/role/${roleId}`, data),
}