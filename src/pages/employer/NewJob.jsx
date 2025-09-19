//src.pages.employer.NewJob.jsx

"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { jobService } from "../../services/api"
import {
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  GraduationCap,
} from "lucide-react"

const NewJob = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
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
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleArrayChange = (field, value) => {
    const items = value
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item)
    setFormData((prev) => ({
      ...prev,
      [field]: items,
    }))
  }

  const handleSkillsChange = (e) => {
    const skills = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill)
    setFormData((prev) => ({
      ...prev,
      skills,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      await jobService.create(formData)
      setMessage({ type: "success", text: "Oferta de empleo creada exitosamente" })
      setTimeout(() => {
        navigate("/employer")
      }, 2000)
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error al crear la oferta de empleo",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link to="/employer" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeft className="h-5 w-5 mr-1" />
              Volver al Dashboard
            </Link>
            <Building2 className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Nueva Oferta de Empleo</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Información del Empleo</h2>
            <p className="text-sm text-gray-600">
              Completa todos los campos para crear una oferta atractiva para los candidatos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {message.text && (
              <div
                className={`mb-6 p-4 rounded-md ${
                  message.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex">
                  {message.type === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                  <div className="ml-3">
                    <p className={`text-sm ${message.type === "success" ? "text-green-800" : "text-red-800"}`}>
                      {message.text}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título del puesto *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ej. Desarrollador Frontend Senior"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del puesto *</label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe el puesto, la empresa y lo que hace especial esta oportunidad..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ciudad de México"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de empleo *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleChange}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad de trabajo</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Presencial">Presencial</option>
                      <option value="Remoto">Remoto</option>
                      <option value="Híbrido">Híbrido</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salario (opcional)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="$15,000 - $25,000 MXN"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experiencia requerida</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nivel educativo</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habilidades requeridas (separadas por comas)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills.join(", ")}
                  onChange={handleSkillsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="JavaScript, React, Node.js, Python"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsabilidades (una por línea)
                </label>
                <textarea
                  rows="4"
                  value={formData.responsibilities.join("\n")}
                  onChange={(e) => handleArrayChange("responsibilities", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Desarrollar interfaces de usuario responsivas&#10;Colaborar con el equipo de diseño&#10;Optimizar el rendimiento de las aplicaciones"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requisitos (una por línea)</label>
                <textarea
                  rows="4"
                  value={formData.requirements.join("\n")}
                  onChange={(e) => handleArrayChange("requirements", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Licenciatura en Ingeniería en Sistemas&#10;Experiencia con React y JavaScript&#10;Conocimiento de HTML/CSS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beneficios (una por línea)</label>
                <textarea
                  rows="4"
                  value={formData.benefits.join("\n")}
                  onChange={(e) => handleArrayChange("benefits", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Salario competitivo&#10;Horario flexible&#10;Seguro médico&#10;Oportunidades de crecimiento"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <Link
                to="/employer"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Creando..." : "Crear Oferta"}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Skills */}
        {formData.skills.length > 0 && (
          <div className="mt-8 bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Habilidades requeridas</h3>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default NewJob
