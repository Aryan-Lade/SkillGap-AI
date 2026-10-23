import { CheckCircle2, Circle } from 'lucide-react'

export default function SkillProgressBar({
  skillName,
  percentage = 0,
  stage = 'Foundational',
  weight = 0.5,
  isCompleted = false,
  onToggle = null,
  disabled = false,
}) {
  const pct = Math.max(0, Math.min(100, Math.round(percentage)))

  // Color coding requirement:
  // red <40%, amber 40–75%, green >75%
  const getColor = (val) => {
    if (val > 75) return { color: '#68d391', bg: 'rgba(104, 211, 145, 0.15)', name: 'green' }
    if (val >= 40) return { color: '#f6ad55', bg: 'rgba(246, 173, 85, 0.15)', name: 'amber' }
    return { color: '#fc8181', bg: 'rgba(252, 129, 129, 0.15)', name: 'red' }
  }

  const { color } = getColor(pct)

  const stageBadgeClass = {
    Foundational: 'badge-foundational',
    Intermediate: 'badge-intermediate',
    Applied: 'badge-applied',
  }[stage] || 'badge-foundational'

  return (
    <div
      style={{
        padding: '0.85rem 1rem',
        borderRadius: 'var(--radius-sm)',
        background: isCompleted ? 'rgba(104, 211, 145, 0.05)' : 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${isCompleted ? 'rgba(104, 211, 145, 0.25)' : 'var(--border-subtle)'}`,
        transition: 'var(--transition)',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem',
        marginBottom: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
          {onToggle && (
            <button
              onClick={onToggle}
              disabled={disabled}
              aria-label={`Toggle completion for ${skillName}`}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: isCompleted ? 'var(--accent-green)' : 'var(--text-muted)',
                transition: 'var(--transition)',
              }}
            >
              {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            </button>
          )}

          <span style={{
            fontSize: '0.88rem',
            fontWeight: 600,
            color: isCompleted ? 'var(--accent-green)' : 'var(--text-primary)',
            textDecoration: isCompleted ? 'line-through' : 'none',
            opacity: isCompleted ? 0.9 : 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {skillName}
          </span>

          <span className={`badge ${stageBadgeClass}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.5rem' }}>
            {stage}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          {typeof weight === 'number' && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {(weight * 100).toFixed(0)}% impact
            </span>
          )}
          <span style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color,
            minWidth: '38px',
            textAlign: 'right',
          }}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skillName} completion: ${pct}%`}
        className="progress-bar-track"
        style={{ height: 7 }}
      >
        <div
          className="progress-bar-fill"
          style={{
            width: `${pct}%`,
            background: isCompleted ? 'var(--accent-green)' : color,
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  )
}
