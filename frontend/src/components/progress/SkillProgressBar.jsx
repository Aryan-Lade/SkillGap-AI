import { CheckCircle2, Circle, ShieldCheck } from 'lucide-react'

export default function SkillProgressBar({
  skillName,
  percentage = 0,
  stage = 'Foundational',
  weight = 0.5,
  isCompleted = false,
  isVerified = false,
  onToggle = null,
  disabled = false,
}) {
  const pct = Math.max(0, Math.min(100, Math.round(percentage)))

  const stageBadgeClass = {
    Foundational: 'badge-foundational',
    Intermediate: 'badge-intermediate',
    Applied: 'badge-applied',
  }[stage] || 'badge-foundational'

  return (
    <div
      style={{
        padding: '0.9rem 1.1rem',
        borderRadius: '8px',
        background: isCompleted ? 'var(--accent-lime-subtle)' : '#ffffff',
        border: '1.5px solid #131311',
        boxShadow: isCompleted ? '2px 2px 0px #131311' : '1.5px 1.5px 0px #131311',
        transition: 'all 0.12s ease',
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
                color: '#131311',
                transition: 'transform 0.1s ease',
              }}
            >
              {isCompleted ? (
                <CheckCircle2 size={18} fill="var(--accent-lime)" color="#131311" />
              ) : (
                <Circle size={18} color="#80807c" />
              )}
            </button>
          )}

          <span style={{
            fontSize: '0.9rem',
            fontWeight: 800,
            color: '#131311',
            textDecoration: isCompleted ? 'line-through' : 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {skillName}
          </span>

          {isVerified && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: 999,
                background: 'var(--accent-lime)',
                border: '1px solid #131311',
                color: '#131311',
              }}
              title="Verified via assessment quiz"
            >
              <ShieldCheck size={11} />
              Verified
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
          <span className={`badge ${stageBadgeClass}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
            {stage}
          </span>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 900,
            color: '#131311',
            minWidth: 32,
            textAlign: 'right',
          }}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="progress-bar-track" style={{ height: 8 }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${pct}%`,
            background: isCompleted ? 'var(--accent-lime)' : '#131311',
          }}
        />
      </div>
    </div>
  )
}
