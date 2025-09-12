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
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span className="text-xl font-bold">UniConnect Jobs</span>
          </div>

          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Características
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              Cómo funciona
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to={getDashboardLink()}>
                  <button className="btn btn-outline">Dashboard</button>
                </Link>
                <button onClick={logout} className="btn btn-primary bg-red-600 hover:bg-red-700">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="btn btn-outline">Iniciar sesión</button>
                </Link>
                <Link to="/register">
                  <button className="btn btn-primary">Registrarse</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 md:py-24">
        <div className="container grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Conecta tu futuro <span className="text-blue-600">profesional</span>
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                La plataforma universitaria que conecta estudiantes talentosos con las mejores oportunidades laborales.
              </p>
            </div>

            {!user && (
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/register">
                  <button className="btn btn-primary">
                    Comenzar ahora
                  </button>
                </Link>
                <Link to="/login">
                  <button className="btn btn-outline">Iniciar sesión</button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <img
              alt="Estudiantes y empleadores"
              className="w-40 sm:w-64 md:w-80 lg:w-96 xl:w-[500px] h-auto rounded-xl object-cover"
              src="https://www.ceupe.com/images/easyblog_articles/1788/b2ap3_amp_empresas-tecnologicas.jpg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Características principales</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl">
              Descubre cómo Universidad Jobs facilita la conexión entre talento y oportunidades
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Users className="h-10 w-10 text-blue-600" />
              <h3 className="text-xl font-bold">Para Estudiantes</h3>
              <p className="text-center text-gray-500">
                Encuentra oportunidades laborales que se adapten a tu perfil académico y profesional.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Building2 className="h-10 w-10 text-green-600" />
              <h3 className="text-xl font-bold">Para Empleadores</h3>
              <p className="text-center text-gray-500">
                Conecta con talento universitario y encuentra a los candidatos ideales para tu empresa.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Briefcase className="h-10 w-10 text-purple-600" />
              <h3 className="text-xl font-bold">Oportunidades</h3>
              <p className="text-center text-gray-500">
                Desde prácticas profesionales hasta empleos de tiempo completo en las mejores empresas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-100 py-12 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Cómo funciona</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl">
              Un proceso simple para conectar talento con oportunidades
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold">Crea tu perfil</h3>
              <p className="text-center text-gray-500">
                Estudiantes y empresas crean perfiles detallados con información relevante.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold">Conecta</h3>
              <p className="text-center text-gray-500">
                Empresas publican vacantes y estudiantes aplican a las que mejor se ajusten a su perfil.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold">Crece</h3>
              <p className="text-center text-gray-500">
                Inicia tu carrera profesional o encuentra el talento que tu empresa necesita.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8 mt-auto">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-bold">Universidad Jobs</span>
          </div>
          <p className="text-center text-sm text-gray-500 md:text-left">
            © 2024 Universidad Jobs. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-gray-500 hover:underline underline-offset-4">
              Términos
            </a>
            <a href="#" className="text-sm text-gray-500 hover:underline underline-offset-4">
              Privacidad
            </a>
            <a href="#" className="text-sm text-gray-500 hover:underline underline-offset-4">
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
