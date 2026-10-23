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
        borderRadius: '16px',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.45) 0%, rgba(15, 23, 42, 0.6) 100%)',
        backdropFilter: 'blur(12px)',
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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.98rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Autofill Profile with AI Resume Parser
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(168, 85, 247, 0.25)',
                  color: '#c084fc',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                }}
              >
                New Feature
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Upload your PDF/TXT resume or paste text to instantly detect skills & role matches
            </div>
          </div>
        </div>
        <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Collapsible Body */}
      {isOpen && (
        <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {/* Tab Selector */}
          <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0 1rem 0' }}>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              style={{
                flex: 1,
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'upload' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                color: activeTab === 'upload' ? '#a5b4fc' : '#94a3b8',
                fontWeight: activeTab === 'upload' ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.88rem',
                transition: 'all 0.2s',
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
                border: 'none',
                background: activeTab === 'paste' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                color: activeTab === 'paste' ? '#a5b4fc' : '#94a3b8',
                fontWeight: activeTab === 'paste' ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.88rem',
                transition: 'all 0.2s',
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
                border: '2px dashed rgba(99, 102, 241, 0.4)',
                borderRadius: '12px',
                padding: '1.75rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(15, 23, 42, 0.4)',
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
              <UploadCloud size={36} color="#818cf8" style={{ margin: '0 auto 0.5rem auto' }} />
              <div style={{ color: '#f1f5f9', fontWeight: 500, fontSize: '0.92rem' }}>
                {file ? file.name : 'Click to select or drag and drop your resume'}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.25rem' }}>
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
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  padding: '0.75rem',
                  fontSize: '0.88rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box',
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
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.6rem 1.25rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                opacity: loading || (activeTab === 'upload' && !file) || (activeTab === 'paste' && !pastedText.trim()) ? 0.6 : 1,
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
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
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
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
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="#4ade80" />
                  <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>
                    Resume Successfully Analyzed
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#93c5fd',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  Exp: {parsedResult.experience_level || 'Intermediate'} ({parsedResult.experience_years || 0} yrs)
                </span>
              </div>

              {parsedResult.summary && (
                <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
                  {parsedResult.summary}
                </p>
              )}

              {/* Recommended Role Selector */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
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
                          border: isSelected ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                          color: isSelected ? '#a5b4fc' : '#94a3b8',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 600 : 400,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        <Briefcase size={13} />
                        {r.role}
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            background: isSelected ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                            color: isSelected ? '#fff' : '#cbd5e1',
                          }}
                        >
                          {r.match_percentage}% match
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Detected Skills */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>
                    Detected Skills ({selectedSkills.length}):
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Click skill to include/exclude</span>
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
                          border: isChecked ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                          background: isChecked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                          color: isChecked ? '#6ee7b7' : '#64748b',
                          fontSize: '0.78rem',
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
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.65rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
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
