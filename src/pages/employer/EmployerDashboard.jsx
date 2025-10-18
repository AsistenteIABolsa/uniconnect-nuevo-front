// src/pages/employer/EmployerDashboard.jsx
"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { jobService } from "../../services/api"
import {
  MapPin,
  DollarSign,
  GraduationCap,
  Award,
  Target,
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
  User,
  Save,
  X,
  AlertCircle,
  Mail,
  ArrowLeft,
  ExternalLink,
  Globe
} from "lucide-react"
import axios from "axios"

const EmployerDashboard = () => {
  const { user, logout } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [analisis_ia, setAnalisisIa] = useState(null)
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
  })

  // Estados para modal y aplicaciones
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [applications, setApplications] = useState([])
  const [selectedApplicant, setSelectedApplicant] = useState(null)

  // Estados para edición
  const [editingJob, setEditingJob] = useState(null)
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    requirements: [],
    responsibilities: [],
    benefits: [],
    skills: [],
    location: "",
    type: "Tiempo completo",
    mode: "Presencial",
    salary: "",
    experience: "",
    education: "",
    status: "active"
  })
  const [editLoading, setEditLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  // Estados para inputs temporales en edición
  const [newSkill, setNewSkill] = useState("")
  const [newRequirement, setNewRequirement] = useState("")
  const [newResponsibility, setNewResponsibility] = useState("")
  const [newBenefit, setNewBenefit] = useState("")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await jobService.getEmployerJobs()
      setJobs(response.data)

      // Calcular estadísticas
      const totalJobs = response.data.length
      const activeJobs = response.data.filter((job) => job.status === "active").length
      const totalApplications = response.data.reduce(
        (sum, job) => sum + (job.applicationsCount || 0),
        0
      )

      setStats({ totalJobs, activeJobs, totalApplications })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Abrir modal con aplicaciones 
  const handleViewApplications = async (jobId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/applications/jobs/${jobId}/applications`)

      const applicants = res.data.map(app => ({
        _id: app._id,
        name: `${app.student?.firstName || ''} ${app.student?.lastName || ''}`.trim(),
        skills: app.student?.skills || [],
        email: app.student?.email || '',
        phone: app.student?.phone || '',
        coverLetter: app.coverLetter || '',
        experience: app.student?.experience || "No especificada",
        about: app.student?.about || "",
        education: app.student?.education || [],
        workExperience: app.student?.workExperience || [],
        projects: app.student?.projects || [],
        languages: app.student?.languages || [],
        major: app.student?.major || "",
        graduationYear: app.student?.graduationYear || "",
        studentId: app.student?.studentId || "",
      }))

      setApplications(applicants)
      setSelectedJobId(jobId)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Error mostrando aplicaciones:", error)
      setMessage({ type: "error", text: "Error al cargar las aplicaciones" })
    }
  }

  // Funciones para editar trabajo
  const handleEditJob = (job) => {
    setEditingJob(job._id)
    setEditFormData({
      title: job.title || "",
      description: job.description || "",
      requirements: job.requirements || [],
      responsibilities: job.responsibilities || [],
      benefits: job.benefits || [],
      skills: job.skills || [],
      location: job.location || "",
      type: job.type || "Tiempo completo",
      mode: job.mode || "Presencial",
      salary: job.salary || "",
      experience: job.experience || "",
      education: job.education || "",
      status: job.status || "active"
    })
  }

  const handleCancelEdit = () => {
    setEditingJob(null)
    setEditFormData({
      title: "",
      description: "",
      requirements: [],
      responsibilities: [],
      benefits: [],
      skills: [],
      location: "",
      type: "Tiempo completo",
      mode: "Presencial",
      salary: "",
      experience: "",
      education: "",
      status: "active"
    })
    setMessage({ type: "", text: "" })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Funciones para arrays en edición
  const addArrayItemEdit = (arrayField, item, setItem) => {
    if (item.trim()) {
      setEditFormData(prev => ({
        ...prev,
        [arrayField]: [...prev[arrayField], item.trim()]
      }))
      setItem("")
    }
  }

  const removeArrayItemEdit = (arrayField, index) => {
    setEditFormData(prev => ({
      ...prev,
      [arrayField]: prev[arrayField].filter((_, i) => i !== index)
    }))
  }

  const handleUpdateJob = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    setMessage({ type: "", text: "" })

    try {
      await jobService.update(editingJob, editFormData)
      setMessage({ type: "success", text: "Trabajo actualizado exitosamente" })
      
      // Actualizar la lista de trabajos
      await fetchDashboardData()
      
      // Cerrar edición después de un tiempo
      setTimeout(() => {
        setEditingJob(null)
        setMessage({ type: "", text: "" })
      }, 2000)
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error al actualizar el trabajo"
      })
    } finally {
      setEditLoading(false)
    }
  }

  // Función para eliminar trabajo
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este trabajo? Esta acción no se puede deshacer.")) {
      return
    }

    try {
      await jobService.delete(jobId)
      setMessage({ type: "success", text: "Trabajo eliminado exitosamente" })
      
      // Actualizar la lista de trabajos
      await fetchDashboardData()
      
      // Limpiar mensaje después de un tiempo
      setTimeout(() => {
        setMessage({ type: "", text: "" })
      }, 3000)
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error al eliminar el trabajo"
      })
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

  // Lógica para análisis con IA
  const handleAnalyzeApplicants = async (jobId) => {
    setIsLoading(true)
    setAnalisisIa(null)
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/analisis-aplicados`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) throw new Error("Error analizando aplicaciones")

      const data = await res.json()
      setAnalisisIa(data.analisis_ia || data.message || "Análisis completado")
    } catch (error) {
      console.error("Error:", error)
      setAnalisisIa("Error al realizar el análisis: " + error.message)
    } finally {
      setIsLoading(false)
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
                {user?.companyName || user?.profile?.companyName || "Panel Empleador"}
              </span>
            </div>

            <nav className="flex items-center space-x-4">
              <Link
                to="/employer/profile"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <User className="h-4 w-4 mr-1" />
                Perfil Empresa
              </Link>
              
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
          <p className="mt-2 text-gray-600">
            Gestiona tus ofertas de empleo y revisa las aplicaciones de candidatos.
          </p>
        </div>

        {/* Mensajes */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${message.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <div className="flex">
              {message.type === "success" ? <CheckCircle className="h-5 w-5 text-green-400" /> : <AlertCircle className="h-5 w-5 text-red-400" />}
              <div className="ml-3">
                <p className={`text-sm ${message.type === "success" ? "text-green-800" : "text-red-800"}`}>{message.text}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Empleos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Empleos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Aplicaciones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Perfil Empresarial */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Perfil Empresarial</h3>
                <p className="text-gray-600">
                  Completa tu perfil empresarial para destacar tu empresa y atraer mejor talento.
                </p>
              </div>
            </div>
            <Link
              to="/employer/profile"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              <Edit className="h-4 w-4 mr-2" />
              Gestionar Perfil
            </Link>
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
                    {editingJob === job._id ? (
                      // FORMULARIO DE EDICIÓN COMPLETO
                      <form onSubmit={handleUpdateJob} className="space-y-6">
                        {message.text && (
                          <div className={`p-4 rounded-md ${message.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                            <div className="flex">
                              {message.type === "success" ? <CheckCircle className="h-5 w-5 text-green-400" /> : <AlertCircle className="h-5 w-5 text-red-400" />}
                              <div className="ml-3">
                                <p className={`text-sm ${message.type === "success" ? "text-green-800" : "text-red-800"}`}>{message.text}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Información Básica */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Building2 className="h-5 w-5 mr-2" />
                            Información Básica
                          </h2>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título del puesto *
                              </label>
                              <input
                                type="text"
                                name="title"
                                required
                                value={editFormData.title}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="ej. Desarrollador Frontend Senior"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ubicación *
                              </label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                  type="text"
                                  name="location"
                                  required
                                  value={editFormData.location}
                                  onChange={handleEditChange}
                                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Ciudad de México"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de empleo *
                              </label>
                              <div className="relative">
                                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <select
                                  name="type"
                                  required
                                  value={editFormData.type}
                                  onChange={handleEditChange}
                                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="Tiempo completo">Tiempo completo</option>
                                  <option value="Medio tiempo">Medio tiempo</option>
                                  <option value="Prácticas">Prácticas</option>
                                  <option value="Freelance">Freelance</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Modalidad de trabajo
                              </label>
                              <div className="relative">
                                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <select
                                  name="mode"
                                  value={editFormData.mode}
                                  onChange={handleEditChange}
                                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="Presencial">Presencial</option>
                                  <option value="Remoto">Remoto</option>
                                  <option value="Híbrido">Híbrido</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Salario (opcional)
                              </label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                  type="text"
                                  name="salary"
                                  value={editFormData.salary}
                                  onChange={handleEditChange}
                                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="$15,000 - $25,000 MXN"
                                />
                              </div>
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción del puesto *
                              </label>
                              <textarea
                                name="description"
                                required
                                rows="4"
                                value={editFormData.description}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Describe el puesto, la empresa y lo que hace especial esta oportunidad..."
                              />
                            </div>
                          </div>
                        </div>

                        {/* Requisitos del Puesto */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Award className="h-5 w-5 mr-2" />
                            Requisitos del Puesto
                          </h2>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Experiencia requerida
                              </label>
                              <select
                                name="experience"
                                value={editFormData.experience}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Seleccionar nivel</option>
                                <option value="Sin experiencia">Sin experiencia</option>
                                <option value="0-1 años">0-1 años</option>
                                <option value="0-2 años">0-2 años</option>
                                <option value="1-3 años">1-3 años</option>
                                <option value="3-5 años">3-5 años</option>
                                <option value="5+ años">5+ años</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nivel educativo
                              </label>
                              <div className="relative">
                                <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <select
                                  name="education"
                                  value={editFormData.education}
                                  onChange={handleEditChange}
                                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="">Seleccionar nivel</option>
                                  <option value="Bachillerato">Bachillerato</option>
                                  <option value="Técnico">Técnico</option>
                                  <option value="Licenciatura">Licenciatura</option>
                                  <option value="Maestría">Maestría</option>
                                  <option value="Doctorado">Doctorado</option>
                                </select>
                              </div>
                            </div>

                            {/* Habilidades */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Habilidades requeridas
                              </label>
                              <div className="space-y-2">
                                {editFormData.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {editFormData.skills.map((skill, index) => (
                                      <span key={index} className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                        {skill}
                                        <button
                                          type="button"
                                          onClick={() => removeArrayItemEdit("skills", index)}
                                          className="ml-2 text-blue-600 hover:text-blue-800"
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <div className="flex space-x-2">
                                  <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Nueva habilidad"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => addArrayItemEdit("skills", newSkill, setNewSkill)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Requisitos */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Requisitos
                              </label>
                              <div className="space-y-2">
                                {editFormData.requirements.map((req, index) => (
                                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                                    <span className="text-sm">{req}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeArrayItemEdit("requirements", index)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                                <div className="flex space-x-2">
                                  <input
                                    type="text"
                                    value={newRequirement}
                                    onChange={(e) => setNewRequirement(e.target.value)}
                                    placeholder="Nuevo requisito"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => addArrayItemEdit("requirements", newRequirement, setNewRequirement)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Responsabilidades */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Target className="h-5 w-5 mr-2" />
                            Responsabilidades
                          </h2>

                          <div className="space-y-2">
                            {editFormData.responsibilities.map((resp, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                                <span className="text-sm">{resp}</span>
                                <button
                                  type="button"
                                  onClick={() => removeArrayItemEdit("responsibilities", index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={newResponsibility}
                                onChange={(e) => setNewResponsibility(e.target.value)}
                                placeholder="Nueva responsabilidad"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => addArrayItemEdit("responsibilities", newResponsibility, setNewResponsibility)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Beneficios */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            Beneficios
                          </h2>

                          <div className="space-y-2">
                            {editFormData.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                                <span className="text-sm">{benefit}</span>
                                <button
                                  type="button"
                                  onClick={() => removeArrayItemEdit("benefits", index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={newBenefit}
                                onChange={(e) => setNewBenefit(e.target.value)}
                                placeholder="Nuevo beneficio"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => addArrayItemEdit("benefits", newBenefit, setNewBenefit)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Estado del trabajo */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <h2 className="text-xl font-bold text-gray-900 mb-4">Estado del Trabajo</h2>
                          <div className="flex items-center space-x-4">
                            <select
                              name="status"
                              value={editFormData.status}
                              onChange={handleEditChange}
                              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="active">Activo</option>
                              <option value="inactive">Inactivo</option>
                              <option value="closed">Cerrado</option>
                            </select>
                            <span className="text-sm text-gray-500">
                              Controla la visibilidad de esta oferta de empleo
                            </span>
                          </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex justify-end space-x-4 pt-4">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={editLoading}
                            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {editLoading ? "Guardando..." : "Guardar Cambios"}
                          </button>
                        </div>
                      </form>
                    ) : (
                      // VISTA NORMAL DEL TRABAJO
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                job.status
                              )}`}
                            >
                              {getStatusText(job.status)}
                            </span>
                          </div>

                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {job.description}
                          </p>

                          <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {job.type}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {job.applicationsCount || 0} aplicaciones
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
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
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
                            <button
                              onClick={() => handleViewApplications(job._id)}
                              className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver aplicaciones ({job.applicationsCount || 0})
                            </button>
                            <button 
                              onClick={() => handleEditJob(job)}
                              className="flex items-center text-gray-600 hover:text-gray-700 text-sm"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </button>
                            <button 
                              onClick={() => handleDeleteJob(job._id)}
                              className="flex items-center text-red-600 hover:text-red-700 text-sm"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tienes ofertas de empleo
                </h3>
                <p className="text-gray-600 mb-4">
                  Comienza creando tu primera oferta de empleo para atraer
                  candidatos.
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
              <h3 className="text-lg font-medium text-blue-900">
                ¿Necesitas ayuda?
              </h3>
              <p className="text-blue-700">
                Consulta nuestras guías para crear ofertas de empleo efectivas y
                atraer a los mejores candidatos.
              </p>
              <div className="mt-3 space-x-3">
                <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  Ver guías →
                </button>
                <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  Contactar soporte →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de aplicaciones */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedApplicant(null)
                  setAnalisisIa(null)
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {!selectedApplicant ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Aplicaciones</h2>
                    <button
                      onClick={() => handleAnalyzeApplicants(selectedJobId)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:opacity-90 transition"
                    >
                      Análisis con IA
                    </button>
                  </div>

                  {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
                        <p className="text-gray-700 font-medium">Analizando candidatos con IA...</p>
                      </div>
                    </div>
                  )}

                  {analisis_ia && !isLoading && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm">
                      <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                        Resultado del análisis
                      </h3>
                      <p className="text-gray-700 whitespace-pre-line">{analisis_ia}</p>
                    </div>
                  )}

                  <ul className="space-y-4">
                    {applications.length > 0 ? (
                      applications.map((applicant) => (
                        <li
                          key={applicant._id}
                          className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => setSelectedApplicant(applicant)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-lg text-gray-900">{applicant.name}</p>
                              <p className="text-gray-600 mt-1">{applicant.email}</p>
                              {applicant.skills?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {applicant.skills.slice(0, 4).map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {applicant.skills.length > 4 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                      +{applicant.skills.length - 4} más
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver perfil
                            </button>
                          </div>
                        </li>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No hay aplicaciones para esta oferta.</p>
                      </div>
                    )}
                  </ul>
                </>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Perfil del Candidato</h2>
                    <button
                      onClick={() => setSelectedApplicant(null)}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Volver a la lista
                    </button>
                  </div>

                  {/* Perfil completo del candidato */}
                  <div className="space-y-6">
                    {/* Información Personal */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Información Personal
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <strong className="text-gray-700">Nombre completo:</strong>
                          <p className="text-gray-900">{selectedApplicant.name}</p>
                        </div>
                        <div>
                          <strong className="text-gray-700">Email:</strong>
                          <p className="text-gray-900">{selectedApplicant.email}</p>
                        </div>
                        <div>
                          <strong className="text-gray-700">Teléfono:</strong>
                          <p className="text-gray-900">{selectedApplicant.phone || "No especificado"}</p>
                        </div>
                        <div>
                          <strong className="text-gray-700">Experiencia:</strong>
                          <p className="text-gray-900">{selectedApplicant.experience || "No especificada"}</p>
                        </div>
                        <div>
                          <strong className="text-gray-700">Carrera:</strong>
                          <p className="text-gray-900">{selectedApplicant.major || "No especificada"}</p>
                        </div>
                        <div>
                          <strong className="text-gray-700">Año de graduación:</strong>
                          <p className="text-gray-900">{selectedApplicant.graduationYear || "No especificado"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Carta de Presentación */}
                    {selectedApplicant.coverLetter && (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          Carta de Presentación
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">{selectedApplicant.coverLetter}</p>
                      </div>
                    )}

                    {/* Habilidades */}
                    {selectedApplicant.skills?.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <Award className="h-5 w-5 mr-2" />
                          Habilidades
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplicant.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Educación */}
                    {selectedApplicant.education?.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <GraduationCap className="h-5 w-5 mr-2" />
                          Educación
                        </h3>
                        <div className="space-y-4">
                          {selectedApplicant.education.map((edu, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                              <h4 className="text-lg font-semibold text-gray-900">{edu.institution}</h4>
                              <p className="text-gray-600">{edu.degree}</p>
                              <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                                <span>{edu.startDate} {edu.endDate && `- ${edu.endDate}`}</span>
                              </div>
                              {edu.description && (
                                <p className="text-gray-700 mt-2">{edu.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experiencia Laboral */}
                    {selectedApplicant.workExperience?.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <Briefcase className="h-5 w-5 mr-2" />
                          Experiencia Laboral
                        </h3>
                        <div className="space-y-4">
                          {selectedApplicant.workExperience.map((exp, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                              <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                              <p className="text-gray-600">{exp.company}</p>
                              <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                                <span>{exp.startDate} {exp.endDate && `- ${exp.endDate}`}</span>
                              </div>
                              {exp.description && (
                                <p className="text-gray-700 mt-2">{exp.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Proyectos */}
                    {selectedApplicant.projects?.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <Target className="h-5 w-5 mr-2" />
                          Proyectos
                        </h3>
                        <div className="space-y-4">
                          {selectedApplicant.projects.map((project, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                              <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                              <p className="text-gray-600 mt-1">{project.description}</p>
                              
                              {project.technologies?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {project.technologies.map((tech, techIndex) => (
                                    <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              {project.link && (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm mt-2"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Ver proyecto
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Idiomas */}
                    {selectedApplicant.languages?.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <Globe className="h-5 w-5 mr-2" />
                          Idiomas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedApplicant.languages.map((lang, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                              <span className="font-medium text-gray-900">{lang.name}</span>
                              <span className="text-sm text-gray-600">{lang.level}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Información Adicional */}
                    {selectedApplicant.about && (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          Acerca de
                        </h3>
                        <p className="text-gray-700">{selectedApplicant.about}</p>
                      </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        onClick={() => setSelectedApplicant(null)}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Volver a la lista
                      </button>
                      <a
                        href={`mailto:${selectedApplicant.email}`}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Contactar
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployerDashboard