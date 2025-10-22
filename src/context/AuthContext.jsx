"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { api } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/profile")
      setUser(response.data.user)
    } catch (error) {
      console.error("Error obteniendo perfil:", error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true) // ← Agrega esto para mejor UX
      const response = await api.post("/auth/login", { email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)

      return { 
        success: true,
        role: user.role // ← El rol viene del backend
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error al iniciar sesión"
      
      // Mensajes más específicos para el usuario
      let userMessage = errorMessage
      if (error.response?.status === 401) {
        userMessage = "Email o contraseña incorrectos"
      } else if (error.response?.status === 500) {
        userMessage = "Error del servidor. Intenta más tarde."
      }

      return {
        success: false,
        message: userMessage,
      }
    } finally {
      setLoading(false)
    }
  }


  const register = async (userData) => {
    try {
      await api.post("/auth/register", userData)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al registrarse",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const updateProfile = async (profileData) => {
    try {
      await api.put("/users/profile", profileData)
      await fetchProfile()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al actualizar perfil",
      }
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
