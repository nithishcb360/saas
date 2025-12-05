import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If token expired, try to refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })

        const { access_token, refresh_token } = response.data
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)

        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; full_name: string; company_name?: string }) =>
    api.post('/auth/register', data),
  login: (email: string, password: string) =>
    api.post('/auth/login', new URLSearchParams({ username: email, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, new_password: string) =>
    api.post('/auth/reset-password', { token, new_password }),
  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
  resendVerification: (email: string) =>
    api.post('/auth/resend-verification', { email }),
}

// Users API
export const usersAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateCurrentUser: (data: any) => api.put('/users/me', data),
  deleteCurrentUser: () => api.delete('/users/me'),
}

// Organizations API
export const organizationsAPI = {
  create: (data: { name: string; description?: string }) =>
    api.post('/organizations', data),
  list: (skip = 0, limit = 100) =>
    api.get('/organizations', { params: { skip, limit } }),
  get: (orgId: string) => api.get(`/organizations/${orgId}`),
  update: (orgId: string, data: any) => api.put(`/organizations/${orgId}`, data),
  delete: (orgId: string) => api.delete(`/organizations/${orgId}`),
  inviteMember: (orgId: string, email: string) =>
    api.post(`/organizations/${orgId}/members`, { email }),
  removeMember: (orgId: string, userId: string) =>
    api.delete(`/organizations/${orgId}/members/${userId}`),
}

// Billing API
export const billingAPI = {
  getSubscription: () => api.get('/billing/subscription'),
  createSubscription: (planId: string) =>
    api.post('/billing/subscription', { plan_id: planId }),
  cancelSubscription: () => api.delete('/billing/subscription'),
  listInvoices: (skip = 0, limit = 100) =>
    api.get('/billing/invoices', { params: { skip, limit } }),
  getInvoice: (invoiceId: string) => api.get(`/billing/invoices/${invoiceId}`),
  listPaymentMethods: () => api.get('/billing/payment-methods'),
  addPaymentMethod: (paymentMethodId: string) =>
    api.post('/billing/payment-methods', { payment_method_id: paymentMethodId }),
  removePaymentMethod: (paymentMethodId: string) =>
    api.delete(`/billing/payment-methods/${paymentMethodId}`),
}

// Analytics API
export const analyticsAPI = {
  getDashboard: (startDate?: string, endDate?: string) =>
    api.get('/analytics/dashboard', { params: { start_date: startDate, end_date: endDate } }),
  getUserAnalytics: (startDate?: string, endDate?: string) =>
    api.get('/analytics/users', { params: { start_date: startDate, end_date: endDate } }),
  getRevenueAnalytics: (startDate?: string, endDate?: string) =>
    api.get('/analytics/revenue', { params: { start_date: startDate, end_date: endDate } }),
  getSubscriptionAnalytics: () => api.get('/analytics/subscriptions'),
}

export default api
