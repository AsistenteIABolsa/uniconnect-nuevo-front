//src.pages.employer.EmployerDashboard.jsx
"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { jobService } from "../../services/api"
import {
  Plus,
  Briefcase,
  Users,
  Eye,
  Edit,
  Trash2,
  LogOut,
  Building2,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react"

const EmployerDashboard = () => {
  const { user, logout } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await jobService.getEmployerJobs()
      setJobs(response.data)

      // Calculate stats
      const totalJobs = response.data.length
      const activeJobs = response.data.filter((job) => job.status === "active").length
      const totalApplications = response.data.reduce((sum, job) => sum + job.applicationsCount, 0)

      setStats({ totalJobs, activeJobs, totalApplications })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Activo"
      case "inactive":
        return "Inactivo"
      case "closed":
        return "Cerrado"
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
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                {user?.profile?.companyName || "Panel Empleador"}
              </span>
            </div>

            <nav className="flex items-center space-x-4">
              <Link
                to="/employer/new-job"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Nuevo Empleo
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
          <p className="mt-2 text-gray-600">Gestiona tus ofertas de empleo y revisa las aplicaciones de candidatos.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Empleos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Empleos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Aplicaciones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Mis Ofertas de Empleo</h2>
              <Link
                to="/employer/new-job"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Crear Nuevo
              </Link>
            </div>
          </div>

          <div className="p-6">
            {jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {getStatusText(job.status)}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>

                        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {job.type}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {job.applicationsCount} aplicaciones
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(job.createdAt).toLocaleDateString("es-ES")}
                          </div>
                        </div>

                        {/* Skills */}
                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills.slice(0, 4).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{job.skills.length - 4} más
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center space-x-3">
                          <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver aplicaciones ({job.applicationsCount})
                          </button>
                          <button className="flex items-center text-gray-600 hover:text-gray-700 text-sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </button>
                          <button className="flex items-center text-red-600 hover:text-red-700 text-sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes ofertas de empleo</h3>
                <p className="text-gray-600 mb-4">
                  Comienza creando tu primera oferta de empleo para atraer candidatos.
                </p>
                <Link
                  to="/employer/new-job"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 inline-flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Crear Primera Oferta
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-900">¿Necesitas ayuda?</h3>
              <p className="text-blue-700">
                Consulta nuestras guías para crear ofertas de empleo efectivas y atraer a los mejores candidatos.
              </p>
              <div className="mt-3 space-x-3">
                <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">Ver guías →</button>
                <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">Contactar soporte →</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default EmployerDashboard
