import { CheckCircle2, PlayCircle, ArrowRightCircle, Lock, Clock, Sparkles, ShieldCheck } from 'lucide-react'

const STAGE_THEMES = {
  Foundational: {
    badge: 'Beginner',
    badgeClass: 'badge-foundational',
    accent: 'var(--accent-blue)',
    borderActive: 'rgba(99, 179, 237, 0.6)',
  },
  Intermediate: {
    badge: 'Intermediate',
    badgeClass: 'badge-intermediate',
    accent: 'var(--accent-purple)',
    borderActive: 'rgba(183, 148, 244, 0.6)',
  },
  Applied: {
    badge: 'Advanced',
    badgeClass: 'badge-applied',
    accent: 'var(--accent-green)',
    borderActive: 'rgba(104, 211, 145, 0.6)',
  },
}

export default function RoadmapNode({
  skill,
  status = 'locked', // 'completed' | 'in-progress' | 'up-next' | 'locked'
  isVerified = false,
  isSelected = false,
  onSelect,
  index = 1,
}) {
  const theme = STAGE_THEMES[skill.stage] || STAGE_THEMES.Foundational

  const isCompleted = status === 'completed'
  const isInProgress = status === 'in-progress'
  const isUpNext = status === 'up-next'
  const isLocked = status === 'locked'

  // Status configuration
  const statusConfig = {
    completed: {
      label: 'Completed',
      icon: <CheckCircle2 size={16} color="var(--accent-green)" />,
      badgeBg: 'rgba(104, 211, 145, 0.15)',
      badgeColor: 'var(--accent-green)',
      borderColor: 'rgba(104, 211, 145, 0.4)',
    },
    'in-progress': {
      label: 'In Progress',
      icon: <PlayCircle size={16} color="var(--accent-blue)" className="animate-spin-slow" />,
      badgeBg: 'rgba(99, 179, 237, 0.18)',
      badgeColor: 'var(--accent-blue)',
      borderColor: 'var(--accent-blue)',
    },
    'up-next': {
      label: 'Up Next',
      icon: <ArrowRightCircle size={16} color="var(--accent-purple)" />,
      badgeBg: 'rgba(183, 148, 244, 0.15)',
      badgeColor: 'var(--accent-purple)',
      borderColor: 'rgba(183, 148, 244, 0.35)',
    },
    locked: {
      label: 'Locked',
      icon: <Lock size={15} color="var(--text-muted)" />,
      badgeBg: 'rgba(255, 255, 255, 0.05)',
      badgeColor: 'var(--text-muted)',
      borderColor: 'var(--border-subtle)',
    },
  }[status] || {
    label: 'Up Next',
    icon: <ArrowRightCircle size={16} />,
    badgeBg: 'rgba(255,255,255,0.05)',
    badgeColor: 'var(--text-secondary)',
    borderColor: 'var(--border-subtle)',
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      aria-label={`${skill.skill}, status ${statusConfig.label}, difficulty ${theme.badge}`}
      aria-expanded={isSelected}
      className={`roadmap-node-card ${isInProgress ? 'node-pulse' : ''}`}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '1.25rem 1.4rem',
        borderRadius: 'var(--radius-md)',
        background: isSelected
          ? 'rgba(255, 255, 255, 0.08)'
          : isInProgress
          ? 'rgba(99, 179, 237, 0.06)'
          : isCompleted
          ? 'rgba(104, 211, 145, 0.04)'
          : isLocked
          ? 'rgba(255, 255, 255, 0.02)'
          : 'var(--bg-card)',
        border: `1.5px solid ${isSelected ? theme.accent : statusConfig.borderColor}`,
        boxShadow: isInProgress
          ? '0 0 24px rgba(99, 179, 237, 0.25)'
          : isSelected
          ? `0 0 20px ${theme.borderActive}`
          : 'none',
        opacity: isLocked ? 0.65 : 1,
        cursor: 'pointer',
        transition: 'var(--transition)',
        outline: 'none',
        userSelect: 'none',
      }}
    >
      {/* Active step glowing indicator bar */}
      {isInProgress && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'var(--gradient-hero)',
          borderTopLeftRadius: 'var(--radius-md)',
          borderTopRightRadius: 'var(--radius-md)',
        }} />
      )}

      {/* Top row: Sequence Index, Status, Difficulty */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: isCompleted
              ? 'var(--accent-green)'
              : isInProgress
              ? 'var(--accent-blue)'
              : 'rgba(255, 255, 255, 0.08)',
            color: isCompleted || isInProgress ? '#080b14' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 800,
          }}>
            {index}
          </span>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.6rem',
            borderRadius: 999,
            fontSize: '0.72rem',
            fontWeight: 600,
            background: statusConfig.badgeBg,
            color: statusConfig.badgeColor,
            border: `1px solid ${statusConfig.badgeColor}33`,
          }}>
            {statusConfig.icon}
            {statusConfig.label}
          </span>

          {isVerified && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.2rem 0.5rem',
                borderRadius: 999,
                fontSize: '0.7rem',
                fontWeight: 700,
                background: 'rgba(72, 187, 120, 0.15)',
                color: 'var(--accent-green)',
                border: '1px solid rgba(72, 187, 120, 0.4)',
              }}
              title="Skill Verified via Assessment Quiz"
            >
              <ShieldCheck size={12} />
              Verified ✓
            </span>
          )}
        </div>

        <span className={`badge ${theme.badgeClass}`}>
          {theme.badge}
        </span>
      </div>

      {/* Middle row: Skill Title & Impact Score */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
          <h4 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            fontWeight: 700,
            color: isLocked ? 'var(--text-secondary)' : 'var(--text-primary)',
            letterSpacing: '-0.01em',
            margin: 0,
          }}>
            {skill.skill}
          </h4>

          {typeof skill.weight === 'number' && (
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--accent-orange)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              {(skill.weight * 100).toFixed(0)}% weight
            </span>
          )}
        </div>

        <p style={{
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          marginTop: '0.35rem',
          lineHeight: 1.45,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {skill.description || skill.reason}
        </p>
      </div>

      {/* Bottom meta row: Estimated time & View Details prompt */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '0.65rem',
        marginTop: '0.2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={14} color="var(--accent-blue)" />
          <span>{skill.hours ? `${skill.hours} hrs · ` : ''}{skill.weeks || '1-2 weeks'}</span>
        </div>

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          color: isSelected ? theme.accent : 'var(--text-secondary)',
          fontWeight: 600,
          fontSize: '0.75rem',
        }}>
          {isSelected ? 'Viewing' : 'Inspect'}
          <Sparkles size={13} />
        </span>
      </div>
    </div>
  )
}
