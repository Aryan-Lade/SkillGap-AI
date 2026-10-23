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
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
          <Code2 size={16} /> Interactive In-Browser Sandbox
        </div>
        <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
          Interactive Coding Sandbox & Challenges
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: 680, margin: '0 auto' }}>
          Practice hands-on coding challenges for your missing roadmap skills in real time.
          Run Python, JavaScript, and SQL directly in your browser with automated test validation.
        </p>

        {/* Language Tabs */}
        <div style={{ display: 'inline-flex', gap: '0.5rem', marginTop: '1.25rem', padding: '4px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
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
                padding: '0.45rem 1.1rem',
                borderRadius: 8,
                border: 'none',
                background: language === l.id ? 'rgba(99, 102, 241, 0.35)' : 'transparent',
                color: language === l.id ? '#a5b4fc' : '#94a3b8',
                fontWeight: language === l.id ? 700 : 500,
                fontSize: '0.86rem',
                cursor: 'pointer',
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
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} color="#818cf8" /> Available Challenges ({language.toUpperCase()})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                        padding: '0.65rem 0.85rem',
                        borderRadius: 8,
                        border: isSelected ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.06)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.02)',
                        color: isSelected ? '#e0e7ff' : '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '0.84rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontWeight: isSelected ? 600 : 400 }}>{ch.title}</span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '1px 6px',
                          borderRadius: 4,
                          background:
                            ch.difficulty === 'Easy'
                              ? 'rgba(52, 211, 153, 0.15)'
                              : 'rgba(251, 191, 36, 0.15)',
                          color: ch.difficulty === 'Easy' ? '#34d399' : '#fbbf24',
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
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#818cf8',
                  }}
                >
                  Skill Focus: {selectedChallenge.skill}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '1px 6px',
                    borderRadius: 4,
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#c7d2fe',
                  }}
                >
                  {selectedChallenge.difficulty}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: '0 0 0.6rem 0' }}>
                {selectedChallenge.title}
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                {selectedChallenge.description}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Code Editor & Execution Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Editor Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 1rem',
              borderRadius: '12px 12px 0 0',
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderBottom: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                solution.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'sql'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleReset}
                title="Reset code"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  padding: '4px 8px',
                  color: '#94a3b8',
                  fontSize: '0.78rem',
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
                  background: 'rgba(99, 102, 241, 0.25)',
                  border: '1px solid #818cf8',
                  borderRadius: 6,
                  padding: '4px 12px',
                  color: '#e0e7ff',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: running ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Play size={13} fill="#818cf8" /> Run Code
              </button>

              {selectedChallenge?.test_code && (
                <button
                  type="button"
                  onClick={() => handleRun(true)}
                  disabled={running}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: 6,
                    padding: '4px 12px',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: running ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
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
              background: '#020617',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0 0 12px 12px',
              color: '#38bdf8',
              padding: '1rem',
              fontSize: '0.92rem',
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
              lineHeight: 1.6,
              boxSizing: 'border-box',
              outline: 'none',
              resize: 'vertical',
            }}
          />

          {/* Output Terminal Card */}
          <div
            style={{
              borderRadius: 12,
              background: '#090d16',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Terminal size={15} color="#818cf8" /> Output Console
              </div>

              {result && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={12} /> {result.duration_ms}ms
                  </span>
                  {result.tests_passed ? (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '1px 7px',
                        borderRadius: 4,
                        background: 'rgba(52, 211, 153, 0.2)',
                        color: '#34d399',
                      }}
                    >
                      Passed ✅
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '1px 7px',
                        borderRadius: 4,
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#f87171',
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
                  color: '#f87171',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  padding: '0.5rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: 6,
                }}
              >
                {error}
              </div>
            )}

            {/* SQL Table Output */}
            {result?.columns && result.columns.length > 0 && (
              <div style={{ overflowX: 'auto', marginBottom: '0.75rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', fontFamily: 'monospace' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', color: '#93c5fd' }}>
                      {result.columns.map((c) => (
                        <th key={c} style={{ textAlign: 'left', padding: '6px 10px' }}>
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, rIdx) => (
                      <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0' }}>
                        {result.columns.map((col) => (
                          <td key={col} style={{ padding: '6px 10px' }}>
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
                color: result?.stderr ? '#f87171' : '#4ade80',
                fontFamily: 'Consolas, "Fira Code", monospace',
                fontSize: '0.86rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '220px',
                overflowY: 'auto',
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
