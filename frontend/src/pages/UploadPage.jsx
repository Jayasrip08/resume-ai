import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Upload, FileText, CheckCircle, AlertCircle, X, Sparkles, Code } from 'lucide-react'

const API_BASE = '/api'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    if (f.type !== 'application/pdf') {
      setError('Only PDF files are accepted.')
      return
    }
    setFile(f)
    setError(null)
    setResult(null)
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }, [])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    const form = new FormData()
    form.append('file', file)

    try {
      const { data } = await axios.post(`${API_BASE}/upload_resume`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(data)
      setFile(null)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Make sure the API is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => { setFile(null); setResult(null); setError(null) }

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="section-heading">
        <h1><span className="gradient-text">Upload Resume</span></h1>
        <p>Drop a PDF resume to extract skills and store it in the system.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

        {/* ── Left: Drop Zone ─────────────────────────────── */}
        <div>
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key="upload" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
                {/* Drop Area */}
                <div
                   onDrop={onDrop}
                   onDragOver={onDragOver}
                   onDragLeave={onDragLeave}
                   onClick={() => inputRef.current.click()}
                   style={{
                     border: `2px dashed ${dragging ? 'var(--accent-primary)' : 'var(--border)'}`,
                     borderRadius: 'var(--radius-xl)',
                     padding: '4rem 2rem',
                     textAlign: 'center',
                     cursor: 'pointer',
                     background: dragging ? 'rgba(79, 70, 229, 0.04)' : 'var(--bg-secondary)',
                     transition: 'all 0.2s ease',
                     boxShadow: dragging ? 'var(--shadow-lg)' : 'var(--shadow-sm)'
                   }}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFile(e.target.files[0])}
                  />

                  {file ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: 64, height: 64,
                        background: '#eff6ff',
                        border: '1px solid #dbeafe',
                        borderRadius: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--accent-primary)'
                      }}>
                        <FileText size={32} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 4 }}>{file.name}</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                           Ready for analysis · {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null) }}
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: 8 }}
                      >
                        <X size={14} /> Change File
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <div
                        style={{
                          width: 72, height: 72,
                          background: 'white',
                          border: '1px solid var(--border)',
                          borderRadius: 20,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: 'var(--shadow-md)',
                          color: 'var(--accent-primary)'
                        }}
                      >
                        <Upload size={32} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 6 }}>Click or drag resume to upload</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          Support for high-quality PDF extraction
                        </p>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '4px 12px', borderRadius: 100 }}>
                        PDF Only · Max 10MB
                      </div>
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    className="alert alert-error"
                    style={{ marginTop: '1.25rem' }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  >
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Upload button */}
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '1.5rem', height: 56 }}
                  onClick={handleUpload}
                  disabled={!file || loading}
                >
                  {loading ? (
                    <><div className="spinner" /> Analyzing Document...</>
                  ) : (
                    <><Sparkles size={18} /> Process Resume</>
                  )}
                </button>
              </motion.div>
            ) : (
              /* ── Success Result ───────────────────────────── */
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{ padding: '2.5rem' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{
                    width: 64, height: 64, margin: '0 auto 1.25rem',
                    background: '#ecfdf5',
                    border: '1px solid #d1fae5',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#10b981'
                  }}>
                    <CheckCircle size={32} />
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Processed Successfully</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 4 }}>{result.file}</p>
                </div>

                <div className="divider" />

                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                    Identified Skills ({result.skills.length})
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {result.skills.map(s => (
                      <span key={s} className="badge" style={{ background: '#f1f5f9', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '6px 12px' }}>{s}</span>
                    ))}
                  </div>
                </div>

                <div className="divider" />

                <button className="btn btn-secondary" style={{ width: '100%', padding: '14px' }} onClick={handleReset}>
                  Upload New Candidate
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right: Info Panel ────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[
            { icon: FileText, title: 'Intelligent Parsing', desc: 'Securely extracts text and structural data from PDF resumes using OCR-enhanced engines.' },
            { icon: Code, title: 'Skill Identification', desc: 'Automatically maps candidate experience against our proprietary database of 60+ core tech skills.' },
            { icon: Sparkles, title: 'Vectorization', desc: 'Converts documents into high-dimensional vectors for lightning-fast semantic search capabilities.' },
          ].map((item) => (
            <motion.div
              key={item.title}
              className="glass-card"
              style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}
              whileHover={{ x: 4, borderColor: 'var(--accent-primary)' }}
            >
              <div style={{
                width: 44, height: 44, flexShrink: 0,
                background: '#f8fafc',
                border: '1px solid var(--border)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent-primary)'
              }}>
                <item.icon size={20} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 2 }}>{item.title}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
