export default function StatCard({
  title,
  value,
  subtext,
  icon,
  accentColor = 'var(--accent-blue)',
  trend = null,
}) {
  return (
    <div
      className="glass-card stat-card"
      style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.75rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'var(--transition)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accentColor
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
        e.currentTarget.style.boxShadow = `0 8px 24px -6px ${accentColor}33`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)'
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Background accent glow top line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: accentColor,
        opacity: 0.6,
      }} />

      {/* Top Header: Title & Icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <span style={{
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {title}
        </span>

        <div style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: `${accentColor}18`,
          border: `1px solid ${accentColor}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}>
          {value}
        </div>

        {subtext && (
          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            marginTop: '0.35rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  )
}
