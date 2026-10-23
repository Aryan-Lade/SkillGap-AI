import { CheckCircle2, PlayCircle, ArrowRightCircle, Lock, Clock, Sparkles, ShieldCheck } from 'lucide-react'

const STAGE_THEMES = {
  Foundational: {
    badge: 'Beginner',
    badgeClass: 'badge-foundational',
    accent: '#0b4949',
  },
  Intermediate: {
    badge: 'Intermediate',
    badgeClass: 'badge-intermediate',
    accent: '#2b4800',
  },
  Applied: {
    badge: 'Advanced',
    badgeClass: 'badge-applied',
    accent: '#8c1b09',
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
      icon: <CheckCircle2 size={15} color="#131311" />,
      badgeBg: 'var(--accent-lime-subtle)',
      badgeColor: '#131311',
    },
    'in-progress': {
      label: 'In Progress',
      icon: <PlayCircle size={15} color="#131311" />,
      badgeBg: 'var(--accent-lime)',
      badgeColor: '#131311',
    },
    'up-next': {
      label: 'Up Next',
      icon: <ArrowRightCircle size={15} color="#52524e" />,
      badgeBg: 'var(--bg-surface-secondary)',
      badgeColor: '#52524e',
    },
    locked: {
      label: 'Locked',
      icon: <Lock size={14} color="#80807c" />,
      badgeBg: '#f3f2ea',
      badgeColor: '#80807c',
    },
  }[status] || {
    label: 'Up Next',
    icon: <ArrowRightCircle size={15} />,
    badgeBg: '#f3f2ea',
    badgeColor: '#52524e',
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
        borderRadius: '10px',
        background: isSelected
          ? 'var(--accent-lime-subtle)'
          : isInProgress
          ? '#ffffff'
          : isCompleted
          ? '#fafaf7'
          : '#ffffff',
        border: '1.5px solid #131311',
        boxShadow: isSelected
          ? '4px 4px 0px #131311'
          : isInProgress
          ? '3px 3px 0px var(--accent-lime)'
          : '2px 2px 0px #131311',
        transform: isSelected ? 'translate(-2px, -2px)' : 'none',
        opacity: isLocked ? 0.75 : 1,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
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
          height: '4px',
          background: 'var(--accent-lime)',
          borderTopLeftRadius: '9px',
          borderTopRightRadius: '9px',
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
              ? 'var(--accent-lime)'
              : isInProgress
              ? '#131311'
              : 'var(--bg-surface-secondary)',
            color: isInProgress ? '#ffffff' : '#131311',
            border: '1.5px solid #131311',
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
            fontWeight: 700,
            background: statusConfig.badgeBg,
            color: statusConfig.badgeColor,
            border: '1px solid #131311',
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
                fontWeight: 800,
                background: 'var(--accent-lime)',
                color: '#131311',
                border: '1px solid #131311',
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
            fontWeight: 800,
            color: '#131311',
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            {skill.skill}
          </h4>

          {typeof skill.weight === 'number' && (
            <span style={{
              fontSize: '0.75rem',
              color: '#131311',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '4px',
              background: 'var(--accent-lime-subtle)',
              border: '1px solid #131311',
              whiteSpace: 'nowrap',
            }}>
              {(skill.weight * 100).toFixed(0)}% weight
            </span>
          )}
        </div>

        <p style={{
          fontSize: '0.82rem',
          color: '#52524e',
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
        color: '#52524e',
        borderTop: '1px solid #131311',
        paddingTop: '0.65rem',
        marginTop: '0.2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={14} color="#131311" />
          <span style={{ fontWeight: 600 }}>{skill.hours ? `${skill.hours} hrs · ` : ''}{skill.weeks || '1-2 weeks'}</span>
        </div>

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          color: '#131311',
          fontWeight: 800,
          fontSize: '0.75rem',
        }}>
          {isSelected ? 'Viewing' : 'Inspect'}
          <Sparkles size={13} fill="#131311" />
        </span>
      </div>
    </div>
  )
}
