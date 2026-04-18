import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Users, RefreshCw, ExternalLink, Calendar, Tag, AlertCircle, Search } from 'lucide-react'

const API_BASE = '/api'

function CandidateCard({ candidate, index }) {
  const skills = candidate.skills
    ? candidate.skills.split(',').map(s => s.trim()).filter(Boolean)
    : []

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)`,
            border: `1px solid var(--border)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {candidate.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 2 }}>{candidate.name}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={12} />
              {new Date(candidate.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <a
          href={candidate.filename}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary btn-sm"
          style={{ padding: '8px', borderRadius: '10px' }}
        >
          <ExternalLink size={14} />
        </a>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Tag size={12} color="var(--text-muted)" />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Core Competencies
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {skills.length > 0
            ? skills.slice(0, 6).map(s => (
                <span key={s} className="badge" style={{ background: '#f8fafc', color: 'var(--text-secondary)', border: '1px solid var(--border)', fontSize: '0.75rem' }}>{s}</span>
              ))
            : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No skills detected</span>
          }
          {skills.length > 6 && (
            <span className="badge" style={{ background: 'transparent', color: 'var(--accent-primary)', border: '1px dashed var(--accent-primary)', fontSize: '0.75rem' }}>+{skills.length - 6} more</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  const fetchCandidates = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.get(`${API_BASE}/candidates`)
      setCandidates(data.candidates || [])
    } catch (err) {
      setError('System unavailable. Please verify connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCandidates() }, [])

  const filtered = (candidates || []).filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.skills || '').toLowerCase().includes(search.toLowerCase())
  )

  const allSkills = new Set(
    (candidates || []).flatMap(c => (c.skills || '').split(',').map(s => s.trim()).filter(Boolean))
  )

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div className="section-heading" style={{ marginBottom: 0 }}>
          <h1><span className="gradient-text">Candidate Directory</span></h1>
          <p>Comprehensive index of processed talent profiles.</p>
        </div>

        <button className="btn btn-secondary" style={{ borderRadius: 12 }} onClick={fetchCandidates} disabled={loading}>
          <RefreshCw size={16} style={{ marginRight: 8 }} className={loading ? 'spin' : ''} />
          Sync Data
        </button>
      </div>

      {/* Stats and Search Bar */}
      {!loading && !error && candidates.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 400px', gap: '1.5rem', marginBottom: '2.5rem', alignItems: 'center' }}>
           {/* Stats Container */}
           <div style={{ display: 'flex', gap: '2.5rem', padding: '0 0.5rem' }}>
              <div>
                <div className="stat-value" style={{ fontSize: '1.5rem' }}>{candidates.length}</div>
                <div className="stat-label" style={{ fontSize: '0.65rem' }}>Profiles</div>
              </div>
              <div>
                <div className="stat-value" style={{ fontSize: '1.5rem' }}>{allSkills.size}</div>
                <div className="stat-label" style={{ fontSize: '0.65rem' }}>Total Skills</div>
              </div>
              <div>
                <div className="stat-value" style={{ fontSize: '1.5rem' }}>
                  {candidates && candidates.length > 0
                    ? (candidates.reduce((a, c) => a + (c.skills || '').split(',').filter(Boolean).length, 0) / candidates.length).toFixed(1)
                    : 0}
                </div>
                <div className="stat-label" style={{ fontSize: '0.65rem' }}>Avg. Density</div>
              </div>
           </div>

           {/* Elegant Search Input */}
           <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search candidates by name or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  padding: '14px 14px 14px 48px',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'var(--shadow-sm)'; }}
              />
           </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error" style={{ padding: '1.5rem', borderRadius: 16 }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* Loading Shimmer State */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card" style={{ height: 160, background: 'white', border: '1px solid #f1f5f9' }}>
              <div style={{
                background: 'linear-gradient(90deg, #f8fafc 25%, #f1f5f9 50%, #f8fafc 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.8s infinite linear',
                borderRadius: 12,
                height: '100%'
              }} />
            </div>
          ))}
          <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        </div>
      )}

      {/* Candidate Grid */}
      {!loading && !error && (
        <>
          {filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {filtered.map((c, i) => (
                <CandidateCard key={c.id} candidate={c} index={i} />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ background: 'white', borderRadius: 24, padding: '6rem 2rem', border: '1px solid var(--border)' }}>
              <div style={{ width: 80, height: 80, background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                <Users size={40} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{search ? 'No matches found' : 'Directory is empty'}</h3>
              <p style={{ maxWidth: 300, margin: '0.5rem auto 0' }}>{search ? `We couldn't find any candidates matching "${search}".` : 'Upload your first resume to populate the directory.'}</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
