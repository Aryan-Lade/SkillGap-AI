import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const submitProfile = (profile) => api.post('/profile', profile)

export const getSkillGap = (profile) => api.post('/skillgap', profile)

export const getRoadmap = (profile) => api.post('/roadmap', profile)

export const getAllRoles = () => api.get('/roles')

export const getRoleDetail = (roleName) => api.get(`/roles/${encodeURIComponent(roleName)}`)

export const updateProgress = (progressData) => api.post('/progress', progressData)

export const fetchProgress = (studentId, roleName) =>
  api.get(`/progress/${encodeURIComponent(studentId)}/${encodeURIComponent(roleName)}`)

export const getSkillQuiz = (skill, role = 'Full Stack Developer', level = 'Intermediate') =>
  api.get(`/quiz/generate`, {
    params: { skill, role, level },
  })

export const submitSkillQuiz = (submissionData) => api.post('/quiz/submit', submissionData)

export const parseResumeFile = (formData) =>
  api.post('/resume/parse', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const parseResumeText = (payload) => api.post('/resume/parse-text', payload)

export const analyzeJobDescription = (payload) => api.post('/jd/analyze', payload)

export const getMarketOverview = () => api.get('/market/overview')

export const getRoleMarketData = (roleName) =>
  api.get(`/market/role/${encodeURIComponent(roleName)}`)

export const estimateSalaryBoost = (payload) => api.post('/market/estimate-salary', payload)

export const getSandboxChallenges = (skill) =>
  api.get('/sandbox/challenges', { params: skill ? { skill } : {} })

export const runSandboxCode = (payload) => api.post('/sandbox/run', payload)

export const generateStudyPlan = (payload) => api.post('/planner/generate', payload)

export const exportCalendarIcs = (payload) =>
  api.post('/planner/export-ics', payload, {
    responseType: 'blob',
  })

export default api
