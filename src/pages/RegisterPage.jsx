// src/pages/RegisterPage.jsx
"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { GraduationCap, User, Mail, Lock, Phone, Building, AlertCircle, Send } from "lucide-react"

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "estudiante",
  })
  const [verificationCode, setVerificationCode] = useState("")
  const [step, setStep] = useState(1) // 1: registro, 2: verificación
  const [loading, setLoading] = useState(false)
  const [codeLoading, setCodeLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Paso 1: Enviar código de verificación
// En RegisterPage.jsx, modifica handleSendCode:
const handleSendCode = async () => {
  if (!formData.email) {
    setError("Por favor ingresa tu email primero")
    return
  }

  setCodeLoading(true)
  setError("")

  try {
    const response = await fetch("http://localhost:5000/api/auth/send-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), // Envía todos los datos del formulario
    })

    const data = await response.json()

    if (response.ok) {
      setSuccess("Código enviado a tu email. Revisa tu bandeja de entrada.")
      setStep(2)
    } else {
      setError(data.message)
    }
  } catch (error) {
    setError("Error de conexión. Intenta nuevamente.")
  } finally {
    setCodeLoading(false)
  }
}
  // Paso 2: Completar registro con código
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!verificationCode) {
      setError("Por favor ingresa el código de verificación")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          verificationCode: verificationCode
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("¡Cuenta creada exitosamente! Redirigiendo al login...")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError("Error de conexión. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <GraduationCap className="h-12 w-12 text-blue-600 mx-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {step === 1 ? "Crear Cuenta" : "Verificar Email"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 ? "¿Ya tienes cuenta?" : "Ingresa el código de verificación"}{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              {step === 1 ? "Inicia sesión aquí" : "Volver al login"}
            </Link>
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8">
          {step === 1 ? (
            <form className="space-y-6">
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

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-green-400" />
                    <div className="ml-3">
                      <p className="text-sm text-green-800">{success}</p>
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
                <label className="block text-sm font-medium text-gray-700">Teléfono (opcional)</label>
                <div className="mt-1 relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              {/* Tipo de usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de perfil</label>
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

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={codeLoading || !formData.email}
                  className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {codeLoading ? "Enviando código..." : "Enviar Código"}
                </button>
              </div>

              <div className="text-center">
                <Link to="/" className="text-sm text-blue-600 hover:text-blue-500">
                  ← Volver al inicio
                </Link>
              </div>
            </form>
          ) : (
            // Paso 2: Verificación
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

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-green-400" />
                    <div className="ml-3">
                      <p className="text-sm text-green-800">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Ingresa el código de 6 dígitos enviado a {formData.email}
                </label>
                <div className="flex justify-center space-x-2">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={verificationCode[index] || ""}
                      onChange={(e) => {
                        const newCode = verificationCode.split("")
                        newCode[index] = e.target.value
                        setVerificationCode(newCode.join(""))
                        
                        if (e.target.value && index < 5) {
                          document.getElementById(`code-${index + 1}`).focus()
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
                          document.getElementById(`code-${index - 1}`).focus()
                        }
                      }}
                      id={`code-${index}`}
                      className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creando cuenta..." : "Completar Registro"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Volver atrás
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegisterPage