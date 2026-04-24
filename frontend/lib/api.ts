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
  getApplicationDetail: (applicationId: number) => apiClient.get(`/teachers/applications/${applicationId}`),
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
  getJobById: (jobId: number) => apiClient.get(`/jobs/${jobId}`),
}

// ============ NEW FEATURES API ============

export const featuresAPI = {
  // Saved Jobs
  saveJob: (jobId: number) => apiClient.post(`/features/saved-jobs/${jobId}`),
  removeSavedJob: (jobId: number) => apiClient.delete(`/features/saved-jobs/${jobId}`),
  getSavedJobs: () => apiClient.get('/features/saved-jobs'),
  checkSavedJob: (jobId: number) => apiClient.get(`/features/saved-jobs/${jobId}/check`),
  getSavedJobsCount: () => apiClient.get('/features/saved-jobs/count'),

  // Job Alerts
  createJobAlert: (data: any) => apiClient.post('/features/job-alerts', data),
  getJobAlerts: () => apiClient.get('/features/job-alerts'),
  updateJobAlert: (alertId: number, data: any) => apiClient.put(`/features/job-alerts/${alertId}`, data),
  deleteJobAlert: (alertId: number) => apiClient.delete(`/features/job-alerts/${alertId}`),

  // Followed Schools
  followSchool: (schoolId: number) => apiClient.post(`/features/followed-schools/${schoolId}`),
  unfollowSchool: (schoolId: number) => apiClient.delete(`/features/followed-schools/${schoolId}`),
  getFollowedSchools: () => apiClient.get('/features/followed-schools'),
  checkFollowingSchool: (schoolId: number) => apiClient.get(`/features/followed-schools/${schoolId}/check`),

  // Profile Strength
  getProfileStrength: (teacherId: number) => apiClient.get(`/features/profile-strength/${teacherId}`),
  updateProfileStrength: (data: any) => apiClient.put('/features/profile-strength', data),
  calculateProfileStrength: () => apiClient.post('/features/profile-strength/calculate'),

  // Job Match Score
  getJobMatchScore: (jobId: number) => apiClient.get(`/features/match-score/${jobId}`),
  calculateAllMatchScores: (jobIds: number[]) => apiClient.post('/features/match-scores', { jobIds }),

  // Statistics
  getTeacherStats: (teacherId?: number) =>
    teacherId 
      ? apiClient.get(`/features/stats/${teacherId}`)
      : apiClient.get('/features/stats'),

  // Reviews (Public)
  createReview: (data: any) => apiClient.post('/public/reviews', data),
  getReviews: (userId: number) => apiClient.get(`/public/reviews/${userId}`),
  updateReview: (reviewId: number, data: any) => apiClient.put(`/public/reviews/${reviewId}`, data),
  deleteReview: (reviewId: number) => apiClient.delete(`/public/reviews/${reviewId}`),

  // School Profiles (Public)
  getSchoolProfile: (schoolId: number) => apiClient.get(`/public/schools/${schoolId}/profile`),
  getSchoolJobs: (schoolId: number) => apiClient.get(`/public/schools/${schoolId}/jobs`),
  getFollowersCount: (schoolId: number) => apiClient.get(`/public/schools/${schoolId}/followers-count`),
}

// ============ SEARCH & DISCOVERY API ============

export const searchAPI = {
  // Search History
  saveSearch: (data: any) => apiClient.post('/search/save', data),
  getSearchHistory: (limit?: number) => apiClient.get('/search/history', { params: { limit } }),
  clearSearchHistory: () => apiClient.delete('/search/history'),
  deleteSearchHistoryItem: (searchId: number) => apiClient.delete(`/search/history/${searchId}`),

  // Saved Searches
  createSavedSearch: (data: any) => apiClient.post('/saved-searches', data),
  getSavedSearches: () => apiClient.get('/saved-searches'),
  updateSavedSearch: (searchId: number, data: any) => apiClient.put(`/saved-searches/${searchId}`, data),
  deleteSavedSearch: (searchId: number) => apiClient.delete(`/saved-searches/${searchId}`),

  // Job Comparison
  createComparison: (data: any) => apiClient.post('/comparisons', data),
  getComparisons: () => apiClient.get('/comparisons'),
  addJobToComparison: (comparisonId: number, jobId: number) =>
    apiClient.post(`/comparisons/${comparisonId}/jobs`, { jobId }),
  removeJobFromComparison: (comparisonId: number, jobId: number) =>
    apiClient.delete(`/comparisons/${comparisonId}/jobs`, { data: { jobId } }),
  deleteComparison: (comparisonId: number) => apiClient.delete(`/comparisons/${comparisonId}`),

  // Advanced Search
  advancedSearch: (filters: any) => apiClient.get('/search', { params: filters }),
  getSearchSuggestions: (query: string) => apiClient.get('/search/suggestions', { params: { query } }),

  // Categories & Locations
  getJobCategories: () => apiClient.get('/categories'),
  getLocationStats: () => apiClient.get('/locations'),

  // Recommended & Trending
  getRecommendedJobs: (limit?: number) => apiClient.get('/recommended', { params: { limit } }),
  getTrendingJobs: () => apiClient.get('/trending'),
}

// ============ ADVANCED FEATURES API ============

export const advancedAPI = {
  // Analytics
  getAnalyticsDashboard: () => apiClient.get('/analytics/dashboard'),

  // Skill Endorsements
  endorseSkill: (teacherId: number, skill: string) =>
    apiClient.post('/endorsements', { teacherId, skill }),
  getSkillEndorsements: (teacherId: number) =>
    apiClient.get(`/endorsements/${teacherId}`),
  removeEndorsement: (teacherId: number, skill: string) =>
    apiClient.delete(`/endorsements/${teacherId}/${skill}`),

  // Interview Experiences
  shareInterviewExperience: (data: any) =>
    apiClient.post('/interview-experiences', data),
  getSchoolInterviewExperiences: (schoolId: number) =>
    apiClient.get(`/interview-experiences/school/${schoolId}`),
  getJobInterviewExperiences: (jobId: number) =>
    apiClient.get(`/interview-experiences/job/${jobId}`),

  // Application Timeline
  getApplicationTimeline: (applicationId: number) =>
    apiClient.get(`/application-timeline/${applicationId}`),

  // Notifications
  getUnreadNotifications: (limit?: number) =>
    apiClient.get('/notifications/unread', { params: { limit } }),
  getAllNotifications: (limit?: number) =>
    apiClient.get('/notifications', { params: { limit } }),
  markNotificationAsRead: (notificationId: number) =>
    apiClient.put(`/notifications/${notificationId}/read`),
  markAllNotificationsAsRead: () =>
    apiClient.put('/notifications/mark-all-read'),

  // Interview Resources
  getInterviewResources: (subject?: string) =>
    apiClient.get('/interview-resources', { params: { subject } }),
  viewResource: (resourceId: number) =>
    apiClient.get(`/interview-resources/${resourceId}/view`),

  // Two-Way Ratings
  rateUser: (ratedId: number, rating: number, feedback: string, ratingType: string) =>
    apiClient.post('/ratings', { ratedId, rating, feedback, ratingType }),
  getUserRatings: (userId: number) =>
    apiClient.get(`/ratings/${userId}`),

  // Premium Features
  getPremiumStatus: () =>
    apiClient.get('/premium/status'),
  upgradeToPremium: (tier: string, durationDays?: number) =>
    apiClient.post('/premium/upgrade', { tier, durationDays }),
}

// School Features API
export const schoolFeaturesAPI = {
  // Analytics
  getSchoolAnalytics: () =>
    apiClient.get('/school-features/analytics'),
  getSchoolProfileStrength: () =>
    apiClient.get('/school-features/profile-strength'),

  // Applicant Management
  getSchoolApplicants: (page: number = 1, limit: number = 50) =>
    apiClient.get('/school-features/applicants', { params: { page, limit } }),
  getApplicantDetails: (applicationId: number) =>
    apiClient.get(`/school-features/applicants/${applicationId}`),
  updateApplicationStatus: (applicationId: number, status: string) =>
    apiClient.put(`/school-features/applicants/${applicationId}/status`, { status }),

  // Job Performance
  getJobPerformance: (jobId: number) =>
    apiClient.get(`/school-features/jobs/${jobId}/performance`),
  getAllJobPerformances: () =>
    apiClient.get('/school-features/jobs/performance/all'),

  // Shortlist Management
  createShortlist: (applicationId: number, notes?: string) =>
    apiClient.post('/school-features/shortlist', { applicationId, notes }),
  getSchoolShortlist: () =>
    apiClient.get('/school-features/shortlist'),
  removeFromShortlist: (applicationId: number) =>
    apiClient.delete(`/school-features/shortlist/${applicationId}`),

  // Candidate Ratings (School rating Teachers)
  rateCandidateBySchool: (teacherId: number, rating: number, feedback?: string) =>
    apiClient.post('/school-features/ratings', { teacherId, rating, feedback }),
  getCandidateRatings: (teacherId: number) =>
    apiClient.get(`/school-features/ratings/${teacherId}`),

  // Interview Management
  scheduleInterview: (applicationId: number, interviewDate: string, interviewType: string, notes?: string) =>
    apiClient.post('/school-features/interviews/schedule', { applicationId, interviewDate, interviewType, notes }),
  getScheduledInterviews: () =>
    apiClient.get('/school-features/interviews'),

  // Hiring Pipeline
  getHiringPipeline: () =>
    apiClient.get('/school-features/hiring-pipeline'),

  // Candidate Comparison
  compareCandidates: (applicationIds: number[]) =>
    apiClient.post('/school-features/candidates/compare', { applicationIds }),
}

export default apiClient

