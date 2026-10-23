import React, { useState, useRef } from 'react'
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { parseResumeFile, parseResumeText } from '../api/client'

export default function ResumeUploadSection({ onApplyProfile }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('upload') // 'upload' | 'paste'
  const [file, setFile] = useState(null)
  const [pastedText, setPastedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [parsedResult, setParsedResult] = useState(null)
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [selectedExp, setSelectedExp] = useState('')
  const fileInputRef = useRef(null)

  const handleFileDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0]
      validateAndSetFile(f)
    }
  }

  const validateAndSetFile = (f) => {
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['pdf', 'txt', 'md'].includes(ext)) {
      setError('Please upload a PDF or plain text (.txt, .md) file.')
      return
    }
    setError(null)
    setFile(f)
  }

  const handleParse = async () => {
    setError(null)
    setLoading(true)
    setParsedResult(null)

    try {
      let data
      if (activeTab === 'upload') {
        if (!file) {
          setError('Please select a resume file first.')
          setLoading(false)
          return
        }
        const formData = new FormData()
        formData.append('file', file)
        const res = await parseResumeFile(formData)
        data = res.data
      } else {
        if (!pastedText.trim() || pastedText.trim().length < 30) {
          setError('Please paste at least 30 characters of resume text.')
          setLoading(false)
          return
        }
        const res = await parseResumeText({ text: pastedText })
        data = res.data
      }

      setParsedResult(data)
      setSelectedRole(data.best_matching_role || (data.recommended_roles?.[0]?.role) || '')
      setSelectedSkills(data.extracted_skills || [])
      setSelectedExp(data.experience_level || 'Beginner')
    } catch (err) {
      console.error('Resume parse error:', err)
      setError(err?.response?.data?.detail || 'Failed to parse resume. Please check the file or text and try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const handleApply = () => {
    if (!selectedRole) {
      setError('Please select a target role from the recommendations.')
      return
    }
    onApplyProfile({
      targetRole: selectedRole,
      experienceLevel: selectedExp,
      skills: selectedSkills,
    })
    setIsOpen(false)
  }

  return (
    <div
      style={{
        marginBottom: '1.5rem',
        borderRadius: '12px',
        border: 'var(--border-main)',
        background: 'var(--bg-surface)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}
    >
      {/* Header Banner */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          cursor: 'pointer',
          userSelect: 'none',
          background: 'var(--bg-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: 'var(--accent-lime)',
              border: 'var(--border-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#131311',
              boxShadow: '2px 2px 0px #131311',
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Autofill Profile with AI Resume Parser
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'var(--accent-lime)',
                  color: '#131311',
                  border: '1px solid #131311',
                }}
              >
                1-Click Autofill
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Upload your PDF/TXT resume or paste text to instantly detect skills & role matches
            </div>
          </div>
        </div>
        <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Collapsible Body */}
      {isOpen && (
        <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', borderTop: 'var(--border-main)', background: 'var(--bg-surface-secondary)' }}>
          {/* Tab Selector */}
          <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0 1rem 0' }}>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              style={{
                flex: 1,
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: 'var(--border-main)',
                background: activeTab === 'upload' ? 'var(--accent-lime)' : 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.88rem',
                boxShadow: activeTab === 'upload' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <UploadCloud size={16} /> Upload PDF / File
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              style={{
                flex: 1,
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: 'var(--border-main)',
                background: activeTab === 'paste' ? 'var(--accent-lime)' : 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.88rem',
                boxShadow: activeTab === 'paste' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <FileText size={16} /> Paste Resume Text
            </button>
          </div>

          {/* Upload Dropzone */}
          {activeTab === 'upload' ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #131311',
                borderRadius: '10px',
                padding: '1.75rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--bg-surface)',
                transition: 'border-color 0.2s',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
              />
              <UploadCloud size={36} color="#131311" style={{ margin: '0 auto 0.5rem auto' }} />
              <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.92rem' }}>
                {file ? file.name : 'Click to select or drag and drop your resume'}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                Supports PDF, TXT, or Markdown (up to 10MB)
              </div>
            </div>
          ) : (
            <div>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your resume content, LinkedIn bio, or list of projects/skills here..."
                rows={5}
                className="form-input"
                style={{
                  background: 'var(--bg-surface)',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>
          )}

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.85rem' }}>
            <button
              type="button"
              onClick={handleParse}
              disabled={loading || (activeTab === 'upload' && !file) || (activeTab === 'paste' && !pastedText.trim())}
              className="btn btn-primary"
              style={{
                opacity: loading || (activeTab === 'upload' && !file) || (activeTab === 'paste' && !pastedText.trim()) ? 0.6 : 1,
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      border: '2px solid rgba(0,0,0,0.3)',
                      borderTopColor: '#000',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Analyze with AI
                </>
              )}
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                marginTop: '0.85rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: '#fee2e2',
                border: 'var(--border-main)',
                color: '#b91c1c',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Parsed Result Preview */}
          {parsedResult && (
            <div
              style={{
                marginTop: '1.25rem',
                padding: '1.25rem',
                borderRadius: '10px',
                background: 'var(--bg-surface)',
                border: 'var(--border-main)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="#16a34a" />
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    Resume Successfully Analyzed
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: 'var(--accent-lime)',
                    border: '1px solid #131311',
                    color: '#131311',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  Exp: {parsedResult.experience_level || 'Intermediate'} ({parsedResult.experience_years || 0} yrs)
                </span>
              </div>

              {parsedResult.summary && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
                  {parsedResult.summary}
                </p>
              )}

              {/* Recommended Role Selector */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Recommended Role Match:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(parsedResult.recommended_roles || []).map((r) => {
                    const isSelected = selectedRole === r.role
                    return (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => setSelectedRole(r.role)}
                        style={{
                          padding: '0.4rem 0.75rem',
                          borderRadius: '8px',
                          border: 'var(--border-main)',
                          background: isSelected ? 'var(--accent-lime)' : 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 800 : 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                        }}
                      >
                        <Briefcase size={13} />
                        {r.role}
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            background: isSelected ? '#131311' : 'var(--bg-surface-secondary)',
                            color: isSelected ? '#fff' : '#131311',
                            fontWeight: 700,
                          }}
                        >
                          {r.match_percentage}%
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Detected Skills */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Detected Skills ({selectedSkills.length}):
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Click to include/exclude</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '160px', overflowY: 'auto' }}>
                  {(parsedResult.extracted_skills || []).map((skill) => {
                    const isChecked = selectedSkills.includes(skill)
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          border: isChecked ? '1px solid #16a34a' : '1px solid #cbd5e1',
                          background: isChecked ? '#dcfce7' : 'var(--bg-surface-secondary)',
                          color: isChecked ? '#15803d' : '#64748b',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textDecoration: isChecked ? 'none' : 'line-through',
                        }}
                      >
                        {skill}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Apply Button */}
              <button
                type="button"
                onClick={handleApply}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  fontSize: '0.9rem',
                }}
              >
                ✨ Apply to Profile Form <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
