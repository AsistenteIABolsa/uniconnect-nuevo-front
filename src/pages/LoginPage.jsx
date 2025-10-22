// src/pages/LoginPage.jsx - MEJORADO
"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { GraduationCap, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!formData.email || !formData.password) {
      setError("Por favor completa todos los campos")
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Por favor ingresa un email válido")
      return
    }

    setLoading(true)
    setError("")

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        // Navegar según el rol que viene del backend
        navigate(`/${result.role}`)
      } else {
        setError(result.message)
        
        // Limpiar campos específicos según el error
        if (result.message.includes("contraseña")) {
          setFormData(prev => ({ ...prev, password: "" }))
        }
      }
    } catch (error) {
      setError("Error de conexión. Verifica tu internet e intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  // Función para limpiar errores
  const clearError = () => {
    setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link 
              to="/register" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              onClick={clearError}
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Alertas de Error */}
          {error && (
            <div 
              className="bg-red-50 border border-red-200 rounded-md p-4 animate-fade-in"
              role="alert"
            >
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <div className="ml-3">
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                  <button
                    type="button"
                    onClick={clearError}
                    className="text-sm text-red-600 hover:text-red-500 mt-1 focus:outline-none"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
                    error && error.includes("email") ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm`}
                  placeholder="tu@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full pl-10 pr-10 py-3 border ${
                    error && error.includes("contraseña") ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm`}
                  placeholder="Tu contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Botón de Envío */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </div>

          {/* Enlaces */}
          <div className="flex flex-col space-y-3 text-center">
            <Link 
              to="/" 
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
              onClick={clearError}
            >
              ← Volver al inicio
            </Link>
            
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
              onClick={clearError}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>

        {/* Usuarios de prueba */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Usuarios de prueba:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>
              <strong>Estudiante:</strong> nico@gmail.com / nico12
            </p>
            <p>
              <strong>Empleador:</strong> juanjo@gmail.com / juanjo12
            </p>
            <p>
              <strong>Admin:</strong> admin@universidad.edu / password
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage