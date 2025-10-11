"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  ExternalLink,
  Target,
  Eye,
  Award,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Github,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

const CompanyProfile = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false) // Cambiado a false por defecto
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    description: "",
    contactPhone: "",
    mision: "",
    vision: "",
    companyProfile: {
      founded: "",
      headquarters: "",
      specialties: [],
      values: [],
      culture: "",
      achievements: [],
    },
    socialMedia: {
      website: "",
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: "",
      github: "",
    },
    companyProjects: [],
  })

  const [newSpecialty, setNewSpecialty] = useState("")
  const [newValue, setNewValue] = useState("")
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: [],
    link: "",
    startDate: "",
    endDate: "",
    status: "Planificado",
  })
  const [newTechnology, setNewTechnology] = useState("")

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        companyName: user.companyName || "",
        industry: user.industry || "",
        companySize: user.companySize || "",
        description: user.description || "",
        contactPhone: user.contactPhone || user.phone || "",
        mision: user.mision || "",
        vision: user.vision || "",
        companyProfile: user.companyProfile || {
          founded: "",
          headquarters: "",
          specialties: [],
          values: [],
          culture: "",
          achievements: [],
        },
        socialMedia: user.socialMedia || {
          website: "",
          linkedin: "",
          twitter: "",
          facebook: "",
          instagram: "",
          github: "",
        },
        companyProjects: user.companyProjects || [],
      })
    }
  }, [user])

  // Toggle editar / cancelar
  const toggleEdit = () => {
    if (isEditing) {
      // Cancelar: revertir datos a user
      if (user) {
        setFormData({
          companyName: user.companyName || "",
          industry: user.industry || "",
          companySize: user.companySize || "",
          description: user.description || "",
          contactPhone: user.contactPhone || user.phone || "",
          mision: user.mision || "",
          vision: user.vision || "",
          companyProfile: user.companyProfile || {
            founded: "",
            headquarters: "",
            specialties: [],
            values: [],
            culture: "",
            achievements: [],
          },
          socialMedia: user.socialMedia || {
            website: "",
            linkedin: "",
            twitter: "",
            facebook: "",
            instagram: "",
            github: "",
          },
          companyProjects: user.companyProjects || [],
        })
      }
      setMessage({ type: "", text: "" })
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }))
  }

  const handleCompanyProfileChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      companyProfile: {
        ...prev.companyProfile,
        [field]: value
      }
    }))
  }

  const addArrayItem = (arrayField, item, setItem) => {
    if (item.trim()) {
      setFormData(prev => ({
        ...prev,
        companyProfile: {
          ...prev.companyProfile,
          [arrayField]: [...prev.companyProfile[arrayField], item.trim()]
        }
      }))
      setItem("")
    }
  }

  const removeArrayItem = (arrayField, index) => {
    setFormData(prev => ({
      ...prev,
      companyProfile: {
        ...prev.companyProfile,
        [arrayField]: prev.companyProfile[arrayField].filter((_, i) => i !== index)
      }
    }))
  }

  const addProject = () => {
    if (newProject.title.trim()) {
      setFormData(prev => ({
        ...prev,
        companyProjects: [...prev.companyProjects, { ...newProject }]
      }))
      setNewProject({
        title: "",
        description: "",
        technologies: [],
        link: "",
        startDate: "",
        endDate: "",
        status: "Planificado",
      })
    }
  }

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      companyProjects: prev.companyProjects.filter((_, i) => i !== index)
    }))
  }

  const addTechnologyToProject = () => {
    if (newTechnology.trim()) {
      setNewProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }))
      setNewTechnology("")
    }
  }

  const removeTechnologyFromProject = (index) => {
    setNewProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const result = await updateProfile(formData)
      if (result.success) {
        setMessage({ type: "success", text: "Perfil actualizado exitosamente" })
        setIsEditing(false)
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al actualizar el perfil" })
    } finally {
      setLoading(false)
    }
  }

  const getSocialIcon = (platform) => {
    const icons = {
      website: Globe,
      linkedin: Linkedin,
      twitter: Twitter,
      facebook: Facebook,
      instagram: Instagram,
      github: Github,
    }
    return icons[platform] || Globe
  }

  const getStatusColor = (status) => {
    const colors = {
      "En progreso": "bg-yellow-100 text-yellow-800",
      "Completado": "bg-green-100 text-green-800",
      "Planificado": "bg-blue-100 text-blue-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  if (!user) {
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
              <Link to="/employer" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-5 w-5 mr-1" />
                Volver al Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Perfil Empresarial</h1>
            </div>

            <div>
              <button
                onClick={toggleEdit}
                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                {isEditing ? "Cancelar" : "Editar Perfil"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isEditing ? (
          // ===== VISTA ESTÁTICA =====
          <div className="space-y-6">
            {/* Información Básica */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Información Básica
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Nombre de la Empresa:</strong> {formData.companyName || "No especificado"}
                </div>
                <div>
                  <strong>Industria:</strong> {formData.industry || "No especificada"}
                </div>
                <div>
                  <strong>Tamaño de la Empresa:</strong> {formData.companySize || "No especificado"}
                </div>
                <div>
                  <strong>Email:</strong> {user?.email}
                </div>
                <div>
                  <strong>Teléfono:</strong> {formData.contactPhone || "No especificado"}
                </div>
              </div>

              {formData.description && (
                <div className="mt-4">
                  <strong>Descripción:</strong>
                  <p className="text-gray-600 mt-1">{formData.description}</p>
                </div>
              )}
            </div>

            {/* Misión y Visión */}
            {(formData.mision || formData.vision) && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Misión y Visión
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.mision && (
                    <div>
                      <strong>Misión:</strong>
                      <p className="text-gray-600 mt-1">{formData.mision}</p>
                    </div>
                  )}
                  {formData.vision && (
                    <div>
                      <strong>Visión:</strong>
                      <p className="text-gray-600 mt-1">{formData.vision}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Perfil Empresarial */}
            {(formData.companyProfile.founded || formData.companyProfile.headquarters || formData.companyProfile.culture || formData.companyProfile.specialties.length > 0 || formData.companyProfile.values.length > 0) && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Perfil Empresarial
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.companyProfile.founded && (
                    <div><strong>Año de Fundación:</strong> {formData.companyProfile.founded}</div>
                  )}
                  {formData.companyProfile.headquarters && (
                    <div><strong>Sede Principal:</strong> {formData.companyProfile.headquarters}</div>
                  )}
                  {formData.companyProfile.culture && (
                    <div className="md:col-span-2">
                      <strong>Cultura Organizacional:</strong>
                      <p className="text-gray-600 mt-1">{formData.companyProfile.culture}</p>
                    </div>
                  )}
                </div>

                {formData.companyProfile.specialties.length > 0 && (
                  <div className="mt-4">
                    <strong>Especialidades:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.companyProfile.specialties.map((specialty, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {formData.companyProfile.values.length > 0 && (
                  <div className="mt-4">
                    <strong>Valores Corporativos:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.companyProfile.values.map((value, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Redes Sociales */}
            {Object.values(formData.socialMedia).some(url => url) && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Redes Sociales
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.socialMedia).map(([platform, url]) => {
                    if (!url) return null
                    const IconComponent = getSocialIcon(platform)
                    return (
                      <div key={platform} className="flex items-center">
                        <IconComponent className="h-4 w-4 mr-2 text-gray-600" />
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Proyectos Destacados */}
            {formData.companyProjects.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Proyectos Destacados
                </h2>

                <div className="space-y-4">
                  {formData.companyProjects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-gray-600 mt-1">{project.description}</p>
                      
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                        <span>{project.startDate} - {project.endDate || "Presente"}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      
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
          </div>
        ) : (
          // ===== FORMULARIO DE EDICIÓN =====
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
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

            {/* Información Básica */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Información Básica
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Empresa *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industria
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño de la Empresa
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar tamaño</option>
                    <option value="1-10 empleados">1-10 empleados</option>
                    <option value="11-50 empleados">11-50 empleados</option>
                    <option value="51-200 empleados">51-200 empleados</option>
                    <option value="201-500 empleados">201-500 empleados</option>
                    <option value="500+ empleados">500+ empleados</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Contacto
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <div className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                      {user?.email}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">El email no puede ser modificado</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de Contacto
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción de la Empresa
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Misión y Visión */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Misión y Visión
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Misión
                  </label>
                  <textarea
                    name="mision"
                    rows="4"
                    value={formData.mision}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe el propósito fundamental de tu empresa..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visión
                  </label>
                  <textarea
                    name="vision"
                    rows="4"
                    value={formData.vision}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe la aspiración futura de tu empresa..."
                  />
                </div>
              </div>
            </div>

            {/* Perfil Empresarial */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Perfil Empresarial
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año de Fundación
                  </label>
                  <input
                    type="text"
                    value={formData.companyProfile.founded}
                    onChange={(e) => handleCompanyProfileChange("founded", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sede Principal
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.companyProfile.headquarters}
                      onChange={(e) => handleCompanyProfileChange("headquarters", e.target.value)}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cultura Organizacional
                  </label>
                  <textarea
                    rows="3"
                    value={formData.companyProfile.culture}
                    onChange={(e) => handleCompanyProfileChange("culture", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Especialidades */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especialidades
                  </label>
                  <div className="space-y-2">
                    {formData.companyProfile.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                        <span>{specialty}</span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem("specialties", index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        placeholder="Nueva especialidad"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => addArrayItem("specialties", newSpecialty, setNewSpecialty)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Valores */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valores Corporativos
                  </label>
                  <div className="space-y-2">
                    {formData.companyProfile.values.map((value, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                        <span>{value}</span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem("values", index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="Nuevo valor"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => addArrayItem("values", newValue, setNewValue)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Redes Sociales */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Redes Sociales
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData.socialMedia).map(([platform, url]) => {
                  const IconComponent = getSocialIcon(platform)
                  return (
                    <div key={platform}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {platform}
                      </label>
                      <div className="relative">
                        <IconComponent className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
                          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`https://${platform}.com/...`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Proyectos Destacados */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Proyectos Destacados
              </h2>

              {/* Lista de Proyectos */}
              <div className="space-y-4 mb-6">
                {formData.companyProjects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{project.startDate} - {project.endDate || "Presente"}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    
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

              {/* Formulario para nuevo proyecto */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Proyecto</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Título del proyecto"
                      value={newProject.title}
                      onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    
                    <select
                      value={newProject.status}
                      onChange={(e) => setNewProject(prev => ({ ...prev, status: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Planificado">Planificado</option>
                      <option value="En progreso">En progreso</option>
                      <option value="Completado">Completado</option>
                    </select>
                  </div>

                  <textarea
                    placeholder="Descripción del proyecto"
                    rows="3"
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Fecha de inicio (MM/AAAA)"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    
                    <input
                      type="text"
                      placeholder="Fecha de fin (MM/AAAA) o vacío si en curso"
                      value={newProject.endDate}
                      onChange={(e) => setNewProject(prev => ({ ...prev, endDate: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tecnologías utilizadas
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newProject.technologies.map((tech, index) => (
                        <span key={index} className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechnologyFromProject(index)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Nueva tecnología"
                        value={newTechnology}
                        onChange={(e) => setNewTechnology(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={addTechnologyToProject}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="url"
                    placeholder="Enlace al proyecto (opcional)"
                    value={newProject.link}
                    onChange={(e) => setNewProject(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />

                  <button
                    type="button"
                    onClick={addProject}
                    disabled={!newProject.title.trim()}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Proyecto
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}

export default CompanyProfile