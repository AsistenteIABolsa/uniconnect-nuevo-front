//src.pages.HomePage.jsx
"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function HomePage() {
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
      <header className="border-b bg-white">
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
            <span className="text-xl font-bold">UniConnect</span>
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
                  <button className="btn btn-primary">Dashboard</button>
                </Link>
                <button onClick={logout} className="btn btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
                  Cerrar sesión
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
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Conectando talento universitario con oportunidades laborales
              </h1>
              <p className="max-w-[600px] text-text-light md:text-xl">
                UniConnect facilita la conexión entre estudiantes y empresas, creando oportunidades que impulsan carreras y negocios.
              </p>

              {!user && (
                <div className="flex flex-col gap-3 min-[400px]:flex-row mt-6">
    <Link to="/register?role=student" className="w-full min-[400px]:w-auto">
      <button className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2">
        Soy estudiante
        <span className="text-lg">→</span>
      </button>
    </Link>

    <Link to="/register?role=employer" className="w-full min-[400px]:w-auto">
      <button className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl shadow-md hover:bg-blue-50 transition duration-200 flex items-center justify-center gap-2">
        Soy empresario
        <span className="text-lg">→</span>
      </button>
    </Link>
  </div>
              )}
            </div>

            <div className="flex justify-center">
              <img
                alt="Estudiantes y empresarios conectando"
                className="w-40 sm:w-64 md:w-80 lg:w-96 xl:w-[500px] h-auto rounded-xl object-cover"
                src="https://www.ceupe.com/images/easyblog_articles/1788/b2ap3_amp_empresas-tecnologicas.jpg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-center sm:text-4xl">Características principales</h2>
          <p className="mt-2 max-w-[700px] mx-auto text-center text-text-light md:text-xl">
            Descubre cómo UniConnect facilita la conexión entre talento y oportunidades
          </p>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <h3 className="text-xl font-bold">Para estudiantes</h3>
              <p className="text-center text-text-light">
                Crea tu perfil profesional, destaca tus habilidades y aplica a vacantes exclusivas para universitarios.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <h3 className="text-xl font-bold">Para empresas</h3>
              <p className="text-center text-text-light">
                Publica vacantes, encuentra talento joven y gestiona aplicaciones de forma eficiente.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <h3 className="text-xl font-bold">Para universidades</h3>
              <p className="text-center text-text-light">
                Administra la plataforma, supervisa conexiones y ayuda a tus estudiantes a encontrar oportunidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-100 py-12 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-center sm:text-4xl">Cómo funciona</h2>
          <p className="mt-2 max-w-[700px] mx-auto text-center text-text-light md:text-xl">
            Un proceso simple para conectar talento con oportunidades
          </p>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-black text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold">Registra tu correo y Rol</h3>
              <p className="text-center text-text-light">Aspirantes y Empleadores registran su correo en nuestra plataforma.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-black text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold">Perfílate o Crea tu vacante con Danna</h3>
              <p className="text-center text-text-light">Aspirantes y Empleadores utilizan Danna para crear perfiles y vacantes atractivas.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-black text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold">Conecta</h3>
              <p className="text-center text-text-light">Empresas publican vacantes y aspirantes aplican a las que mejor se ajusten.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-black text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold">Crece</h3>
              <p className="text-center text-text-light">Inicia tu carrera profesional o encuentra el talento que tu empresa necesita.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
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
            <span className="text-lg font-bold">UniConnect</span>
          </div>
          <p className="text-center text-sm text-text-light md:text-left">
            © 2025 UniConnect. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-text-light hover:underline underline-offset-4">Términos</a>
            <a href="#" className="text-sm text-text-light hover:underline underline-offset-4">Privacidad</a>
            <a href="#" className="text-sm text-text-light hover:underline underline-offset-4">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
