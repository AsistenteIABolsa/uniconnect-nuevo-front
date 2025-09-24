//src.pages.student.StudentDashboard.jsx
"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { jobService, applicationService } from "../../services/api"
import { User, Briefcase, FileText, Search, MapPin, Clock, LogOut, GraduationCap } from "lucide-react"

const StudentDashboard = () => {
  const { user, logout } = useAuth()
  const [recentJobs, setRecentJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [jobsResponse, applicationsResponse] = await Promise.all([
        jobService.getAll({ limit: 5 }),
        applicationService.getStudentApplications(),
      ])

      setRecentJobs(jobsResponse.data.slice(0, 5))
      setApplications(applicationsResponse.data.slice(0, 5))
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "reviewed":
        return "Revisada"
      case "accepted":
        return "Aceptada"
      case "rejected":
        return "Rechazada"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Universidad Jobs</span>
            </div>

            <nav className="flex items-center space-x-4">
              <Link
                to="/student/jobs"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Buscar Empleos
              </Link>
              <Link
                to="/student/profile"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Mi Perfil
              </Link>
              <button
                onClick={logout}
                className="flex items-center text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Salir
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">¡Hola, {user?.firstName}! 👋</h1>
          <p className="mt-2 text-gray-600">
            Bienvenido a tu dashboard. Aquí puedes ver las últimas oportunidades y el estado de tus aplicaciones.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/student/jobs" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Buscar Empleos</h3>
                <p className="text-sm text-gray-500">Encuentra oportunidades perfectas para ti</p>
              </div>
            </div>
          </Link>

          <Link to="/student/profile" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Mi Perfil</h3>
                <p className="text-sm text-gray-500">Actualiza tu información personal</p>
              </div>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Mis Aplicaciones</h3>
                <p className="text-sm text-gray-500">{applications.length} aplicaciones activas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Empleos Recientes</h2>
                <Link to="/student/jobs" className="text-sm text-blue-600 hover:text-blue-500">
                  Ver todos
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentJobs.length > 0 ? (
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div
                      key={job._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{job.companyName}</p>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {job.type}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {job.posted}
                            </div>
                          </div>
                        </div>
                        <Link
                          to={`/student/jobs/${job._id}`}
                          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                        >
                          Ver detalles
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hay empleos disponibles</p>
                </div>
              )}
            </div>
          </div>

          {/* My Applications */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Mis Aplicaciones</h2>
            </div>
            <div className="p-6">
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">{application.job.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{application.companyName}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              Aplicado el {application.appliedAt}
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}
                            >
                              {getStatusText(application.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No has aplicado a ningún empleo aún</p>
                  <Link
                    to="/student/jobs"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                  >
                    Buscar empleos
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-900">Completa tu perfil</h3>
              <p className="text-blue-700">
                Un perfil completo aumenta tus posibilidades de ser contactado por empleadores.
              </p>
              <Link
                to="/student/profile"
                className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Actualizar perfil
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
