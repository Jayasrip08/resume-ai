import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Upload, Search, Users } from 'lucide-react'
import LandingPage from './pages/LandingPage'
import UploadPage from './pages/UploadPage'
import MatchPage from './pages/MatchPage'
import CandidatesPage from './pages/CandidatesPage'
import './index.css'

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        <div className="logo-icon">
          <Brain size={18} color="white" strokeWidth={2.5} />
        </div>
        <span className="logo-text">
          Resume<span style={{ color: 'var(--accent-primary)' }}>AI</span>
        </span>
      </NavLink>

      <div className="navbar-links">
        <NavLink to="/upload" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Upload size={16} />
          <span>Upload</span>
        </NavLink>
        <NavLink to="/match" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Search size={16} />
          <span>Match</span>
        </NavLink>
        <NavLink to="/candidates" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Users size={16} />
          <span>Candidates</span>
        </NavLink>
      </div>
    </nav>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/match" element={<MatchPage />} />
        <Route path="/candidates" element={<CandidatesPage />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  )
}
