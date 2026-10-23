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
import { useAuth } from '../context/AuthContext'
import { recordActivity } from '../utils/history'

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
  const { user } = useAuth()
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
      const titleUsed = jobTitle || 'Target Tech Role'
      const res = await analyzeJobDescription({
        job_title: titleUsed,
        job_description: jobDesc,
        current_skills: currentSkills,
        experience_level: experienceLevel,
      })
      setResult(res.data)

      const fitPct = Math.round(res.data?.fit_score || 0)
      recordActivity(user?.id || 'guest', {
        type: 'jd',
        title: `${titleUsed} Posting Match`,
        subtitle: `${company ? company + ' · ' : ''}Fit Score: ${fitPct}%`,
        score: `${fitPct}% Fit`,
        details: `Missing: ${res.data?.missing_skills?.slice(0, 4).join(', ') || 'None identified'}`,
        link: '/job-analyzer',
      })
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
    if (pct >= 70) return '#c6fd50' // electric lime
    if (pct >= 40) return '#f59e0b' // amber
    return '#ef4444' // red
  }

  const getMatchTier = (pct) => {
    if (pct >= 75) return { label: 'High Match — Strong Fit', bg: '#f1fccf', border: '#16a34a', text: '#14532d' }
    if (pct >= 45) return { label: 'Moderate Fit — Closeable Gap', bg: '#fef3c7', border: '#d97706', text: '#78350f' }
    return { label: 'Growth Fit — Key Skills Required', bg: '#fee2e2', border: '#dc2626', text: '#991b1b' }
  }

  return (
    <div style={{ maxWidth: 1240, margin: '2rem auto', padding: '0 1.5rem 4rem 1.5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <span className="pill-badge" style={{ background: '#f3f2ea', border: '1.5px solid #131311', color: '#131311', fontWeight: 800 }}>
            <Sparkles size={14} color="#131311" /> JOB POSTING MATCHER & BRIDGE GENERATOR
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.85rem)', fontWeight: 900, color: '#131311', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
          Custom Job Description Analyzer
        </h1>
        <p style={{ color: '#52524e', fontSize: '1.05rem', maxWidth: 680, margin: '0 auto', lineHeight: 1.5 }}>
          Paste any job posting from LinkedIn, Indeed, or Wellfound to benchmark your current skills,
          identify critical requirements, and get an immediate fast-track roadmap.
        </p>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Input Form Card */}
        <div
          className="animate-fadeIn"
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '2px solid #131311',
            boxShadow: '6px 6px 0px #131311',
            padding: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 style={{ margin: 0, color: '#131311', fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileSearch size={22} color="#131311" /> Job Details & Your Skills
            </h3>

            {/* Quick Sample Selector */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => loadSample(SAMPLE_JDS[0])}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: '#f3f2ea',
                  border: '1.5px solid #131311',
                  color: '#131311',
                  cursor: 'pointer',
                  boxShadow: '1.5px 1.5px 0px #131311',
                  transition: 'all 0.15s ease',
                }}
              >
                Sample Full Stack
              </button>
              <button
                type="button"
                onClick={() => loadSample(SAMPLE_JDS[1])}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: '#f3f2ea',
                  border: '1.5px solid #131311',
                  color: '#131311',
                  cursor: 'pointer',
                  boxShadow: '1.5px 1.5px 0px #131311',
                  transition: 'all 0.15s ease',
                }}
              >
                Sample ML
              </button>
            </div>
          </div>

          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#131311', marginBottom: '0.35rem' }}>
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. SDE Intern or Backend Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '8px',
                    border: '1.5px solid #131311',
                    background: '#ffffff',
                    color: '#131311',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#131311', marginBottom: '0.35rem' }}>
                  Experience
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '8px',
                    border: '1.5px solid #131311',
                    background: '#ffffff',
                    color: '#131311',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#131311', marginBottom: '0.35rem' }}>
                Job Description Text *
              </label>
              <textarea
                rows={7}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #131311',
                  background: '#ffffff',
                  color: '#131311',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  fontWeight: 500,
                  outline: 'none',
                  resize: 'vertical',
                }}
                placeholder="Paste the responsibilities, requirements, and tech stack from the job posting..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                required
              />
            </div>

            {/* Current Skills Selector */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 800, color: '#131311', marginBottom: '0.35rem' }}>
                <span>Your Current Skills ({currentSkills.length})</span>
                <span style={{ color: '#52524e', fontSize: '0.78rem', fontWeight: 600 }}>Type & press Enter</span>
              </label>
              <input
                type="text"
                placeholder="Add skill (e.g. Docker, React, AWS)..."
                value={currentSkillsInput}
                onChange={(e) => setCurrentSkillsInput(e.target.value)}
                onKeyDown={handleAddSkill}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #131311',
                  background: '#ffffff',
                  color: '#131311',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.75rem' }}>
                {currentSkills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'var(--accent-lime-subtle, #f1fccf)',
                      border: '1.5px solid #131311',
                      color: '#131311',
                      padding: '3px 10px',
                      borderRadius: 6,
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      boxShadow: '1px 1px 0px #131311',
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#131311',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '1rem',
                        fontWeight: 900,
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
                  padding: '0.75rem 1rem',
                  borderRadius: 8,
                  background: '#ffece8',
                  border: '1.5px solid #ff7660',
                  color: '#991b1b',
                  fontSize: '0.86rem',
                  fontWeight: 700,
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
                padding: '0.85rem 1.25rem',
                fontSize: '1rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      border: '3px solid #131311',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  <span>Analyzing Fit & Building Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Benchmark Fit & Generate Fast-Track Plan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Card */}
        {result && (
          <div
            className="animate-fadeIn"
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '2px solid #131311',
              boxShadow: '6px 6px 0px #131311',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {/* Top Score Banner (High Contrast Dark Box) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.35rem 1.5rem',
                borderRadius: 12,
                background: '#131311',
                border: '2px solid #131311',
                boxShadow: '3px 3px 0px #131311',
              }}
            >
              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>
                  Target Role Match Fit
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', marginTop: '0.25rem' }}>
                  {result.job_title}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: '0.5rem',
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    background: getMatchTier(result.match_percentage).bg,
                    border: `1.5px solid ${getMatchTier(result.match_percentage).border}`,
                    color: getMatchTier(result.match_percentage).text,
                  }}
                >
                  {getMatchTier(result.match_percentage).label}
                </div>
              </div>

              {/* Match Dial */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '2.8rem',
                    fontWeight: 900,
                    color: getMatchColor(result.match_percentage),
                    lineHeight: 1,
                  }}
                >
                  {result.match_percentage}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700, marginTop: '0.35rem' }}>
                  Candidate Match
                </div>
              </div>
            </div>

            {/* Skills Comparison */}
            <div>
              <h4 style={{ color: '#131311', margin: '0 0 0.85rem 0', fontSize: '1.05rem', fontWeight: 900 }}>
                Competency Breakdown
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Matching Skills */}
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: 10,
                    background: '#f0fdf4',
                    border: '1.5px solid #16a34a',
                    boxShadow: '2px 2px 0px #16a34a',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#15803d', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.65rem' }}>
                    <CheckCircle2 size={18} color="#15803d" />
                    <span>Matched Skills ({result.matching_skills?.length || 0})</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {(result.matching_skills || []).map((s) => (
                      <span
                        key={s}
                        style={{
                          background: '#dcfce7',
                          border: '1px solid #16a34a',
                          color: '#14532d',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: 6,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                    {(!result.matching_skills || result.matching_skills.length === 0) && (
                      <span style={{ color: '#52524e', fontSize: '0.8rem', fontWeight: 600 }}>None matched</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: 10,
                    background: '#fef2f2',
                    border: '1.5px solid #dc2626',
                    boxShadow: '2px 2px 0px #dc2626',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#b91c1c', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.65rem' }}>
                    <AlertTriangle size={18} color="#b91c1c" />
                    <span>Skills to Bridge ({result.missing_skills?.length || 0})</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {(result.missing_skills || []).map((s) => (
                      <span
                        key={s}
                        style={{
                          background: '#fee2e2',
                          border: '1px solid #dc2626',
                          color: '#991b1b',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: 6,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                    {(!result.missing_skills || result.missing_skills.length === 0) && (
                      <span style={{ color: '#52524e', fontSize: '0.8rem', fontWeight: 600 }}>All skills present!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Fast-Track Bridge Roadmap */}
            {result.bridge_roadmap && (
              <div>
                <h4 style={{ color: '#131311', margin: '0 0 0.85rem 0', fontSize: '1.05rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} color="#131311" /> Fast-Track Bridge Roadmap
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {Object.entries(result.bridge_roadmap).map(([phase, skills], pIdx) => (
                    <div
                      key={phase}
                      style={{
                        padding: '1rem',
                        borderRadius: 10,
                        background: '#f8fafc',
                        border: '1.5px solid #131311',
                        boxShadow: '2px 2px 0px #131311',
                      }}
                    >
                      <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#131311', marginBottom: '0.55rem' }}>
                        {phase}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                        {(skills || []).map((item, sIdx) => (
                          <div
                            key={sIdx}
                            style={{
                              padding: '0.4rem 0.75rem',
                              borderRadius: 6,
                              background: 'var(--accent-lime-subtle, #f1fccf)',
                              border: '1.5px solid #131311',
                              fontSize: '0.82rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              boxShadow: '1px 1px 0px #131311',
                            }}
                          >
                            <span style={{ fontWeight: 800, color: '#131311' }}>{item.skill}</span>
                            {item.focus && <span style={{ color: '#52524e', fontWeight: 600 }}>— {item.focus}</span>}
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
                <h4 style={{ color: '#131311', margin: '0 0 0.85rem 0', fontSize: '1.05rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={18} color="#131311" /> Resume & Interview Keyword Tips
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {result.resume_tips.map((tip, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: 8,
                        background: '#f8f7f2',
                        border: '1.5px solid #131311',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: '#131311',
                        lineHeight: 1.45,
                        boxShadow: '2px 2px 0px #131311',
                      }}
                    >
                      <span>{tip}</span>
                      <button
                        type="button"
                        onClick={() => copyTipToClipboard(tip, idx)}
                        title="Copy to clipboard"
                        style={{
                          background: '#ffffff',
                          border: '1px solid #131311',
                          borderRadius: 6,
                          padding: '4px 8px',
                          color: copiedTip === idx ? '#16a34a' : '#131311',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          marginLeft: '0.75rem',
                          flexShrink: 0,
                          boxShadow: '1px 1px 0px #131311',
                        }}
                      >
                        {copiedTip === idx ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
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
