import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PublicPortfolio from './pages/public/PublicPortfolio'
import AdminLogin from './pages/admin/AdminLogin'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'
import DashboardOverview from './pages/admin/DashboardOverview'
import ContentListPage from './pages/admin/ContentListPage'
import ProjectDetail from './pages/public/ProjectDetail'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPortfolio />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="projects" element={<ContentListPage type="Projects" />} />
          <Route path="experience" element={<ContentListPage type="Experience" />} />
          <Route path="certificates" element={<ContentListPage type="Certificates" />} />
          <Route path="skills" element={<ContentListPage type="Skills" />} />
          <Route path="education" element={<ContentListPage type="Education" />} />
          <Route path="profile" element={<ContentListPage type="Profile" />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
