"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { userService } from "../../services/api"
import {
  Users,
  Briefcase,
  GraduationCap,
  Building2,
  FileText,
  LogOut,
  Shield,
  TrendingUp,
  Calendar,
} from "lucide-react"

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalEmployers: 0,
    totalJobs: 0,
    totalApplications: 0,
  })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, usersResponse] = await Promise.all([userService.getStats(), userService.getAll()])

      setStats(statsResponse.data)
      setUsers(usersResponse.data.slice(0, 10)) // Mostrar solo los primeros 10
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "estudiante":
        return "bg-blue-100 text-blue-800"
      case "empleador":
        return "bg-green-100 text-green-800"
      case "administrador":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleText = (role) => {
    switch (role) {
      case "estudiante":
        return "Estudiante"
      case "empleador":
        return "Empleador"
      case "administrador":
        return "Administrador"
      default:
        return role
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
              <Shield className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Panel de Administración</span>
            </div>

            <nav className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.firstName} {user?.lastName}
              </span>
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
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración 🛡️</h1>
          <p className="mt-2 text-gray-600">Monitorea y gestiona la plataforma universitaria de empleos.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Estudiantes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Empleadores</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEmployers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Empleos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Aplicaciones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Usuarios Recientes</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {user.role === "estudiante" ? (
                          <GraduationCap className="h-8 w-8 text-blue-600" />
                        ) : user.role === "empleador" ? (
                          <Building2 className="h-8 w-8 text-green-600" />
                        ) : (
                          <Shield className="h-8 w-8 text-purple-600" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.role === "estudiante" && user.profile?.major && (
                          <p className="text-xs text-gray-400">{user.profile.major}</p>
                        )}
                        {user.role === "empleador" && user.profile?.companyName && (
                          <p className="text-xs text-gray-400">{user.profile.companyName}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                      <div className="text-xs text-gray-500">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(user.createdAt).toLocaleDateString("es-ES")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Platform Analytics */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Análisis de la Plataforma</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* User Distribution */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Distribución de Usuarios</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Estudiantes</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(stats.totalStudents / stats.totalUsers) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round((stats.totalStudents / stats.totalUsers) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Empleadores</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(stats.totalEmployers / stats.totalUsers) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round((stats.totalEmployers / stats.totalUsers) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Metrics */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Métricas de Actividad</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.totalJobs > 0 ? Math.round(stats.totalApplications / stats.totalJobs) : 0}
                      </div>
                      <div className="text-xs text-blue-600">Aplicaciones por empleo</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {stats.totalStudents > 0
                          ? Math.round((stats.totalApplications / stats.totalStudents) * 100)
                          : 0}
                        %
                      </div>
                      <div className="text-xs text-green-600">Estudiantes activos</div>
                    </div>
                  </div>
                </div>

                {/* Growth Indicator */}
                <div className="flex items-center justify-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-600">Plataforma en crecimiento</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Estado del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-green-900">Base de Datos</p>
                <p className="text-xs text-green-700">Operacional</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-green-900">API</p>
                <p className="text-xs text-green-700">Funcionando</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-green-900">Autenticación</p>
                <p className="text-xs text-green-700">Activa</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
