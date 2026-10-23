import React, { useState } from 'react'
import {
  FileSearch,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
} from 'lucide-react'
import { analyzeJobDescription } from '../api/client'

const SAMPLE_JDS = [
  {
    title: 'Full Stack Engineer (React & Node.js)',
    desc: `We are looking for a Full Stack Engineer to join our high-growth fintech team.
Requirements:
- 3+ years experience with React, TypeScript, and modern state management.
- Strong backend foundation in Node.js, Express, REST APIs, and GraphQL.
- Hands-on experience with PostgreSQL database design and query optimization.
- Proficiency with Docker containerization and CI/CD pipelines.
- Nice to have: Experience with AWS (ECS, S3), Redis caching, and automated testing (Jest/Cypress).`,
    sampleSkills: ['React', 'JavaScript', 'HTML/CSS', 'Git', 'SQL'],
  },
  {
    title: 'Machine Learning & AI Engineer',
    desc: `Seeking an ambitious ML Engineer to build production AI features.
Requirements:
- Strong programming background in Python and deep learning frameworks (PyTorch or TensorFlow).
- Experience with Scikit-learn, Pandas, NumPy, and statistical modeling.
- Hands-on expertise building and deploying ML models to production with FastAPI and Docker.
- Experience with MLOps, model monitoring, and feature engineering.
- Nice to have: NLP, LLM fine-tuning, vector databases, and Kubernetes orchestration.`,
    sampleSkills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Machine Learning', 'Git'],
  },
]

export default function JobDescriptionAnalyzer() {
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [currentSkillsInput, setCurrentSkillsInput] = useState('')
  const [currentSkills, setCurrentSkills] = useState(['Python', 'SQL', 'Git'])
  const [experienceLevel, setExperienceLevel] = useState('Intermediate')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [copiedTip, setCopiedTip] = useState(null)

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const val = currentSkillsInput.trim().replace(/^,+|,+$/g, '')
      if (val && !currentSkills.includes(val)) {
        setCurrentSkills([...currentSkills, val])
        setCurrentSkillsInput('')
      }
    }
  }

  const removeSkill = (skill) => {
    setCurrentSkills(currentSkills.filter((s) => s !== skill))
  }

  const loadSample = (sample) => {
    setJobTitle(sample.title)
    setJobDesc(sample.desc)
    setCurrentSkills(sample.sampleSkills)
    setError(null)
  }

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!jobDesc.trim() || jobDesc.trim().length < 30) {
      setError('Please provide at least 30 characters of the job description text.')
      return
    }

    setError(null)
    setLoading(true)
    setResult(null)

    try {
      const res = await analyzeJobDescription({
        job_title: jobTitle || 'Software Engineer',
        job_description: jobDesc,
        current_skills: currentSkills,
        experience_level: experienceLevel,
      })
      setResult(res.data)
    } catch (err) {
      console.error('JD analysis error:', err)
      setError(err?.response?.data?.detail || 'Failed to analyze job description. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyTipToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedTip(idx)
    setTimeout(() => setCopiedTip(null), 2000)
  }

  const getMatchColor = (pct) => {
    if (pct >= 70) return '#34d399' // green
    if (pct >= 40) return '#fbbf24' // amber
    return '#f87171' // red
  }

  const getMatchTier = (pct) => {
    if (pct >= 75) return { label: 'High Match — Strong Fit', bg: 'rgba(52, 211, 153, 0.15)', border: '#34d399' }
    if (pct >= 45) return { label: 'Moderate Fit — Closeable Gap', bg: 'rgba(251, 191, 36, 0.15)', border: '#fbbf24' }
    return { label: 'Growth Fit — Key Skills Required', bg: 'rgba(248, 113, 113, 0.15)', border: '#f87171' }
  }

  return (
    <div style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 1rem',
            borderRadius: 999,
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          <Sparkles size={16} /> Job Posting Matcher & Bridge Generator
        </div>
        <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
          Custom Job Description Analyzer
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: 650, margin: '0 auto' }}>
          Paste any job posting from LinkedIn, Indeed, or AngelList to benchmark your current skills,
          identify gaps, and get an immediate fast-track roadmap.
        </p>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '2rem' }}>
        {/* Input Form Card */}
        <div className="glass-card animate-fadeIn">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileSearch size={22} color="#818cf8" /> Job Details & Your Skills
            </h3>

            {/* Quick Sample Selector */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => loadSample(SAMPLE_JDS[0])}
                style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                Sample Full Stack
              </button>
              <button
                type="button"
                onClick={() => loadSample(SAMPLE_JDS[1])}
                style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                Sample ML
              </button>
            </div>
          </div>

          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Job Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Backend Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Experience</label>
                <select
                  className="form-select"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Job Description Text *</label>
              <textarea
                rows={7}
                className="form-input"
                style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '0.86rem', lineHeight: 1.5 }}
                placeholder="Paste the responsibilities, requirements, and tech stack from the job posting..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                required
              />
            </div>

            {/* Current Skills Selector */}
            <div>
              <label className="form-label" style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Your Current Skills ({currentSkills.length})</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Type & press Enter</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Add skill (e.g. Docker, React, AWS)..."
                value={currentSkillsInput}
                onChange={(e) => setCurrentSkillsInput(e.target.value)}
                onKeyDown={handleAddSkill}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
                {currentSkills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'rgba(99, 102, 241, 0.2)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      color: '#c7d2fe',
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: '0.8rem',
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#a5b4fc',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '0.9rem',
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {error && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: 8,
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  fontSize: '0.85rem',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !jobDesc.trim()}
              className="btn btn-primary"
              style={{
                padding: '0.75rem 1.25rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  Analyzing Fit & Building Plan...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Benchmark Fit & Generate Fast-Track Plan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Card */}
        {result && (
          <div className="glass-card animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top Score Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem',
                borderRadius: 12,
                background: 'rgba(15, 23, 42, 0.7)',
                border: `1px solid ${getMatchTier(result.match_percentage).border}`,
              }}
            >
              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Target Role Match Fit
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                  {result.job_title}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: '0.4rem',
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: getMatchTier(result.match_percentage).bg,
                    color: getMatchTier(result.match_percentage).border,
                  }}
                >
                  {getMatchTier(result.match_percentage).label}
                </div>
              </div>

              {/* Match Dial */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: getMatchColor(result.match_percentage),
                    lineHeight: 1,
                  }}
                >
                  {result.match_percentage}%
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>Candidate Match</div>
              </div>
            </div>

            {/* Skills Comparison */}
            <div>
              <h4 style={{ color: '#f8fafc', margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}>
                Competency Breakdown
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Matching Skills */}
                <div
                  style={{
                    padding: '0.85rem',
                    borderRadius: 10,
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <CheckCircle2 size={16} /> Matched Skills ({result.matching_skills?.length || 0})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {(result.matching_skills || []).map((s) => (
                      <span
                        key={s}
                        style={{
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#6ee7b7',
                          fontSize: '0.75rem',
                          padding: '2px 7px',
                          borderRadius: 4,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                    {(!result.matching_skills || result.matching_skills.length === 0) && (
                      <span style={{ color: '#64748b', fontSize: '0.78rem' }}>None matched</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div
                  style={{
                    padding: '0.85rem',
                    borderRadius: 10,
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <AlertTriangle size={16} /> Skills to Bridge ({result.missing_skills?.length || 0})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {(result.missing_skills || []).map((s) => (
                      <span
                        key={s}
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#fca5a5',
                          fontSize: '0.75rem',
                          padding: '2px 7px',
                          borderRadius: 4,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Fast-Track Bridge Roadmap */}
            {result.bridge_roadmap && (
              <div>
                <h4 style={{ color: '#f8fafc', margin: '0 0 0.75rem 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <TrendingUp size={16} color="#818cf8" /> Fast-Track Bridge Roadmap
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {Object.entries(result.bridge_roadmap).map(([phase, skills], pIdx) => (
                    <div
                      key={phase}
                      style={{
                        padding: '0.85rem',
                        borderRadius: 10,
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#c7d2fe', marginBottom: '0.4rem' }}>
                        {phase}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {(skills || []).map((item, sIdx) => (
                          <div
                            key={sIdx}
                            style={{
                              padding: '0.3rem 0.6rem',
                              borderRadius: 6,
                              background: 'rgba(99, 102, 241, 0.15)',
                              border: '1px solid rgba(99, 102, 241, 0.3)',
                              fontSize: '0.78rem',
                              color: '#e2e8f0',
                            }}
                          >
                            <span style={{ fontWeight: 600, color: '#a5b4fc' }}>{item.skill}</span>
                            {item.focus && <span style={{ color: '#94a3b8', marginLeft: '0.35rem' }}>— {item.focus}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resume Optimization Tips */}
            {result.resume_tips && (
              <div>
                <h4 style={{ color: '#f8fafc', margin: '0 0 0.75rem 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BookOpen size={16} color="#34d399" /> Resume & Interview Keyword Tips
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.resume_tips.map((tip, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 8,
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        fontSize: '0.82rem',
                        color: '#cbd5e1',
                      }}
                    >
                      <span>{tip}</span>
                      <button
                        type="button"
                        onClick={() => copyTipToClipboard(tip, idx)}
                        title="Copy to clipboard"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedTip === idx ? '#34d399' : '#64748b',
                          cursor: 'pointer',
                          padding: '0 0 0 0.5rem',
                        }}
                      >
                        {copiedTip === idx ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
