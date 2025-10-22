// src/pages/student/StudentProfile.jsx
"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  FileText,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Trash2,
  Plus,
  MapPin,
  Briefcase,
  Globe,
  Award,
  Target,
  Eye,
  ExternalLink,
} from "lucide-react"

const StudentProfile = () => {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    studentId: "",
    major: "",
    experience: "",
    graduationYear: "",
    about: "",
    skills: [],
    education: [],
    workExperience: [],
    projects: [],
    languages: [],
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [isEditing, setIsEditing] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [newTechnology, setNewTechnology] = useState("")

  // Normalizar los datos que vienen del user al abrir/actualizar
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        studentId: user.studentId || "",
        major: user.major || "",
        carrera: user.carrera || "",
        graduationYear: user.graduationYear || "",
        about: user.about || "",
        experience: user.experience || "",
        skills: Array.isArray(user.skills) ? user.skills : (user.skills ? String(user.skills).split(",").map(s=>s.trim()).filter(Boolean) : []),
        education: Array.isArray(user.education) ? user.education.map(edu => ({
          institution: edu.institution || "",
          degree: edu.degree || "",
          startDate: edu.startDate || "",
          endDate: edu.endDate || "",
          description: edu.description || ""
        })) : [],
        workExperience: Array.isArray(user.workExperience) ? user.workExperience.map(exp => ({
          company: exp.company || "",
          position: exp.position || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          description: exp.description || ""
        })) : [],
        projects: Array.isArray(user.projects) ? user.projects.map(proj => ({
          title: proj.title || proj.name || "",
          description: proj.description || "",
          technologies: proj.technologies || [],
          link: proj.link || ""
        })) : [],
        languages: Array.isArray(user.languages) ? user.languages.map(lang => ({
          name: lang.name || "",
          level: lang.level || ""
        })) : [],
      })
    }
  }, [user])

  // Cambios simples
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Cambios en arrays de objetos
  const handleArrayChange = (field, index, subfield, value) => {
    const updated = [...(formData[field] || [])]
    updated[index] = { ...updated[index], [subfield]: value }
    setFormData((prev) => ({ ...prev, [field]: updated }))
  }

  const addArrayItem = (field, itemTemplate) => {
    setFormData((prev) => ({ ...prev, [field]: [...(prev[field] || []), itemTemplate] }))
  }

  const removeArrayItem = (field, index) => {
    const updated = [...(formData[field] || [])]
    updated.splice(index, 1)
    setFormData(prev => ({ ...prev, [field]: updated }))
  }

  // Funciones para manejar arrays como en CompanyProfile
  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  // Funciones para proyectos
  const addTechnologyToProject = (projectIndex) => {
    if (newTechnology.trim()) {
      const updatedProjects = [...formData.projects]
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        technologies: [...(updatedProjects[projectIndex].technologies || []), newTechnology.trim()]
      }
      setFormData(prev => ({ ...prev, projects: updatedProjects }))
      setNewTechnology("")
    }
  }

  const removeTechnologyFromProject = (projectIndex, techIndex) => {
    const updatedProjects = [...formData.projects]
    updatedProjects[projectIndex] = {
      ...updatedProjects[projectIndex],
      technologies: (updatedProjects[projectIndex].technologies || []).filter((_, i) => i !== techIndex)
    }
    setFormData(prev => ({ ...prev, projects: updatedProjects }))
  }

  // Toggle editar / cancelar
  const toggleEdit = () => {
    if (isEditing) {
      // Cancelar: revertir datos a user
      if (user) {
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          studentId: user.studentId || "",
          major: user.major || "",
          graduationYear: user.graduationYear || "",
          about: user.about || "",
          experience: user.experience || "",
          skills: Array.isArray(user.skills) ? user.skills : (user.skills ? String(user.skills).split(",").map(s=>s.trim()).filter(Boolean) : []),
          education: Array.isArray(user.education) ? user.education.map(edu => ({
            institution: edu.institution || "",
            degree: edu.degree || "",
            startDate: edu.startDate || "",
            endDate: edu.endDate || "",
            description: edu.description || ""
          })) : [],
          workExperience: Array.isArray(user.workExperience) ? user.workExperience.map(exp => ({
            company: exp.company || "",
            position: exp.position || "",
            startDate: exp.startDate || "",
            endDate: exp.endDate || "",
            description: exp.description || ""
          })) : [],
          projects: Array.isArray(user.projects) ? user.projects.map(proj => ({
            title: proj.title || proj.name || "",
            description: proj.description || "",
            technologies: proj.technologies || [],
            link: proj.link || ""
          })) : [],
          languages: Array.isArray(user.languages) ? user.languages.map(lang => ({
            name: lang.name || "",
            level: lang.level || ""
          })) : [],
        })
      }
      setMessage({ type: "", text: "" })
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    const payload = {
      ...formData,
      languages: formData.languages || [],
      skills: formData.skills || [],
    }

    try {
      const result = await updateProfile(payload)
      if (result?.success) {
        setMessage({ type: "success", text: "Perfil actualizado exitosamente" })
        setIsEditing(false)
      } else {
        setMessage({ type: "error", text: result?.message || "Error actualizando perfil" })
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Error actualizando perfil" })
    } finally {
      setLoading(false)
    }
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
              <Link to="/student" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-5 w-5 mr-1" />
                Volver al Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
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
                <User className="h-5 w-5 mr-2" />
                Información Personal
              </h2>

              <div className="flex items-start space-x-6">
                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                  {formData.firstName?.[0] || ""}{formData.lastName?.[0] || ""}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{formData.firstName} {formData.lastName}</h3>
                  <p className="text-gray-600">{formData.carrera}</p>
                  {formData.about && (
                    <p className="text-gray-500 mt-2">{formData.about}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span><strong>Email:</strong> {formData.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span><strong>Teléfono:</strong> {formData.phone || "No especificado"}</span>
                </div> 
              <div className="flex items-center">
                 <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                 <span><strong>Experiencia:</strong> {formData.experience || "No especificada"}</span>
               </div>

              </div>
            </div> 
            

            {/* Habilidades */}
            {formData.skills?.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Habilidades
                </h2>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Idiomas */}
            {formData.languages?.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Idiomas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.languages.map((lang, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-sm text-gray-600">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Educación */}
            {formData.education?.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Educación
                </h2>
                <div className="space-y-4">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{edu.institution}</h3>
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
            {formData.workExperience?.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Experiencia Laboral
                </h2>
                <div className="space-y-4">
                  {formData.workExperience.map((exp, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
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
            {formData.projects?.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Proyectos
                </h2>
                <div className="space-y-4">
                  {formData.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
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

            {/* Información Personal */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información Personal
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">El correo no se puede modificar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
 <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Experiencia
    </label>
    <div className="relative">
      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <select
        name="experience"
        value={formData.experience}
        onChange={handleChange}
        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Seleccionar nivel de experiencia</option>
        <option value="Sin experiencia">Sin experiencia</option>
        <option value="0-1 años">0-1 años</option>
        <option value="1-3 años">1-3 años</option>
        <option value="3-5 años">3-5 años</option>
        <option value="5+ años">5+ años</option>
      </select>
    </div>
  </div>
                

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año de Graduación (si aplica)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="graduationYear"
                      
                      value={formData.graduationYear}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carrera *
                  </label>
                  <input
                    type="text"
                    name="major"
                    required
                    value={formData.major}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ingeniería en Sistemas"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Acerca de ti
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      name="about"
                      rows="4"
                      value={formData.about}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Cuéntanos sobre ti..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Habilidades */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Habilidades
              </h2>

              <div className="space-y-2">
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <Trash2 className="h-3 w-3" />
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
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Idiomas */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Idiomas
              </h2>

              {(formData.languages || []).map((lang, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Idioma"
                    value={lang.name || ""}
                    onChange={(e) => handleArrayChange("languages", i, "name", e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Nivel (ej. B2, C1, C3)"
                    value={lang.level || ""}
                    onChange={(e) => handleArrayChange("languages", i, "level", e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button type="button" onClick={() => removeArrayItem("languages", i)} className="p-2 rounded-md hover:bg-gray-100">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem("languages", { name: "", level: "" })} className="inline-flex items-center gap-2 px-3 py-1 border rounded-md hover:bg-gray-50">
                <Plus className="h-4 w-4" /> Añadir idioma
              </button>
            </div>

            {/* Educación */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Educación
              </h2>

              {(formData.education || []).map((edu, i) => (
                <div key={i} className="mb-4 border border-gray-200 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Institución Educativa {i + 1}</h3>
                    <button type="button" onClick={() => removeArrayItem("education", i)} className="p-1 rounded hover:bg-gray-100">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Institución" 
                      value={edu.institution || ""} 
                      onChange={(e) => handleArrayChange("education", i, "institution", e.target.value)} 
                      className="border px-3 py-2 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    />
                    <input 
                      type="text" 
                      placeholder="Título / Carrera" 
                      value={edu.degree || ""} 
                      onChange={(e) => handleArrayChange("education", i, "degree", e.target.value)} 
                      className="border px-3 py-2 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    />
                    <input 
                      type="text" 
                      placeholder="Fecha de inicio (MM/AAAA)" 
                      value={edu.startDate || ""} 
                      onChange={(e) => handleArrayChange("education", i, "startDate", e.target.value)} 
                      className="border px-3 py-2 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    />
                    <input 
                      type="text" 
                      placeholder="Fecha de fin (MM/AAAA)" 
                      value={edu.endDate || ""} 
                      onChange={(e) => handleArrayChange("education", i, "endDate", e.target.value)} 
                      className="border px-3 py-2 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <textarea 
                    placeholder="Descripción" 
                    value={edu.description || ""} 
                    onChange={(e) => handleArrayChange("education", i, "description", e.target.value)} 
                    className="w-full border px-3 py-2 rounded mt-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    rows="3"
                  />
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem("education", { institution: "", degree: "", startDate: "", endDate: "", description: "" })} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Plus className="h-4 w-4" /> Añadir educación
              </button>
            </div>

            {/* Experiencia Laboral */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Experiencia Laboral
              </h2>

              {(formData.workExperience || []).map((exp, i) => (
                <div key={i} className="mb-4 border border-gray-200 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Experiencia {i + 1}</h3>
                    <button type="button" onClick={() => removeArrayItem("workExperience", i)} className="p-1 rounded hover:bg-gray-100">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Empresa" 
                      value={exp.company || ""} 
                      onChange={(e) => handleArrayChange("workExperience", i, "company", e.target.value)} 
                      className="border px-3 py-2 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    />
                    <input 
                      type="text" 
                      placeholder="Puesto" 
                      value={exp.position || ""} 
                      onChange={(e) => handleArrayChange("workExperience", i, "position", e.target.value)} 
                      className="border px-3 py-2 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    />
                    <input 
                      type="text" 
                      placeholder="Fecha de inicio (MM/AAAA)" 
                      value={exp.startDate || ""} 
                      onChange={(e) => handleArrayChange("workExperience", i, "startDate", e.target.value)} 
                      className="border px-3 py-2 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    />
                    <input 
                      type="text" 
                      placeholder="Fecha de fin (MM/AAAA)" 
                      value={exp.endDate || ""} 
                      onChange={(e) => handleArrayChange("workExperience", i, "endDate", e.target.value)} 
                      className="border px-3 py-2 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <textarea 
                    placeholder="Descripción de responsabilidades y logros" 
                    value={exp.description || ""} 
                    onChange={(e) => handleArrayChange("workExperience", i, "description", e.target.value)} 
                    className="w-full border px-3 py-2 rounded mt-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    rows="3"
                  />
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem("workExperience", { company: "", position: "", startDate: "", endDate: "", description: "" })} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Plus className="h-4 w-4" /> Añadir experiencia
              </button>
            </div>

            {/* Proyectos */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Proyectos
              </h2>

              {(formData.projects || []).map((proj, i) => (
                <div key={i} className="mb-4 border border-gray-200 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Proyecto {i + 1}</h3>
                    <button type="button" onClick={() => removeArrayItem("projects", i)} className="p-1 rounded hover:bg-gray-100">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Nombre del proyecto" 
                    value={proj.title || ""} 
                    onChange={(e) => handleArrayChange("projects", i, "title", e.target.value)} 
                    className="w-full border px-3 py-2 rounded mb-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                  />
                  <textarea 
                    placeholder="Descripción del proyecto" 
                    value={proj.description || ""} 
                    onChange={(e) => handleArrayChange("projects", i, "description", e.target.value)} 
                    className="w-full border px-3 py-2 rounded mb-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    rows="3"
                  />
                  
                  {/* Tecnologías del proyecto */}
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tecnologías utilizadas
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(proj.technologies || []).map((tech, techIndex) => (
                        <span key={techIndex} className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechnologyFromProject(i, techIndex)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <Trash2 className="h-3 w-3" />
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
                        onClick={() => addTechnologyToProject(i)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <input 
                    type="text" 
                    placeholder="Link del proyecto (opcional)" 
                    value={proj.link || ""} 
                    onChange={(e) => handleArrayChange("projects", i, "link", e.target.value)} 
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem("projects", { title: "", description: "", technologies: [], link: "" })} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Plus className="h-4 w-4" /> Añadir proyecto
              </button>
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

export default StudentProfile