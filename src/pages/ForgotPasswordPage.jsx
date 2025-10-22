// src/pages/ForgotPasswordPage.jsx
"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { GraduationCap, Mail, Lock, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1) // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState("")
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const navigate = useNavigate()

  // Paso 1: Solicitar código
  const handleSendCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep(2)
        setSuccess("Código enviado exitosamente")
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError("Error de conexión. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  // Manejo del código
  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`).focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`).focus()
    }
  }

  // Paso 2: Verificar código
  const handleVerifyCode = async (e) => {
    e.preventDefault()
    const verificationCode = code.join("")
    
    if (verificationCode.length !== 6) {
      setError("Por favor ingresa el código completo de 6 dígitos")
      return
    }

    setStep(3)
    setError("")
  }

  // Paso 3: Establecer nueva contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)
    setError("")

    try {
      const verificationCode = code.join("")
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          code: verificationCode, 
          newPassword 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Contraseña restablecida exitosamente. Redirigiendo al login...")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setError(data.message)
        setStep(2) // Volver al paso de código si hay error
      }
    } catch (error) {
      setError("Error de conexión. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 1 && "Recuperar contraseña"}
            {step === 2 && "Verificar código"}
            {step === 3 && "Nueva contraseña"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1 && "Ingresa tu email para recibir un código de recuperación"}
            {step === 2 && `Hemos enviado un código a ${email}`}
            {step === 3 && "Crea una nueva contraseña para tu cuenta"}
          </p>
        </div>

        <form 
          className="mt-8 space-y-6" 
          onSubmit={
            step === 1 ? handleSendCode : 
            step === 2 ? handleVerifyCode : 
            handleResetPassword
          }
        >
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
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Paso 1: Email */}
          {step === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
          )}

          {/* Paso 2: Código */}
          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Ingresa el código de 6 dígitos
              </label>
              <div className="flex justify-center space-x-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Paso 3: Nueva contraseña */}
          {step === 3 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nueva contraseña
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength="6"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Procesando..." : 
               step === 1 ? "Enviar código" : 
               step === 2 ? "Verificar código" : 
               "Restablecer contraseña"}
            </button>

            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Atrás
              </button>
            )}
          </div>

          <div className="text-center">
            <Link to="/login" className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-500 mx-auto">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordPage