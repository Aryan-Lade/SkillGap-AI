import React, { useState, useEffect } from 'react'
import {
  Play,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Code2,
  Terminal,
  Database,
  Sparkles,
  Award,
  Clock,
  Layers,
} from 'lucide-react'
import { getSandboxChallenges, runSandboxCode } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { recordActivity } from '../utils/history'

const DEFAULT_PYTHON = `def calculate_skill_readiness(completed, total):
    if total == 0:
        return 0.0
    return round((completed / total) * 100, 1)

skills = ["Python", "Docker", "SQL", "FastAPI"]
learned = ["Python", "SQL"]

readiness = calculate_skill_readiness(len(learned), len(skills))
print(f"Candidate Readiness: {readiness}%")
`

export default function CodeSandbox() {
  const { user } = useAuth()
  const [challenges, setChallenges] = useState([])
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState(DEFAULT_PYTHON)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getSandboxChallenges()
      .then((res) => {
        const list = res.data.challenges || []
        setChallenges(list)
        if (list.length > 0) {
          selectChallenge(list[0])
        }
      })
      .catch((err) => console.error('Failed to load challenges', err))
  }, [])

  const selectChallenge = (ch) => {
    setSelectedChallenge(ch)
    setLanguage(ch.language)
    setCode(ch.starter_code)
    setResult(null)
    setError(null)
  }

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    const matchingCh = challenges.find((c) => c.language === lang)
    if (matchingCh) {
      selectChallenge(matchingCh)
    } else {
      setSelectedChallenge(null)
      if (lang === 'python') setCode(DEFAULT_PYTHON)
      else if (lang === 'javascript') setCode(`console.log('Hello from JavaScript!');\n`)
      else if (lang === 'sql') setCode(`SELECT * FROM employees LIMIT 5;\n`)
    }
  }

  const handleRun = async (withTests = false) => {
    setRunning(true)
    setError(null)
    try {
      const res = await runSandboxCode({
        language,
        code,
        test_code: withTests && selectedChallenge?.test_code ? selectedChallenge.test_code : null,
      })
      setResult(res.data)

      const isPass = res.data?.tests_passed ?? (res.data?.success ?? true)
      recordActivity(user?.id || 'guest', {
        type: 'sandbox',
        title: `${language.toUpperCase()} Code Run: ${selectedChallenge?.title || 'Interactive Code'}`,
        subtitle: `Execution Time: ${res.data?.execution_time_ms || 12}ms`,
        score: isPass ? 'Passed ✓' : 'Completed',
        details: withTests ? `Tests Passed: ${res.data?.tests_passed ? 'All Passed' : 'Failed'}` : 'Code executed in container',
        link: '/sandbox',
      })
    } catch (err) {
      console.error('Execution error', err)
      setError(err?.response?.data?.detail || 'Execution failed.')
    } finally {
      setRunning(false)
    }
  }

  const handleReset = () => {
    if (selectedChallenge) {
      setCode(selectedChallenge.starter_code)
    } else if (language === 'python') {
      setCode(DEFAULT_PYTHON)
    }
    setResult(null)
  }

  return (
    <div style={{ maxWidth: 1240, margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="pill-badge pill-badge-lime" style={{ marginBottom: '1rem' }}>
          <Code2 size={15} /> IN-BROWSER EXECUTION ENGINE
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#131311', letterSpacing: '-0.03em', margin: '0 0 0.75rem 0' }}>
          Interactive Coding Sandbox & Challenges
        </h1>
        <p style={{ color: '#52524e', fontSize: '1.05rem', maxWidth: 680, margin: '0 auto', lineHeight: 1.5 }}>
          Practice hands-on coding challenges for your missing roadmap skills in real time.
          Run Python, JavaScript, and SQL directly in your browser with automated test validation.
        </p>

        {/* Language Tabs */}
        <div style={{ display: 'inline-flex', gap: '0.4rem', marginTop: '1.5rem', padding: '5px', borderRadius: '12px', background: '#ffffff', border: '1.5px solid #131311', boxShadow: '2px 2px 0px #131311' }}>
          {[
            { id: 'python', label: '🐍 Python' },
            { id: 'javascript', label: '⚡ JavaScript' },
            { id: 'sql', label: '🗄️ SQL Database' },
          ].map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => handleLanguageChange(l.id)}
              style={{
                padding: '0.45rem 1.25rem',
                borderRadius: '8px',
                border: language === l.id ? '1.5px solid #131311' : '1.5px solid transparent',
                background: language === l.id ? 'var(--accent-lime)' : 'transparent',
                color: '#131311',
                fontWeight: 800,
                fontSize: '0.86rem',
                cursor: 'pointer',
                boxShadow: language === l.id ? '1.5px 1.5px 0px #131311' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Challenge Info + Code Editor / Console */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Challenges List & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Challenge Selector */}
          <div className="neo-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#131311', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Layers size={18} /> Available Challenges ({language.toUpperCase()})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {challenges
                .filter((c) => c.language === language)
                .map((ch) => {
                  const isSelected = selectedChallenge?.id === ch.id
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => selectChallenge(ch)}
                      style={{
                        textAlign: 'left',
                        padding: '0.75rem 0.95rem',
                        borderRadius: '8px',
                        border: '1.5px solid #131311',
                        background: isSelected ? 'var(--accent-lime)' : '#ffffff',
                        color: '#131311',
                        cursor: 'pointer',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: isSelected ? '2px 2px 0px #131311' : '1px 1px 0px #131311',
                        transition: 'all 0.12s ease',
                      }}
                    >
                      <span>{ch.title}</span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '2px 7px',
                          borderRadius: '999px',
                          border: '1px solid #131311',
                          background:
                            ch.difficulty === 'Easy'
                              ? '#d1fae5'
                              : '#fef3c7',
                          color: '#131311',
                        }}
                      >
                        {ch.difficulty}
                      </span>
                    </button>
                  )
                })}
            </div>
          </div>

          {/* Active Challenge Description */}
          {selectedChallenge && (
            <div className="neo-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#131311',
                    background: 'var(--accent-lime-subtle)',
                    border: '1px solid #131311',
                    padding: '2px 8px',
                    borderRadius: '999px',
                  }}
                >
                  Skill: {selectedChallenge.skill}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    border: '1px solid #131311',
                    background: '#131311',
                    color: '#ffffff',
                  }}
                >
                  {selectedChallenge.difficulty}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#131311', margin: '0 0 0.65rem 0' }}>
                {selectedChallenge.title}
              </h3>
              <p style={{ color: '#52524e', fontSize: '0.88rem', lineHeight: 1.55, margin: 0 }}>
                {selectedChallenge.description}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Code Editor & Execution Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Editor Container with Neo-Brutalist Frame */}
          <div
            style={{
              border: '2px solid #131311',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '4px 4px 0px #131311',
              background: '#131311',
            }}
          >
            {/* Editor Header Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1.15rem',
                background: '#1a1b18',
                borderBottom: '1.5px solid #2d2e2a',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f56', border: '1px solid #e0443e' }} />
                  <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e', border: '1px solid #dea123' }} />
                  <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#27c93f', border: '1px solid #1aab29' }} />
                </div>
                <span style={{ fontSize: '0.82rem', color: '#c6fd50', fontFamily: 'monospace', fontWeight: 700 }}>
                  solution.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'sql'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset code"
                  style={{
                    background: '#232420',
                    border: '1px solid #3d3e3a',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    color: '#e5e5e5',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <RotateCcw size={13} /> Reset
                </button>

                <button
                  type="button"
                  onClick={() => handleRun(false)}
                  disabled={running}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #131311',
                    borderRadius: '6px',
                    padding: '5px 14px',
                    color: '#131311',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: running ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '2px 2px 0px #131311',
                  }}
                >
                  <Play size={13} fill="#131311" /> Run Code
                </button>

                {selectedChallenge?.test_code && (
                  <button
                    type="button"
                    onClick={() => handleRun(true)}
                    disabled={running}
                    style={{
                      background: 'var(--accent-lime)',
                      border: '1.5px solid #131311',
                      borderRadius: '6px',
                      padding: '5px 14px',
                      color: '#131311',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: running ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '2px 2px 0px #131311',
                    }}
                  >
                    <Award size={14} /> Validate Tests
                  </button>
                )}
              </div>
            </div>

            {/* Textarea Code Editor */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={14}
              spellCheck="false"
              style={{
                width: '100%',
                background: '#131311',
                border: 'none',
                color: '#f8fafc',
                padding: '1.15rem',
                fontSize: '0.94rem',
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                lineHeight: 1.65,
                boxSizing: 'border-box',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Output Terminal Card */}
          <div
            style={{
              borderRadius: '12px',
              background: '#ffffff',
              border: '2px solid #131311',
              boxShadow: '4px 4px 0px #131311',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1.5px solid #131311' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#131311', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Terminal size={16} /> Output Console
              </div>

              {result && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#52524e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={12} /> {result.duration_ms}ms
                  </span>
                  {result.tests_passed ? (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        padding: '2px 9px',
                        borderRadius: '999px',
                        border: '1.5px solid #131311',
                        background: 'var(--accent-lime)',
                        color: '#131311',
                        boxShadow: '1.5px 1.5px 0px #131311',
                      }}
                    >
                      Passed ✅
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        padding: '2px 9px',
                        borderRadius: '999px',
                        border: '1.5px solid #131311',
                        background: '#ffece8',
                        color: '#d00',
                        boxShadow: '1.5px 1.5px 0px #131311',
                      }}
                    >
                      Error ❌
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  color: '#991b1b',
                  fontFamily: 'monospace',
                  fontSize: '0.88rem',
                  padding: '0.75rem',
                  background: '#fef2f2',
                  border: '1.5px solid #ef4444',
                  borderRadius: '8px',
                  marginBottom: '0.75rem',
                }}
              >
                {error}
              </div>
            )}

            {/* SQL Table Output */}
            {result?.columns && result.columns.length > 0 && (
              <div style={{ overflowX: 'auto', marginBottom: '0.75rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', fontFamily: 'monospace', border: '1.5px solid #131311' }}>
                  <thead>
                    <tr style={{ background: '#131311', color: '#ffffff' }}>
                      {result.columns.map((c) => (
                        <th key={c} style={{ textAlign: 'left', padding: '7px 12px', borderRight: '1px solid #333' }}>
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, rIdx) => (
                      <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? '#ffffff' : '#f8f7f2', borderBottom: '1px solid #e5e5e5' }}>
                        {result.columns.map((col) => (
                          <td key={col} style={{ padding: '7px 12px', borderRight: '1px solid #e5e5e5', color: '#131311' }}>
                            {row[col] !== undefined ? String(row[col]) : 'NULL'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Terminal Stdout / Stderr */}
            <pre
              style={{
                margin: 0,
                color: result?.stderr ? '#b91c1c' : '#131311',
                fontFamily: 'Consolas, "Fira Code", monospace',
                fontSize: '0.88rem',
                fontWeight: 600,
                lineHeight: 1.55,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '220px',
                overflowY: 'auto',
                background: 'var(--bg-surface-secondary)',
                padding: '0.85rem',
                borderRadius: '8px',
                border: '1px solid #e5e5e5',
              }}
            >
              {running
                ? '⚡ Running code in sandbox...'
                : result
                ? result.stderr || result.stdout || '(Executed with no output)'
                : 'Click "Run Code" or "Validate Tests" to execute your solution.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
