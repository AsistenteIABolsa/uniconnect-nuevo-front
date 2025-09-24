"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { GraduationCap, User, Mail, Lock, Phone, Building, AlertCircle, CheckCircle } from "lucide-react"

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "estudiante", // solo rol, sin campos extra
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await register(formData)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Registro exitoso!</h2>
          <p className="text-gray-600 mb-4">
            Tu cuenta ha sido creada correctamente. Serás redirigido al login en unos segundos.
          </p>
          <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
            Ir al login ahora
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <GraduationCap className="h-12 w-12 text-blue-600 mx-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Crear Cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Apellido</label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <div className="mt-1 relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tu número de teléfono"
                />
              </div>
            </div>

            {/* Tipo de usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de usuario</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="relative">
                  <input
                    type="radio"
                    name="role"
                    value="estudiante"
                    checked={formData.role === "estudiante"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.role === "estudiante"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center">
                      <GraduationCap className="h-6 w-6 text-blue-600" />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">Estudiante</div>
                        <div className="text-sm text-gray-500">Busco oportunidades laborales</div>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="relative">
                  <input
                    type="radio"
                    name="role"
                    value="empleador"
                    checked={formData.role === "empleador"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.role === "empleador"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center">
                      <Building className="h-6 w-6 text-green-600" />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">Empleador</div>
                        <div className="text-sm text-gray-500">Publico ofertas de trabajo</div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </button>
            </div>

            <div className="text-center">
              <Link to="/" className="text-sm text-blue-600 hover:text-blue-500">
                ← Volver al inicio
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
