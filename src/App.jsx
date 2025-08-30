import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import StudentDashboard from "./pages/student/StudentDashboard"
import StudentProfile from "./pages/student/StudentProfile"
import StudentJobs from "./pages/student/StudentJobs"
import JobDetail from "./pages/student/JobDetail"
import EmployerDashboard from "./pages/employer/EmployerDashboard"
import NewJob from "./pages/employer/NewJob"
import AdminDashboard from "./pages/admin/AdminDashboard"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas de estudiante */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={["estudiante"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={["estudiante"]}>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/jobs"
              element={
                <ProtectedRoute allowedRoles={["estudiante"]}>
                  <StudentJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/jobs/:id"
              element={
                <ProtectedRoute allowedRoles={["estudiante"]}>
                  <JobDetail />
                </ProtectedRoute>
              }
            />

            {/* Rutas de empleador */}
            <Route
              path="/employer"
              element={
                <ProtectedRoute allowedRoles={["empleador"]}>
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer/new-job"
              element={
                <ProtectedRoute allowedRoles={["empleador"]}>
                  <NewJob />
                </ProtectedRoute>
              }
            />

            {/* Rutas de administrador */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["administrador"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
