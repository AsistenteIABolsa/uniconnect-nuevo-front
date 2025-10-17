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
  Plus
} from "lucide-react"

import { VapiWidgetEmbed } from "../../components/VapiWidgetEmbed";


const StudentProfile = () => {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    studentId: "",
    major: "",
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

  // Helper: convierte un posible string "Ingles-C3" a { name, level }
  const parseLanguageString = (s) => {
    if (!s) return { name: "", level: "" }
    if (typeof s !== "string") return s
    // dividir por "-" o ":" o "/" si hay
    const sep = s.includes("-") ? "-" : s.includes(":") ? ":" : s.includes("/") ? "/" : null
    if (sep) {
      const parts = s.split(sep)
      return { name: parts[0].trim(), level: (parts[1] || "").trim() }
    }
    return { name: s.trim(), level: "" }
  }

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
        graduationYear: user.graduationYear || "",
        about: user.about || "",
        skills: Array.isArray(user.skills) ? user.skills : (user.skills ? String(user.skills).split(",").map(s=>s.trim()).filter(Boolean) : []),
        education: Array.isArray(user.education) ? user.education : [],
        workExperience: Array.isArray(user.workExperience) ? user.workExperience : [],
        projects: Array.isArray(user.projects) ? user.projects : [],
        // languages: asegurar que sean objetos {name, level}
        languages: Array.isArray(user.languages) ? user.languages.map(l => (typeof l === "string" ? parseLanguageString(l) : (l || { name: "", level: "" }))) : [],
      })
    }
  }, [user])

  // Cambios simples
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // skills: texto separado por comas -> array de strings
  const handleSkillsChange = (e) => {
    const skills = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill)
    setFormData((prev) => ({ ...prev, skills }))
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

  // Toggle editar / cancelar (si cancela, revertir a user actual)
  const toggleEdit = () => {
    if (isEditing) {

      (
    <VapiWidgetEmbed
            assistantId={import.meta.env.VITE_VAPI_ASSISTANT_PERFIL}
            publicKey={import.meta.env.VITE_VAPI_PUBLIC_KEY}
            // props extra del widget si existen, ej:
            // theme="light" position="bottom-right"
          />
  )
      // cancelar: revertir datos a user
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
          skills: Array.isArray(user.skills) ? user.skills : (user.skills ? String(user.skills).split(",").map(s=>s.trim()).filter(Boolean) : []),
          education: Array.isArray(user.education) ? user.education : [],
          workExperience: Array.isArray(user.workExperience) ? user.workExperience : [],
          projects: Array.isArray(user.projects) ? user.projects : [],
          languages: Array.isArray(user.languages) ? user.languages.map(l => (typeof l === "string" ? parseLanguageString(l) : (l || { name: "", level: "" }))) : [],
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

    // Asegurarse de enviar languages como array de objetos {name, level}
    const payload = {
      ...formData,
      languages: (formData.languages || []).map(l => {
        // si existe como string por alguna razón, normalizar
        if (typeof l === "string") return parseLanguageString(l)
        return { name: l.name || "", level: l.level || "" }
      }),
      skills: Array.isArray(formData.skills) ? formData.skills : (formData.skills ? String(formData.skills).split(",").map(s=>s.trim()).filter(Boolean) : []),
    }

    try {
      const result = await updateProfile(payload)
      // suponiendo que updateProfile retorna { success: boolean, message?: string }
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isEditing ? (
          // ===== VISTA ESTÁTICA =====
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold">
                  {formData.firstName?.[0] || ""}{formData.lastName?.[0] || ""}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{formData.firstName} {formData.lastName}</h2>
                  <p className="text-gray-600">{formData.major}</p>
                  <p className="text-gray-500">{formData.about}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div><strong>Correo:</strong> {formData.email}</div>
                <div><strong>Teléfono:</strong> {formData.phone}</div>
                <div><strong>ID Estudiante:</strong> {formData.studentId}</div>
                <div><strong>Año Graduación:</strong> {formData.graduationYear}</div>
              </div>
            </div>

            {formData.skills?.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">Habilidades</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {formData.languages?.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">Idiomas</h3>
                {formData.languages.map((l, i) => (
                  <p key={i}>{l.name} — {l.level}</p>
                ))}
              </div>
            )}

            {formData.education?.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">Educación</h3>
                {formData.education.map((e, i) => (
                  <div key={i} className="mb-2">
                    <strong>{e.institution}</strong> — {e.degree} <span className="text-sm text-gray-500">{e.period}</span>
                    <p className="text-sm">{e.description}</p>
                  </div>
                ))}
              </div>
            )}

            {formData.workExperience?.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">Experiencia</h3>
                {formData.workExperience.map((w, i) => (
                  <div key={i} className="mb-2">
                    <strong>{w.position}</strong> — {w.company} <span className="text-sm text-gray-500">{w.period}</span>
                    <p className="text-sm">{w.description}</p>
                  </div>
                ))}
              </div>
            )}

            {formData.projects?.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">Proyectos</h3>
                {formData.projects.map((p, i) => (
                  <div key={i} className="mb-2">
                    <strong>{p.name}</strong> {p.link && (<a href={p.link} className="text-blue-500 ml-2">{p.link}</a>)}
                    <p className="text-sm">{p.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // ===== FORMULARIO COMPLETO =====
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

            {/* Datos básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Matrícula</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="studentId"
                    required
                    value={formData.studentId}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Año de graduación</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="graduationYear"
                    required
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Carrera</label>
              <input
                type="text"
                name="major"
                required
                value={formData.major}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Ingeniería en Sistemas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Habilidades (separadas por comas)</label>
              <input
                type="text"
                name="skills"
                value={(formData.skills || []).join(", ")}
                onChange={handleSkillsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="JavaScript, React, Node.js, Python"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Acerca de ti</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  name="about"
                  rows="4"
                  value={formData.about}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Cuéntanos sobre ti..."
                />
              </div>
            </div>

            {/* Idiomas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Idiomas</label>
              {(formData.languages || []).map((lang, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Idioma"
                    value={lang.name || ""}
                    onChange={(e) => handleArrayChange("languages", i, "name", e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Nivel (ej. B2, C1, C3)"
                    value={lang.level || ""}
                    onChange={(e) => handleArrayChange("languages", i, "level", e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                  <button type="button" onClick={() => removeArrayItem("languages", i)} className="p-2 rounded-md hover:bg-gray-100">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem("languages", { name: "", level: "" })} className="inline-flex items-center gap-2 px-3 py-1 border rounded-md">
                <Plus className="h-4 w-4" /> Añadir idioma
              </button>
            </div>

            {/* Educación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Educación</label>
              {(formData.education || []).map((edu, i) => (
                <div key={i} className="mb-2 border p-3 rounded">
                  <div className="flex justify-end">
                    <button type="button" onClick={() => removeArrayItem("education", i)} className="p-1 rounded hover:bg-gray-100">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                  <input type="text" placeholder="Institución" value={edu.institution || ""} onChange={(e) => handleArrayChange("education", i, "institution", e.target.value)} className="w-full border px-3 py-2 rounded mb-2" />
                  <input type="text" placeholder="Título / Carrera" value={edu.degree || ""} onChange={(e) => handleArrayChange("education", i, "degree", e.target.value)} className="w-full border px-3 py-2 rounded mb-2" />
                  <input type="text" placeholder="Periodo" value={edu.period || ""} onChange={(e) => handleArrayChange("education", i, "period", e.target.value)} className="w-full border px-3 py-2 rounded mb-2" />
                  <textarea placeholder="Descripción" value={edu.description || ""} onChange={(e) => handleArrayChange("education", i, "description", e.target.value)} className="w-full border px-3 py-2 rounded" />
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem("education", { institution: "", degree: "", period: "", description: "" })} className="inline-flex items-center gap-2 px-3 py-1 border rounded-md">
                <Plus className="h-4 w-4" /> Añadir educación
              </button>
            </div>

            {/* Experiencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experiencia Laboral</label>
              {(formData.workExperience || []).map((exp, i) => (
                <div key={i} className="mb-2 border p-3 rounded">
                  <div className="flex justify-end">
                    <button type="button" onClick={() => removeArrayItem("workExperience", i)} className="p-1 rounded hover:bg-gray-100">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                  <input type="text" placeholder="Empresa" value={exp.company || ""} onChange={(e) => handleArrayChange("workExperience", i, "company", e.target.value)} className="w-full border px-3 py-2 rounded mb-2" />
                  <input type="text" placeholder="Puesto" value={exp.position || ""} onChange={(e) => handleArrayChange("workExperience", i, "position", e.target.value)} className="w-full border px-3 py-2 rounded mb-2" />
                  <input type="text" placeholder="Periodo" value={exp.period || ""} onChange={(e) => handleArrayChange("workExperience", i, "period", e.target.value)} className="w-full border px-3 py-2 rounded mb-2" />
                  <textarea placeholder="Descripción" value={exp.description || ""} onChange={(e) => handleArrayChange("workExperience", i, "description", e.target.value)} className="w-full border px-3 py-2 rounded" />
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem("workExperience", { company: "", position: "", period: "", description: "" })} className="inline-flex items-center gap-2 px-3 py-1 border rounded-md">
                <Plus className="h-4 w-4" /> Añadir experiencia
              </button>
            </div>

            {/* Proyectos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proyectos</label>
              {(formData.projects || []).map((proj, i) => (
                <div key={i} className="mb-2 border p-3 rounded">
                  <div className="flex justify-end">
                    <button type="button" onClick={() => removeArrayItem("projects", i)} className="p-1 rounded hover:bg-gray-100">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                  <input type="text" placeholder="Nombre del proyecto" value={proj.name || ""} onChange={(e) => handleArrayChange("projects", i, "name", e.target.value)} className="w-full border px-3 py-2 rounded mb-2" />
                  <textarea placeholder="Descripción" value={proj.description || ""} onChange={(e) => handleArrayChange("projects", i, "description", e.target.value)} className="w-full border px-3 py-2 rounded mb-2" />
                  <input type="text" placeholder="Link" value={proj.link || ""} onChange={(e) => handleArrayChange("projects", i, "link", e.target.value)} className="w-full border px-3 py-2 rounded" />
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem("projects", { name: "", description: "", link: "" })} className="inline-flex items-center gap-2 px-3 py-1 border rounded-md">
                <Plus className="h-4 w-4" /> Añadir proyecto
              </button>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="flex items-center px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
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
