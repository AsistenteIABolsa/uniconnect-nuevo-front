"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Users, Briefcase, GraduationCap, Building2 } from "lucide-react"

const HomePage = () => {
  const { user, logout } = useAuth()

  const getDashboardLink = () => {
    if (!user) return "/login"

    switch (user.role) {
      case "estudiante":
        return "/student"
      case "empleador":
        return "/employer"
      case "administrador":
        return "/admin"
      default:
        return "/login"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Universidad Jobs</span>
            </div>

            <nav className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Conecta tu futuro
            <span className="text-blue-600"> profesional</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            La plataforma universitaria que conecta estudiantes talentosos con las mejores oportunidades laborales.
          </p>

          {!user && (
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Comenzar ahora
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Para Estudiantes</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Encuentra oportunidades laborales que se adapten a tu perfil académico y profesional.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Para Empleadores</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Conecta con talento universitario y encuentra a los candidatos ideales para tu empresa.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Oportunidades</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Desde prácticas profesionales hasta empleos de tiempo completo en las mejores empresas.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-gray-500">Estudiantes registrados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">100+</div>
              <div className="text-sm text-gray-500">Empresas asociadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">1000+</div>
              <div className="text-sm text-gray-500">Oportunidades publicadas</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-lg font-semibold">Universidad Jobs</span>
            </div>
            <p className="mt-2 text-gray-400">Conectando talento universitario con oportunidades profesionales</p>
            <p className="mt-4 text-sm text-gray-500">© 2024 Universidad Jobs. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
