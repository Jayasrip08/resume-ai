import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, Search, Users, Zap, Shield, TrendingUp, ArrowRight, Brain } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
}

const features = [
  {
    icon: Upload,
    color: '#7c3aed',
    shadow: 'rgba(124,58,237,0.3)',
    title: 'Smart PDF Upload',
    desc: 'Drag and drop PDFs. Our OCR extracts full text and automatically identifies skills in seconds.'
  },
  {
    icon: Brain,
    color: '#06b6d4',
    shadow: 'rgba(6,182,212,0.3)',
    title: 'AI-Powered Matching',
    desc: 'ChromaDB vector search + skill overlap scoring ranks candidates by true semantic relevance.'
  },
  {
    icon: TrendingUp,
    color: '#a855f7',
    shadow: 'rgba(168,85,247,0.3)',
    title: 'Scored Results',
    desc: 'Every match comes with a composite score, matched skills, and missing skill gaps.'
  },
  {
    icon: Shield,
    color: '#10b981',
    shadow: 'rgba(16,185,129,0.3)',
    title: 'Cloud Storage',
    desc: 'Resumes are stored on AWS S3 while metadata stays in PostgreSQL for fast queries.'
  },
  {
    icon: Search,
    color: '#f59e0b',
    shadow: 'rgba(245,158,11,0.3)',
    title: '60+ Skills Detected',
    desc: 'Covers Python, ML, cloud, DevOps, databases, web frameworks, and more out of the box.'
  },
  {
    icon: Users,
    color: '#ec4899',
    shadow: 'rgba(236,72,153,0.3)',
    title: 'Candidate Dashboard',
    desc: 'Browse, search and review every candidate ever uploaded — all in one organized view.'
  }
]

const stats = [
  { value: '60+', label: 'Skills Detected' },
  { value: 'AI', label: 'Powered Matching' },
  { value: 'S3', label: 'Cloud Storage' },
  { value: '∞', label: 'Resumes Supported' }
]

export default function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem 5rem', textAlign: 'center', maxWidth: 1000, margin: '0 auto' }}>
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <span className="badge" style={{ background: '#eff6ff', color: 'var(--accent-primary)', border: '1px solid #dbeafe', marginBottom: '1.5rem', padding: '6px 14px' }}>
            <Zap size={14} fill="currentColor" /> AI-Powered Recruiting
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '1.5rem' }}
        >
          Screen Candidates with <br />
          <span className="gradient-text">Unmatched Precision</span>
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: 700, margin: '0 auto 3rem', lineHeight: 1.6 }}
        >
          Transform your hiring process. Upload resumes, define job requirements, and let our AI rank candidates by semantic relevance and skill compatibility.
        </motion.p>

        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link to="/upload" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-md)' }}>
            <Upload size={18} /> Get Started Free
          </Link>
          <Link to="/match" className="btn btn-secondary btn-lg" style={{ borderRadius: 'var(--radius-md)' }}>
            Explore Matching
          </Link>
        </motion.div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto 6rem', padding: '0 1.5rem' }}>
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="section-heading"
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Powerful features for <span style={{ color: 'var(--accent-primary)' }}>human-centric</span> hiring
          </h2>
          <p style={{ maxWidth: 600, margin: '0.75rem auto 0' }}>Leverage state-of-the-art AI to find the best talent faster, without the manual screening fatigue.</p>
        </motion.div>

        <div className="grid-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass-card"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={6 + i}
              style={{ padding: '2.5rem 2rem' }}
            >
              <div
                style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.5rem',
                  color: 'var(--accent-primary)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <f.icon size={24} />
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────── */}
      <motion.section
        variants={fadeUp} initial="hidden" animate="visible" custom={13}
        style={{ maxWidth: 1000, margin: '0 auto 8rem', padding: '0 1.5rem' }}
      >
        <div
          className="glass-card"
          style={{
            textAlign: 'center', padding: '4rem 2rem',
            background: 'var(--gradient-primary)',
            border: 'none',
            color: 'white'
          }}
        >
          <h2 style={{ fontWeight: 800, fontSize: '2.25rem', marginBottom: '1rem', color: 'white' }}>
            Ready to optimize your pipeline?
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '2.5rem', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto 2.5rem' }}>
            Join forward-thinking teams using ResumeAI to find their next star hire.
          </p>
          <Link to="/upload" className="btn" style={{ background: 'white', color: 'var(--accent-primary)', padding: '16px 40px', fontSize: '1.1rem', fontWeight: 700 }}>
            Start Screening Now <ArrowRight size={20} style={{ marginLeft: 8 }} />
          </Link>
        </div>
      </motion.section>
    </motion.div>
  )
}
