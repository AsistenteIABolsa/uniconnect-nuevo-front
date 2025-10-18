// src.services.api.js

import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      delete api.defaults.headers.common["Authorization"]
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Servicios de trabajos
export const jobService = {
  getAll: (params = {}) => api.get("/jobs", { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (jobData) => api.post("/jobs", jobData),
  getEmployerJobs: () => api.get("/jobs/employer"),
  update: (id, jobData) => api.put(`/jobs/${id}`, jobData), // NUEVO
  delete: (id) => api.delete(`/jobs/${id}`), // NUEVO
}
// Servicios de aplicaciones
export const applicationService = {
  apply: (applicationData) => api.post("/applications", applicationData),
  getStudentApplications: () => api.get("/applications/student"),
  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (applicationId, status) => api.patch(`/applications/${applicationId}`, { status }),
}

// Servicios de usuarios
export const userService = {
  getStats: () => api.get("/users/stats"),
  getAll: () => api.get("/users"),
}
