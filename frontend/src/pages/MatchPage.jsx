import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Search, Sparkles, Trophy, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp, Briefcase } from 'lucide-react'

const API_BASE = '/api'

function ScoreRing({ score }) {
  const color = score >= 75 ? 'var(--accent-success)' : score >= 50 ? 'var(--accent-warning)' : 'var(--accent-danger)'
  return (
    <div style={{ position: 'relative', width: 68, height: 68, flexShrink: 0 }}>
      <svg width="68" height="68" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="30" fill="none" stroke="#f1f5f9" strokeWidth="8" />
        <motion.circle
          cx="36" cy="36" r="30" fill="none"
          stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 30}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - score / 100) }}
          transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '36px 36px' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)'
      }}>
        {score}
      </div>
    </div>
  )
}

function ResultCard({ result, rank, index }) {
  const [expanded, setExpanded] = useState(false)
  const isTop = rank <= 3

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{
        padding: '1.25rem',
        borderLeft: isTop ? '4px solid var(--accent-primary)' : '1px solid var(--border)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: isTop ? 'var(--accent-primary)' : '#f1f5f9',
          color: isTop ? 'white' : 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: '0.9rem', flexShrink: 0
        }}>
          {rank}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 2 }}>
            {result.filename}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} color="var(--accent-primary)" /> {result.explanation}
          </p>
        </div>

        <ScoreRing score={result.score} />

        <button
          onClick={() => setExpanded(!expanded)}
          className="btn btn-secondary btn-sm"
          style={{ padding: '8px', borderRadius: 8 }}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="divider" style={{ margin: '1.25rem 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  Match Strengths
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {result.matched_skills.map(s => (
                    <span key={s} className="badge" style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }}>{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  Gap Analysis
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {result.missing_skills.map(s => (
                    <span key={s} className="badge" style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: 12, border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                Scoring Breakdown
              </p>
              <div style={{ display: 'flex', gap: '2rem' }}>
                 <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{result.similarity_score}%</span>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Semantic</p>
                 </div>
                 <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>+{result.matched_skills.length * 5}%</span>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Skill Bonus</p>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const EXAMPLE_JD = `We are looking for a Senior Software Engineer (AI/ML focus):
- Proficiency in Python, React, and FastAPI
- Experience with Vector Databases (ChromaDB, Pinecone)
- Background in Cloud Architecture (AWS S3, Lambda)
- Strong understanding of NLP and Large Language Models`

export default function MatchPage() {
  const [jobDesc, setJobDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleMatch = async () => {
    if (!jobDesc.trim()) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const { data } = await axios.post(`${API_BASE}/match`, {
        job_description: jobDesc,
        n_results: 5
      })
      setResults(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Matching failed. Make sure the API is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="section-heading">
        <h1><span className="gradient-text">Match Candidates</span></h1>
        <p>Analyze and rank candidates based on job description semantics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: '2.5rem', alignItems: 'start' }}>

        {/* ── Left: Input ──────────────────────────────────── */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <div className="glass-card" style={{ marginBottom: '1.25rem', padding: '2rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Target Role Requirements</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '300px', fontSize: '0.95rem' }}
                placeholder="Paste the job description or requirements here..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ width: '100%', height: 50 }}
              onClick={handleMatch}
              disabled={!jobDesc.trim() || loading}
            >
              {loading
                ? <><div className="spinner" /> Analyzing...</>
                : <><Search size={18} /> Analyze Matches</>
              }
            </button>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', padding: '12px' }}
            onClick={() => setJobDesc(EXAMPLE_JD)}
          >
            <Briefcase size={14} /> Load Example Requirements
          </button>
        </div>

        {/* ── Right: Results ───────────────────────────────── */}
        <div>
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                className="glass-card"
                style={{ textAlign: 'center', padding: '6rem 2rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  style={{
                    width: 64, height: 64, margin: '0 auto 1.5rem',
                    background: '#eff6ff',
                    border: '1px solid #dbeafe',
                    borderRadius: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent-primary)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                >
                  <Sparkles size={32} />
                </motion.div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Ranking Candidates</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 8 }}>Cross-referencing resume vectors with job semantic space...</p>
              </motion.div>
            )}

            {!loading && results && results.results.length > 0 && (
              <motion.div key="results" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Trophy size={20} color="var(--accent-primary)" />
                      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Best Matched Talent
                      </h2>
                   </div>
                   <span className="badge" style={{ background: '#f8fafc', color: 'var(--text-muted)' }}>
                      {results.total_candidates_checked} profiles screened
                   </span>
                </div>
                {results.results.map((r, i) => (
                  <ResultCard key={r.id} result={r} rank={i + 1} index={i} />
                ))}
              </motion.div>
            )}

            {!loading && results && results.results.length === 0 && (
              <motion.div key="empty" className="empty-state" style={{ background: 'white', borderRadius: 20, border: '1px solid var(--border)' }}>
                <Search size={48} color="var(--text-muted)" />
                <h3>No candidates found</h3>
                <p>Try broadening your requirements or uploading more resumes.</p>
              </motion.div>
            )}

            {!loading && !results && (
              <motion.div key="idle" className="empty-state" style={{ background: 'white', borderRadius: 20, border: '1px solid var(--border)' }}>
                <div style={{ width: 80, height: 80, background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                   <Search size={32} color="var(--text-muted)" />
                </div>
                <h3>Start Matching</h3>
                <p>Paste your requirements on the left to see semantic matches.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
