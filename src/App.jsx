import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ProjectForm from './pages/admin/ProjectForm'
import SiteConfig from './pages/admin/SiteConfig'
import Domains from './pages/admin/Domains'
import Timeline from './pages/admin/Timeline'
import Skills from './pages/admin/Skills'
import ProtectedRoute from './components/admin/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
      <Route path="/projects" element={<><Navbar /><Projects /><Footer /></>} />
      <Route path="/projects/:slug" element={<><Navbar /><ProjectDetail /><Footer /></>} />
      <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
      <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />

      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/projects/new"   element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
      <Route path="/admin/projects/:id"   element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
      <Route path="/admin/site"           element={<ProtectedRoute><SiteConfig /></ProtectedRoute>} />
      <Route path="/admin/domains"        element={<ProtectedRoute><Domains /></ProtectedRoute>} />
      <Route path="/admin/timeline"       element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
      <Route path="/admin/skills"         element={<ProtectedRoute><Skills /></ProtectedRoute>} />
    </Routes>
  )
}
