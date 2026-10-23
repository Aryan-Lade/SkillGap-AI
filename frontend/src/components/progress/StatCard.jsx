export default function StatCard({
  title,
  value,
  subtext,
  icon,
  accentColor = '#131311',
  trend = null,
}) {
  return (
    <div
      className="neo-card stat-card"
      style={{
        padding: '1.25rem',
        borderRadius: '10px',
        background: '#ffffff',
        border: '1.5px solid #131311',
        boxShadow: '2.5px 2.5px 0px #131311',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.75rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Top Header: Title & Icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <span style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#80807c',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {title}
        </span>

        <div style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: 'var(--accent-lime)',
          border: '1.5px solid #131311',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '1px 1px 0px #131311',
        }}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.85rem',
          fontWeight: 900,
          color: '#131311',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}>
          {value}
        </div>

        {subtext && (
          <div style={{
            fontSize: '0.78rem',
            color: '#52524e',
            fontWeight: 600,
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
