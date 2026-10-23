import { useEffect, useRef } from 'react'
import {
  X,
  CheckCircle2,
  PlayCircle,
  ExternalLink,
  BookOpen,
  Video,
  FileCode,
  Sparkles,
  Clock,
  Award,
  ListChecks,
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

  // Auto-scroll into view smoothly when opened
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [skill.skill])

  const getResourceIcon = (type) => {
    switch (type) {
      case 'course':
        return <BookOpen size={16} color="#131311" />
      case 'docs':
        return <FileCode size={16} color="#131311" />
      case 'video':
        return <Video size={16} color="#131311" />
      default:
        return <ExternalLink size={16} color="#131311" />
    }
  }

  return (
    <div
      ref={panelRef}
      className="roadmap-detail-drawer animate-fadeIn"
      style={{
        marginTop: '1.5rem',
        padding: '2rem',
        borderRadius: '12px',
        background: '#ffffff',
        border: '2px solid #131311',
        boxShadow: '6px 6px 0px #131311',
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
          background: '#ffffff',
          border: '1.5px solid #131311',
          borderRadius: '50%',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#131311',
          cursor: 'pointer',
          boxShadow: '1.5px 1.5px 0px #131311',
          transition: 'all 0.12s ease',
        }}
      >
        <X size={18} />
      </button>

      {/* Header Info */}
      <div style={{ marginBottom: '1.5rem', paddingRight: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: '#131311',
            background: 'var(--accent-lime)',
            border: '1px solid #131311',
            padding: '0.2rem 0.65rem',
            borderRadius: '999px',
          }}>
            {skill.stage} Stage
          </span>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.8rem',
            color: '#52524e',
            fontWeight: 600,
          }}>
            <Clock size={14} color="#131311" />
            Est. {skill.hours ? `${skill.hours} hours` : '15 hours'} ({skill.weeks || '2 weeks'})
          </span>

          {typeof skill.weight === 'number' && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.78rem',
              color: '#131311',
              fontWeight: 800,
              background: '#ffffff',
              border: '1px solid #131311',
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
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
              color: '#131311',
              background: 'var(--accent-lime)',
              border: '1px solid #131311',
              padding: '0.2rem 0.65rem',
              borderRadius: 999,
              fontWeight: 800,
            }}>
              <ShieldCheck size={14} />
              Verified Skill ✓
            </span>
          )}
        </div>

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.85rem',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: '#131311',
          margin: '0.35rem 0',
        }}>
          {skill.skill}
        </h3>

        <p style={{ color: '#52524e', fontSize: '0.95rem', lineHeight: 1.6, marginTop: '0.4rem' }}>
          {skill.description}
        </p>

        {skill.reason && skill.reason !== skill.description && (
          <div style={{
            marginTop: '0.85rem',
            padding: '0.85rem 1.15rem',
            borderRadius: '8px',
            background: 'var(--accent-lime-subtle)',
            border: '1.5px solid #131311',
            boxShadow: '2px 2px 0px #131311',
            fontSize: '0.88rem',
            color: '#131311',
          }}>
            <strong style={{ color: '#131311', marginRight: '0.35rem' }}>⚡ Role Fit Insight:</strong>
            {skill.reason}
          </div>
        )}
      </div>

      {/* Grid: Sub-topics & Learning Resources */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem', alignItems: 'stretch' }}>
        {/* Sub-topics Section */}
        <div style={{
          background: 'var(--bg-surface-secondary)',
          border: '1.5px solid #131311',
          borderRadius: '10px',
          padding: '1.35rem',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.95rem',
            fontWeight: 800,
            color: '#131311',
            marginBottom: '1rem',
          }}>
            <ListChecks size={18} />
            Key Sub-topics & Core Concepts
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', margin: 0, padding: 0 }}>
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
                  gap: '0.65rem',
                  fontSize: '0.88rem',
                  color: '#131311',
                  lineHeight: 1.45,
                }}
              >
                <span style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  background: isCompleted ? 'var(--accent-lime)' : '#ffffff',
                  border: '1px solid #131311',
                  color: '#131311',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  marginTop: '0.1rem',
                  flexShrink: 0,
                  boxShadow: '1px 1px 0px #131311',
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
          background: 'var(--bg-surface-secondary)',
          border: '1.5px solid #131311',
          borderRadius: '10px',
          padding: '1.35rem',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.95rem',
            fontWeight: 800,
            color: '#131311',
            marginBottom: '1rem',
          }}>
            <BookOpen size={18} />
            Curated Free Learning Resources
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(skill.resources || [
              { title: `${skill.skill} Official Documentation & Quickstart`, type: 'docs', platform: 'Official Docs', url: 'https://developer.mozilla.org' },
              { title: `Complete ${skill.skill} Masterclass & Practice Exercises`, type: 'course', platform: 'freeCodeCamp', url: 'https://freecodecamp.org' },
            ]).map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '8px',
                  background: '#ffffff',
                  border: '1.5px solid #131311',
                  color: '#131311',
                  textDecoration: 'none',
                  boxShadow: '1.5px 1.5px 0px #131311',
                  transition: 'all 0.12s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: 'var(--accent-lime)',
                    border: '1px solid #131311',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {getResourceIcon(res.type)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {res.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#80807c', fontWeight: 600 }}>
                      {res.platform} · {res.type.toUpperCase()}
                    </div>
                  </div>
                </div>

                <ExternalLink size={14} color="#131311" style={{ flexShrink: 0, marginLeft: '0.5rem' }} />
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
        borderTop: '1.5px solid #131311',
        paddingTop: '1.5rem',
      }}>
        <div style={{ fontSize: '0.86rem', color: '#52524e', fontWeight: 600 }}>
          {isCompleted ? (
            <span style={{ color: '#131311', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800 }}>
              <CheckCircle2 size={16} /> Completed! Marking this updates your progress tracker in real-time.
            </span>
          ) : isInProgress ? (
            <span style={{ color: '#131311', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800 }}>
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
                background: isVerified ? 'var(--accent-lime-subtle)' : '#ffffff',
                color: '#131311',
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
              <PlayCircle size={16} />
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
            }}
          >
            <CheckCircle2 size={17} />
            {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete ✓'}
          </button>
        </div>
      </div>
    </div>
  )
}
