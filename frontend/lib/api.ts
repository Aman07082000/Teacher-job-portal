import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle timeout errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please check your connection and try again.'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data: { name: string; email: string; password: string; role: string }) =>
    apiClient.post('/auth/register', data, { timeout: 45000 }),
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),
}

export const teacherAPI = {
  createProfile: (data: any) => apiClient.post('/teachers/profile', data),
  searchJobs: (filters?: any) => apiClient.get('/teachers/jobs', { params: filters }),
  applyJob: (jobId: number, data: any) => {
    // If FormData, do not set Content-Type (let browser set it for multipart)
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      return apiClient.post(`/teachers/jobs/${jobId}/apply`, data, {
        headers: { 'Content-Type': undefined },
      })
    }
    return apiClient.post(`/teachers/jobs/${jobId}/apply`, data)
  },
  trackApplications: () => apiClient.get('/teachers/applications'),
}

export const schoolAPI = {
  createProfile: (data: any) => apiClient.post('/schools/profile', data),
  postJob: (data: any) => apiClient.post('/schools/jobs', data),
  getApplicants: () => apiClient.get('/schools/applicants'),
  shortlistCandidate: (applicationId: number) =>
    apiClient.post(`/schools/applicants/${applicationId}/shortlist`),
}

export const adminAPI = {
  getUsers: () => apiClient.get('/admin/users'),
  monitorJobs: () => apiClient.get('/admin/jobs'),
  getAnalytics: () => apiClient.get('/admin/analytics'),
}

export const jobAPI = {
  getAllJobs: () => apiClient.get('/jobs'),
}

export default apiClient
