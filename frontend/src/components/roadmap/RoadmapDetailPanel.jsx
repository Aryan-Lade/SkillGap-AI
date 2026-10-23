import { useEffect, useRef } from 'react'
import {
  X,
  CheckCircle2,
  PlayCircle,
  ExternalLink,
  BookOpen,
  GraduationCap,
  Video,
  Clock,
  Award,
  ListChecks,
  Compass,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'

export default function RoadmapDetailPanel({
  skill,
  status = 'locked',
  isVerified = false,
  onClose,
  onToggleComplete,
  onStartLearning,
  onOpenQuiz,
}) {
  const panelRef = useRef(null)

  const isCompleted = status === 'completed'
  const isInProgress = status === 'in-progress'

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!skill) return null

  const getResourceIcon = (type) => {
    switch (type) {
      case 'docs':
        return <BookOpen size={16} color="var(--accent-blue)" />
      case 'course':
        return <GraduationCap size={16} color="var(--accent-purple)" />
      case 'video':
        return <Video size={16} color="var(--accent-pink)" />
      default:
        return <ExternalLink size={16} color="var(--accent-teal)" />
    }
  }

  return (
    <div
      ref={panelRef}
      className="roadmap-detail-drawer animate-fadeIn"
      style={{
        marginTop: '1.25rem',
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(145deg, rgba(13, 18, 33, 0.95) 0%, rgba(8, 11, 20, 0.98) 100%)',
        border: '1px solid var(--border-glow)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 179, 237, 0.1)',
        position: 'relative',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close detail panel"
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '50%',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'var(--transition)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
          e.currentTarget.style.color = 'var(--text-primary)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
          e.currentTarget.style.color = 'var(--text-secondary)'
        }}
      >
        <X size={18} />
      </button>

      {/* Header Info */}
      <div style={{ marginBottom: '1.5rem', paddingRight: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--accent-blue)',
            background: 'rgba(99, 179, 237, 0.12)',
            padding: '0.2rem 0.6rem',
            borderRadius: 999,
          }}>
            {skill.stage} Stage
          </span>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}>
            <Clock size={14} />
            Est. {skill.hours ? `${skill.hours} hours` : '15 hours'} ({skill.weeks || '2 weeks'})
          </span>

          {typeof skill.weight === 'number' && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.78rem',
              color: 'var(--accent-orange)',
              fontWeight: 600,
            }}>
              <Award size={14} />
              {(skill.weight * 100).toFixed(0)}% Hiring Weight
            </span>
          )}

          {isVerified && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              color: 'var(--accent-green)',
              background: 'rgba(72, 187, 120, 0.15)',
              border: '1px solid rgba(72, 187, 120, 0.35)',
              padding: '0.2rem 0.6rem',
              borderRadius: 999,
              fontWeight: 700,
            }}>
              <ShieldCheck size={14} />
              Verified Skill ✓
            </span>
          )}
        </div>

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.6rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          margin: '0.35rem 0',
        }}>
          {skill.skill}
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginTop: '0.4rem' }}>
          {skill.description}
        </p>

        {skill.reason && skill.reason !== skill.description && (
          <div style={{
            marginTop: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(99, 179, 237, 0.07)',
            borderLeft: '3px solid var(--accent-blue)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
          }}>
            <strong style={{ color: 'var(--accent-blue)', marginRight: '0.35rem' }}>Role Fit Insight:</strong>
            {skill.reason}
          </div>
        )}
      </div>

      {/* Grid: Sub-topics & Learning Resources */}
      <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.75rem', alignItems: 'stretch' }}>
        {/* Sub-topics Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.9rem',
          }}>
            <ListChecks size={18} color="var(--accent-blue)" />
            Key Sub-topics & Core Concepts
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', margin: 0, padding: 0 }}>
            {(skill.subtopics || [
              `Core fundamentals & syntax of ${skill.skill}`,
              `Real-world implementation patterns`,
              `Performance tuning and edge-case testing`,
              `Hands-on practical mini-project`,
            ]).map((topic, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  fontSize: '0.86rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                }}
              >
                <span style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  background: isCompleted ? 'rgba(104, 211, 145, 0.18)' : 'rgba(255, 255, 255, 0.06)',
                  color: isCompleted ? 'var(--accent-green)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  marginTop: '0.1rem',
                  flexShrink: 0,
                }}>
                  {isCompleted ? '✓' : i + 1}
                </span>
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Resources Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.9rem',
          }}>
            <Compass size={18} color="var(--accent-purple)" />
            Recommended Learning Resources
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(skill.resources || []).map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.7rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = 'var(--border-glow)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {getResourceIcon(res.type)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {res.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {res.platform} · {res.type.toUpperCase()}
                    </div>
                  </div>
                </div>

                <ExternalLink size={14} color="var(--text-muted)" style={{ flexShrink: 0, marginLeft: '0.5rem' }} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '1.25rem',
      }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {isCompleted ? (
            <span style={{ color: 'var(--accent-green)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={16} /> Completed! Marking this updates your progress tracker in real-time.
            </span>
          ) : isInProgress ? (
            <span style={{ color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <PlayCircle size={16} /> Currently active in your learning journey.
            </span>
          ) : (
            <span>Ready to master this skill? Begin learning or mark as completed when done.</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {onOpenQuiz && (
            <button
              onClick={() => onOpenQuiz(skill.skill)}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.88rem',
                background: isVerified ? 'rgba(72, 187, 120, 0.12)' : 'rgba(99, 179, 237, 0.12)',
                borderColor: isVerified ? 'rgba(72, 187, 120, 0.35)' : 'rgba(99, 179, 237, 0.35)',
                color: isVerified ? 'var(--accent-green)' : 'var(--accent-blue)',
              }}
            >
              <Sparkles size={15} />
              {isVerified ? 'Retake Quiz' : '⚡ Take Verification Quiz'}
            </button>
          )}

          {!isInProgress && !isCompleted && onStartLearning && (
            <button
              onClick={() => onStartLearning(skill.skill)}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.88rem',
              }}
            >
              <PlayCircle size={16} color="var(--accent-blue)" />
              Set as In Progress
            </button>
          )}

          <button
            onClick={() => onToggleComplete(skill.skill)}
            className={`btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              background: isCompleted ? 'rgba(255, 255, 255, 0.08)' : undefined,
              borderColor: isCompleted ? 'rgba(104, 211, 145, 0.3)' : undefined,
            }}
          >
            <CheckCircle2 size={17} color={isCompleted ? 'var(--accent-green)' : 'currentColor'} />
            {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete ✓'}
          </button>
        </div>
      </div>
    </div>
  )
}
