"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { jobService, applicationService } from "../../services/api"
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Building2,
  Users,
  CheckCircle,
  AlertCircle,
  Send,
  GraduationCap,
  Eye,
  ExternalLink,
  Target,
  Award,
  Globe,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Github,
} from "lucide-react"

const JobDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showCompanyProfile, setShowCompanyProfile] = useState(false)

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    try {
      const response = await jobService.getById(id)
      setJob(response.data)
    } catch (error) {
      console.error("Error fetching job:", error)
      if (error.response?.status === 404) {
        navigate("/student/jobs")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!coverLetter.trim()) {
      setMessage({ type: "error", text: "Por favor escribe una carta de presentación" })
      return
    }

    setApplying(true)
    setMessage({ type: "", text: "" })

    try {
      await applicationService.apply({
        jobId: id,
        coverLetter: coverLetter.trim(),
      })

      setApplied(true)
      setShowApplicationForm(false)
      setMessage({ type: "success", text: "¡Aplicación enviada exitosamente!" })
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error al enviar la aplicación",
      })
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Empleo no encontrado</h2>
          <Link to="/student/jobs" className="text-blue-600 hover:text-blue-500">
            Volver a la búsqueda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link to="/student/jobs" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeft className="h-5 w-5 mr-1" />
              Volver a empleos
            </Link>
            <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Detalles del Empleo</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center text-xl text-gray-600 mb-4">
                <Building2 className="h-5 w-5 mr-2" />
                <span className="font-medium">{job.companyName}</span>
              </div>
            </div>

            {!applied && !showApplicationForm && (
              <button
                onClick={() => setShowApplicationForm(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Aplicar ahora
              </button>
            )}

            {applied && (
              <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-md">
                <CheckCircle className="h-5 w-5 mr-2" />
                Ya aplicaste
              </div>
            )}
          </div>

          {/* Job Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Briefcase className="h-4 w-4 mr-2" />
              <span>{job.type}</span>
            </div>
            {job.mode && (
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>{job.mode}</span>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center text-gray-600">
                <DollarSign className="h-4 w-4 mr-2" />
                <span>{job.salary}</span>
              </div>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Publicado el {job.posted}</span>
          </div>
        </div>

        {/* Messages */}
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

        {/* Application Form */}
        {showApplicationForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Aplicar a {job.title}</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Carta de presentación *</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Explica por qué eres el candidato ideal para este puesto..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowApplicationForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {applying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar aplicación
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción del puesto</h2>
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Responsabilidades</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requisitos</h2>
                <ul className="space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Beneficios</h2>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills Required */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Habilidades requeridas</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Job Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Detalles del empleo</h3>
              <div className="space-y-3">
                {job.experience && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Experiencia:</span>
                    <p className="text-gray-900">{job.experience}</p>
                  </div>
                )}
                {job.education && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Educación:</span>
                    <p className="text-gray-900">{job.education}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-500">Tipo:</span>
                  <p className="text-gray-900">{job.type}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Ubicación:</span>
                  <p className="text-gray-900">{job.location}</p>
                </div>
                {job.mode && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Modalidad:</span>
                    <p className="text-gray-900">{job.mode}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Sobre la empresa</h3>
                <button
                  onClick={() => setShowCompanyProfile(true)}
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver perfil completo
                </button>
              </div>
              <div className="flex items-center mb-3">
                <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                <span className="font-medium text-gray-900">{job.companyName}</span>
              </div>
              {job.companyDescription && (
                <p className="text-gray-700 text-sm mb-3 line-clamp-3">{job.companyDescription}</p>
              )}
              <div className="text-xs text-gray-500">
                Haz clic en "Ver perfil completo" para conocer más sobre esta empresa
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Perfil de Empresa */}
{showCompanyProfile && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Perfil de {job.companyName}</h2>
          <button
            onClick={() => setShowCompanyProfile(false)}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido del perfil de la empresa */}
        <div className="space-y-6">
          {/* Información Básica */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Información Básica
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong className="text-gray-700">Nombre de la Empresa:</strong>
                <p className="text-gray-900">{job.companyName}</p>
              </div>
              <div>
                <strong className="text-gray-700">Industria:</strong>
                <p className="text-gray-900">{job.employer?.industry || "No especificada"}</p>
              </div>
              <div>
                <strong className="text-gray-700">Tamaño:</strong>
                <p className="text-gray-900">{job.employer?.companySize || "No especificado"}</p>
              </div>
              <div>
                <strong className="text-gray-700">Ubicación:</strong>
                <p className="text-gray-900">{job.location}</p>
              </div>
            </div>

            {job.companyDescription && (
              <div className="mt-4">
                <strong className="text-gray-700">Descripción:</strong>
                <p className="text-gray-600 mt-1">{job.companyDescription}</p>
              </div>
            )}
          </div>

          {/* Misión y Visión */}
          {(job.employer?.mision || job.employer?.vision) && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Misión y Visión
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {job.employer?.mision && (
                  <div>
                    <strong className="text-gray-700">Misión:</strong>
                    <p className="text-gray-600 mt-1">{job.employer.mision}</p>
                  </div>
                )}
                {job.employer?.vision && (
                  <div>
                    <strong className="text-gray-700">Visión:</strong>
                    <p className="text-gray-600 mt-1">{job.employer.vision}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Perfil Empresarial */}
          {(job.employer?.companyProfile?.founded || 
            job.employer?.companyProfile?.headquarters || 
            job.employer?.companyProfile?.culture ||
            job.employer?.companyProfile?.specialties?.length > 0 || 
            job.employer?.companyProfile?.values?.length > 0) && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Perfil Empresarial
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.employer?.companyProfile?.founded && (
                  <div>
                    <strong className="text-gray-700">Año de Fundación:</strong>
                    <p className="text-gray-900">{job.employer.companyProfile.founded}</p>
                  </div>
                )}
                {job.employer?.companyProfile?.headquarters && (
                  <div>
                    <strong className="text-gray-700">Sede Principal:</strong>
                    <p className="text-gray-900">{job.employer.companyProfile.headquarters}</p>
                  </div>
                )}
              </div>

              {job.employer?.companyProfile?.culture && (
                <div className="mt-4">
                  <strong className="text-gray-700">Cultura Organizacional:</strong>
                  <p className="text-gray-600 mt-1">{job.employer.companyProfile.culture}</p>
                </div>
              )}

              {/* Especialidades */}
              {job.employer?.companyProfile?.specialties?.length > 0 && (
                <div className="mt-4">
                  <strong className="text-gray-700">Especialidades:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {job.employer.companyProfile.specialties.map((specialty, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Valores */}
              {job.employer?.companyProfile?.values?.length > 0 && (
                <div className="mt-4">
                  <strong className="text-gray-700">Valores Corporativos:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {job.employer.companyProfile.values.map((value, index) => (
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
          {job.employer?.socialMedia && Object.values(job.employer.socialMedia).some(url => url) && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Redes Sociales
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(job.employer.socialMedia).map(([platform, url]) => {
                  if (!url) return null
                  
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
                  
                  const IconComponent = getSocialIcon(platform)
                  const platformNames = {
                    website: "Sitio Web",
                    linkedin: "LinkedIn",
                    twitter: "Twitter",
                    facebook: "Facebook",
                    instagram: "Instagram",
                    github: "GitHub",
                  }
                  
                  return (
                    <div key={platform} className="flex items-center">
                      <IconComponent className="h-4 w-4 mr-2 text-gray-600" />
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {platformNames[platform] || platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Proyectos Destacados */}
          {job.employer?.companyProjects?.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Proyectos Destacados
              </h3>

              <div className="space-y-4">
                {job.employer.companyProjects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h4>
                    
                    {project.description && (
                      <p className="text-gray-600 mb-3">{project.description}</p>
                    )}
                    
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {project.startDate} {project.endDate ? `- ${project.endDate}` : project.status === "En progreso" ? "- Presente" : ""}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        project.status === "Completado" ? "bg-green-100 text-green-800" :
                        project.status === "En progreso" ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
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

          {/* Contacto */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Información de Contacto
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <span><strong>Email:</strong> {job.employer?.email || "No disponible"}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <span><strong>Teléfono:</strong> {job.employer?.contactPhone || job.employer?.phone || "No disponible"}</span>
              </div>
            </div>
          </div>

          {/* Nota */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-sm">
              💼 Esta empresa ha publicado esta vacante a través de Unicontet. 
              Para más información o contactar directamente, utiliza la información de contacto proporcionada.
            </p>
          </div>
        </div>

        {/* Botón para cerrar */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => setShowCompanyProfile(false)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

export default JobDetail