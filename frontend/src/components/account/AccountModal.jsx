import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  getUserHistory,
  clearUserHistory,
} from '../../utils/history'
import {
  X,
  User,
  Mail,
  Calendar,
  Briefcase,
  Award,
  Zap,
  Clock,
  Trash2,
  ExternalLink,
  CheckCircle2,
  FileText,
  Code2,
  BookOpen,
  LogOut,
  Target,
  Edit2,
  Save,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AccountModal() {
  const { user, isAccountModalOpen, closeAccountModal, signOut, updateProfile } = useAuth()
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'skillgap' | 'quiz' | 'jd' | 'planner'
  const [isEditing, setIsEditing] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [roleInput, setRoleInput] = useState('Full Stack Developer')

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Learner'

  const userEmail = user?.email || 'student@skillgap.ai'
  const targetRole = user?.user_metadata?.target_role || 'Full Stack Developer'
  const isDemo = Boolean(user?.user_metadata?.is_demo)
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Oct 2026'

  useEffect(() => {
    if (isAccountModalOpen && user) {
      setNameInput(displayName)
      setRoleInput(targetRole)
      const data = getUserHistory(user.id || 'guest')
      setHistory(data)
    }
  }, [isAccountModalOpen, user, displayName, targetRole])

  // Listen for history updates
  useEffect(() => {
    const handleUpdate = (e) => {
      setHistory(e.detail || [])
    }
    window.addEventListener('skillgap_history_updated', handleUpdate)
    return () => window.removeEventListener('skillgap_history_updated', handleUpdate)
  }, [])

  if (!isAccountModalOpen || !user) return null

  const handleSaveProfile = (e) => {
    e.preventDefault()
    if (nameInput.trim()) {
      updateProfile(nameInput.trim(), roleInput.trim())
      setIsEditing(false)
    }
  }

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your past learning activity history?')) {
      clearUserHistory(user.id || 'guest')
      setHistory([])
    }
  }

  const filteredHistory = history.filter((item) => {
    if (activeTab === 'all') return true
    return item.type === activeTab
  })

  // Calculate quick stats
  const totalAnalyses = history.filter((h) => h.type === 'skillgap').length
  const totalQuizzes = history.filter((h) => h.type === 'quiz').length
  const totalJds = history.filter((h) => h.type === 'jd').length
  const totalPlans = history.filter((h) => h.type === 'planner').length

  const getIconForType = (type) => {
    switch (type) {
      case 'skillgap':
        return <Zap size={16} color="#d97706" />
      case 'quiz':
        return <Award size={16} color="#7c3aed" />
      case 'jd':
        return <FileText size={16} color="#2563eb" />
      case 'planner':
        return <Calendar size={16} color="#059669" />
      case 'sandbox':
        return <Code2 size={16} color="#dc2626" />
      default:
        return <Target size={16} color="#131311" />
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(19, 19, 17, 0.75)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAccountModal()
      }}
    >
      <div
        className="animate-fadeIn"
        style={{
          width: '100%',
          maxWidth: 680,
          background: '#ffffff',
          borderRadius: '16px',
          border: '2px solid #131311',
          boxShadow: '8px 8px 0px #131311',
          padding: '2rem',
          position: 'relative',
          color: '#131311',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeAccountModal}
          aria-label="Close account modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-surface-secondary, #f3f2ea)',
            border: '1.5px solid #131311',
            borderRadius: '50%',
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#131311',
            cursor: 'pointer',
            boxShadow: '1px 1px 0px #131311',
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingRight: '2rem' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--accent-lime, #c6fd50)',
              border: '2px solid #131311',
              boxShadow: '3px 3px 0px #131311',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {isEditing ? (
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter full name"
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    border: '1.5px solid #131311',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                >
                  <Save size={14} /> Save
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#131311', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {displayName}
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  title="Edit name"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Edit2 size={15} />
                </button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.86rem', color: '#52524e', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Mail size={14} /> {userEmail}
              </span>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  background: '#f1fccf',
                  border: '1px solid #131311',
                  color: '#131311',
                }}
              >
                ✓ Verified Member
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ padding: '0.75rem', background: '#f8f7f2', border: '1.5px solid #131311', borderRadius: '10px', boxShadow: '2px 2px 0px #131311', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{totalAnalyses}</div>
            <div style={{ fontSize: '0.72rem', color: '#52524e', fontWeight: 700, textTransform: 'uppercase' }}>Skill Gaps</div>
          </div>
          <div style={{ padding: '0.75rem', background: '#f8f7f2', border: '1.5px solid #131311', borderRadius: '10px', boxShadow: '2px 2px 0px #131311', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{totalQuizzes}</div>
            <div style={{ fontSize: '0.72rem', color: '#52524e', fontWeight: 700, textTransform: 'uppercase' }}>Quizzes</div>
          </div>
          <div style={{ padding: '0.75rem', background: '#f8f7f2', border: '1.5px solid #131311', borderRadius: '10px', boxShadow: '2px 2px 0px #131311', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{totalJds}</div>
            <div style={{ fontSize: '0.72rem', color: '#52524e', fontWeight: 700, textTransform: 'uppercase' }}>JD Matches</div>
          </div>
          <div style={{ padding: '0.75rem', background: '#f8f7f2', border: '1.5px solid #131311', borderRadius: '10px', boxShadow: '2px 2px 0px #131311', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{totalPlans}</div>
            <div style={{ fontSize: '0.72rem', color: '#52524e', fontWeight: 700, textTransform: 'uppercase' }}>Schedules</div>
          </div>
        </div>

        {/* Past History Header & Filters */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.98rem' }}>
            <Clock size={16} />
            <span>Past History & Learning Activity</span>
            <span style={{ fontSize: '0.75rem', background: '#f3f2ea', padding: '1px 6px', borderRadius: 999, border: '1px solid #131311' }}>
              {history.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <Trash2 size={13} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* History Filter Pills */}
        <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'skillgap', label: '⚡ Skill Gap' },
            { id: 'quiz', label: '🎯 Quizzes' },
            { id: 'jd', label: '📄 Job Matches' },
            { id: 'planner', label: '📅 Study Plans' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1.5px solid #131311',
                background: activeTab === tab.id ? 'var(--accent-lime, #c6fd50)' : '#ffffff',
                color: '#131311',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === tab.id ? '1.5px 1.5px 0px #131311' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* History Items List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '0.35rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            marginBottom: '1.5rem',
          }}
        >
          {filteredHistory.length === 0 ? (
            <div
              style={{
                padding: '2.5rem 1rem',
                textAlign: 'center',
                color: '#52524e',
                background: '#f8f7f2',
                borderRadius: '10px',
                border: '1.5px dashed #131311',
              }}
            >
              <p style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.25rem' }}>No activity in this category yet</p>
              <p style={{ fontSize: '0.82rem' }}>Run a skill gap test, upload a resume, or generate a roadmap to see your history appear here.</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  border: '1.5px solid #131311',
                  background: '#fdfdfc',
                  boxShadow: '2px 2px 0px #131311',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      background: '#f3f2ea',
                      border: '1px solid #131311',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {getIconForType(item.type)}
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#131311' }}>
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div style={{ fontSize: '0.8rem', color: '#52524e', marginTop: '0.15rem' }}>
                        {item.subtitle}
                      </div>
                    )}
                    {item.details && (
                      <div style={{ fontSize: '0.78rem', color: '#80807c', marginTop: '0.2rem', fontStyle: 'italic' }}>
                        {item.details}
                      </div>
                    )}
                    <div style={{ fontSize: '0.72rem', color: '#80807c', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} />
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem', flexShrink: 0 }}>
                  {item.score && (
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'var(--accent-lime, #c6fd50)',
                        border: '1px solid #131311',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: '#131311',
                      }}
                    >
                      {item.score}
                    </span>
                  )}
                  {item.link && (
                    <Link
                      to={item.link}
                      onClick={closeAccountModal}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#131311',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        textDecoration: 'underline',
                      }}
                    >
                      <span>View</span>
                      <ExternalLink size={12} />
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            paddingTop: '1rem',
            borderTop: '1.5px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#80807c' }}>
            Member since {joinedDate} · Target: {targetRole}
          </div>

          <button
            onClick={() => {
              signOut()
              closeAccountModal()
            }}
            className="btn btn-outline"
            style={{
              padding: '0.45rem 0.95rem',
              fontSize: '0.84rem',
              color: '#dc2626',
              borderColor: '#dc2626',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
