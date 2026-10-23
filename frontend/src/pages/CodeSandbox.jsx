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
  Lightbulb,
  Eye,
  EyeOff,
  Copy,
  Check,
  Search,
  BookOpen,
  ArrowRight,
  Flame,
  ChevronRight,
} from 'lucide-react'
import { getSandboxChallenges, runSandboxCode } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { recordActivity } from '../utils/history'

const POPULAR_SKILLS = [
  'Python',
  'JavaScript',
  'SQL',
  'React',
  'REST APIs',
  'Data Structures',
  'Machine Learning',
  'Docker',
]

export default function CodeSandbox() {
  const { user } = useAuth()
  const [activeSkill, setActiveSkill] = useState('Python')
  const [skillInput, setSkillInput] = useState('')
  const [challenges, setChallenges] = useState([])
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState('')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loadingChallenges, setLoadingChallenges] = useState(false)

  // Feature request: Hints and See Code options
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [copiedSolution, setCopiedSolution] = useState(false)

  // Load challenges for active skill
  const loadChallenges = async (skillToLoad) => {
    setLoadingChallenges(true)
    setError(null)
    try {
      const res = await getSandboxChallenges(skillToLoad)
      const list = res.data.challenges || []
      setChallenges(list)
      if (list.length > 0) {
        selectChallenge(list[0])
      } else {
        setSelectedChallenge(null)
      }
    } catch (err) {
      console.error('Failed to load challenges for skill:', skillToLoad, err)
      setError('Could not load challenges for this skill.')
    } finally {
      setLoadingChallenges(false)
    }
  }

  useEffect(() => {
    loadChallenges(activeSkill)
  }, [activeSkill])

  const selectChallenge = (ch) => {
    setSelectedChallenge(ch)
    setLanguage(ch.language || 'python')
    setCode(ch.starter_code || '')
    setResult(null)
    setError(null)
    setShowHints(false)
    setShowSolution(false)
    setCopiedSolution(false)
  }

  const handleSkillSelect = (skill) => {
    setActiveSkill(skill)
    setSkillInput('')
  }

  const handleCustomSkillSubmit = (e) => {
    e.preventDefault()
    if (skillInput.trim()) {
      setActiveSkill(skillInput.trim())
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
        title: `${language.toUpperCase()} (${selectedChallenge?.skill || activeSkill}): ${selectedChallenge?.title || 'Interactive Code'}`,
        subtitle: `Execution Time: ${res.data?.duration_ms || 12}ms`,
        score: isPass ? 'Passed ✓' : 'Executed',
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
    }
    setResult(null)
    setError(null)
  }

  const handleLoadSolution = () => {
    if (selectedChallenge?.solution_code) {
      setCode(selectedChallenge.solution_code)
      setShowSolution(false)
    }
  }

  const handleCopySolution = () => {
    if (selectedChallenge?.solution_code) {
      navigator.clipboard.writeText(selectedChallenge.solution_code)
      setCopiedSolution(true)
      setTimeout(() => setCopiedSolution(false), 2000)
    }
  }

  return (
    <div style={{ maxWidth: 1280, margin: '2rem auto', padding: '0 1rem' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="pill-badge pill-badge-lime" style={{ marginBottom: '0.85rem' }}>
          <Code2 size={15} /> SKILL-ADAPTIVE CODE SANDBOX & CHALLENGES
        </div>
        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.85rem)',
            fontWeight: 900,
            color: '#131311',
            letterSpacing: '-0.03em',
            margin: '0 0 0.75rem 0',
          }}
        >
          Interactive Skill Coding Practice
        </h1>
        <p style={{ color: '#52524e', fontSize: '1.05rem', maxWidth: 720, margin: '0 auto', lineHeight: 1.55 }}>
          Select or enter any skill you want to practice. SkillGap AI dynamically provides <strong>2 tailored coding questions per skill</strong> with interactive execution, instant test validation, progressive hints, and reference solutions.
        </p>

        {/* Skill Search & Input Box */}
        <div style={{ maxWidth: 640, margin: '1.75rem auto 1.25rem auto' }}>
          <form
            onSubmit={handleCustomSkillSubmit}
            style={{
              display: 'flex',
              gap: '0.5rem',
              background: '#ffffff',
              padding: '6px',
              borderRadius: '12px',
              border: '2px solid #131311',
              boxShadow: '3px 3px 0px #131311',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '10px', color: '#737370' }}>
              <Search size={18} />
            </div>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Enter your skill (e.g. React, SQL, Python, Docker, ML, REST APIs...)"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#131311',
                padding: '8px 6px',
              }}
            />
            <button
              type="submit"
              className="neo-btn neo-btn-primary"
              style={{
                padding: '0.5rem 1.25rem',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Practice Skill <ArrowRight size={15} />
            </button>
          </form>
        </div>

        {/* Popular Skill Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#737370', marginRight: '0.25rem' }}>
            Popular Skills:
          </span>
          {POPULAR_SKILLS.map((sk) => {
            const isActive = activeSkill.toLowerCase() === sk.toLowerCase()
            return (
              <button
                key={sk}
                type="button"
                onClick={() => handleSkillSelect(sk)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '999px',
                  border: '1.5px solid #131311',
                  background: isActive ? 'var(--accent-lime)' : '#ffffff',
                  color: '#131311',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  boxShadow: isActive ? '2px 2px 0px #131311' : '1px 1px 0px #131311',
                  transform: isActive ? 'translateY(-1px)' : 'none',
                  transition: 'all 0.12s ease',
                }}
              >
                {sk}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Grid: Left = 2 Questions + Problem Details, Right = Editor + Execution Engine */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: 2 Questions for Active Skill + Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Question Selector Card */}
          <div className="neo-card" style={{ padding: '1.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#131311', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Layers size={18} /> Challenges for {activeSkill}
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  border: '1px solid #131311',
                  background: 'var(--accent-lime-subtle)',
                }}
              >
                {challenges.length} Available
              </span>
            </div>

            {loadingChallenges ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#737370', fontSize: '0.88rem' }}>
                Loading challenges for {activeSkill}...
              </div>
            ) : challenges.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#737370', fontSize: '0.88rem' }}>
                No challenges found. Try entering another skill above!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {challenges.map((ch, idx) => {
                  const isSelected = selectedChallenge?.id === ch.id
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => selectChallenge(ch)}
                      style={{
                        textAlign: 'left',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid #131311',
                        background: isSelected ? 'var(--accent-lime)' : '#ffffff',
                        color: '#131311',
                        cursor: 'pointer',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                        boxShadow: isSelected ? '2.5px 2.5px 0px #131311' : '1px 1px 0px #131311',
                        transform: isSelected ? 'translateY(-1px)' : 'none',
                        transition: 'all 0.12s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: isSelected ? '#131311' : '#737370' }}>
                          Question {idx + 1} of 2
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '1px 7px',
                            borderRadius: '999px',
                            border: '1px solid #131311',
                            background: ch.difficulty === 'Easy' ? '#d1fae5' : '#fef3c7',
                            color: '#131311',
                          }}
                        >
                          {ch.difficulty}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#131311', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{ch.title}</span>
                        <ChevronRight size={16} />
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Active Question Problem Details */}
          {selectedChallenge && (
            <div className="neo-card" style={{ padding: '1.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    fontSize: '0.74rem',
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
                    fontSize: '0.74rem',
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
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#131311', margin: '0 0 0.65rem 0' }}>
                {selectedChallenge.title}
              </h3>
              <p style={{ color: '#52524e', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                {selectedChallenge.description}
              </p>

              {/* Engine Spec Info */}
              <div
                style={{
                  marginTop: '1.15rem',
                  padding: '0.65rem 0.85rem',
                  background: '#f8f7f2',
                  border: '1px solid #131311',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#52524e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>Execution Engine:</span>
                <span style={{ color: '#131311', fontWeight: 900, textTransform: 'uppercase' }}>
                  {selectedChallenge.language === 'python'
                    ? '🐍 Python 3.11'
                    : selectedChallenge.language === 'javascript'
                    ? '⚡ Node.js 24'
                    : '🗄️ SQLite DB'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code Editor Header with Requested Buttons (See Code & Hints), Editor, and Console */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Editor Container */}
          <div
            style={{
              border: '2px solid #131311',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '4px 4px 0px #131311',
              background: '#131311',
            }}
          >
            {/* Top Toolbar / Header with Prominent HINTS and SEE CODE Options */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1.15rem',
                background: '#1a1b18',
                borderBottom: '1.5px solid #2d2e2a',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              {/* File Title and Execution Tag */}
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

              {/* Action Buttons: Hints, See Code, Reset, Run, Validate */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* 1. Hints Button (User requested) */}
                <button
                  type="button"
                  onClick={() => setShowHints(!showHints)}
                  title="View hints for this question"
                  style={{
                    background: showHints ? '#fef08a' : '#2a2b27',
                    border: '1.5px solid #131311',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    color: showHints ? '#131311' : '#fef08a',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: showHints ? '2px 2px 0px #131311' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Lightbulb size={14} /> Hints {selectedChallenge?.hints?.length ? `(${selectedChallenge.hints.length})` : ''}
                </button>

                {/* 2. See Code / Solution Button (User requested) */}
                <button
                  type="button"
                  onClick={() => setShowSolution(!showSolution)}
                  title="See full reference code/solution"
                  style={{
                    background: showSolution ? '#bae6fd' : '#2a2b27',
                    border: '1.5px solid #131311',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    color: showSolution ? '#131311' : '#38bdf8',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: showSolution ? '2px 2px 0px #131311' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {showSolution ? <EyeOff size={14} /> : <Eye size={14} />} See Code
                </button>

                {/* Reset Button */}
                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset code to original template"
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

                {/* Run Code Button */}
                <button
                  type="button"
                  onClick={() => handleRun(false)}
                  disabled={running}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #131311',
                    borderRadius: '6px',
                    padding: '5px 13px',
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

                {/* Validate Tests Button */}
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

            {/* Collapsible Hints Panel (User requested) */}
            {showHints && selectedChallenge?.hints && (
              <div
                style={{
                  background: '#fefce8',
                  borderBottom: '2px solid #131311',
                  padding: '1rem 1.25rem',
                  color: '#131311',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#854d0e' }}>
                    <Lightbulb size={16} /> Progressive Hints for "{selectedChallenge.title}"
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHints(false)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 800, color: '#854d0e' }}
                  >
                    Close ✕
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedChallenge.hints.map((hint, hIdx) => (
                    <div
                      key={hIdx}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #facc15',
                        borderRadius: '6px',
                        padding: '0.55rem 0.85rem',
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.55rem',
                      }}
                    >
                      <span
                        style={{
                          background: '#fef08a',
                          border: '1px solid #ca8a04',
                          borderRadius: '4px',
                          padding: '1px 6px',
                          fontSize: '0.72rem',
                          fontWeight: 900,
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        Hint {hIdx + 1}
                      </span>
                      <span>{hint}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Collapsible See Code / Solution Modal / Drawer (User requested) */}
            {showSolution && selectedChallenge?.solution_code && (
              <div
                style={{
                  background: '#f0f9ff',
                  borderBottom: '2px solid #131311',
                  padding: '1rem 1.25rem',
                  color: '#131311',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0369a1' }}>
                    <Eye size={16} /> Reference Solution Code
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={handleCopySolution}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #131311',
                        borderRadius: '5px',
                        padding: '3px 9px',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {copiedSolution ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                      {copiedSolution ? 'Copied!' : 'Copy Code'}
                    </button>
                    <button
                      type="button"
                      onClick={handleLoadSolution}
                      style={{
                        background: 'var(--accent-lime)',
                        border: '1px solid #131311',
                        borderRadius: '5px',
                        padding: '3px 9px',
                        fontSize: '0.76rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Sparkles size={12} /> Load into Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSolution(false)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 800, color: '#0369a1', marginLeft: '4px' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <pre
                  style={{
                    background: '#131311',
                    color: '#f8fafc',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    fontFamily: '"Fira Code", monospace',
                    fontSize: '0.86rem',
                    lineHeight: 1.5,
                    maxHeight: '220px',
                    overflowY: 'auto',
                    margin: 0,
                    border: '1px solid #38bdf8',
                  }}
                >
                  {selectedChallenge.solution_code}
                </pre>
              </div>
            )}

            {/* Interactive Textarea Code Editor */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={15}
              spellCheck="false"
              style={{
                width: '100%',
                background: '#131311',
                border: 'none',
                color: '#f8fafc',
                padding: '1.25rem',
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
                paddingBottom: '0.5rem',
                borderBottom: '1.5px solid #131311',
              }}
            >
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#131311', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Terminal size={16} /> Execution Terminal & Results
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
                      All Tests Passed ✅
                    </span>
                  ) : result.success ? (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        padding: '2px 9px',
                        borderRadius: '999px',
                        border: '1.5px solid #131311',
                        background: '#e0f2fe',
                        color: '#0369a1',
                        boxShadow: '1.5px 1.5px 0px #131311',
                      }}
                    >
                      Executed ✓
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
                      Failed / Error ❌
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Error Banner */}
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

            {/* SQL Table Output Rendering */}
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

            {/* Output Stdout / Stderr Box */}
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
                ? '⚡ Running code in sandbox container...'
                : result
                ? result.stderr || result.stdout || '(Code executed with no output)'
                : 'Click "Run Code" to test output or "Validate Tests" to verify full test suite.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
