export function RoadmapSkeleton() {
  return (
    <div
      className="glass-card"
      style={{
        padding: '2.25rem',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Header skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="skeleton-box" style={{ width: 140, height: 24, borderRadius: 999, marginBottom: '0.75rem' }} />
          <div className="skeleton-box" style={{ width: 280, height: 36, borderRadius: 8, marginBottom: '0.5rem' }} />
          <div className="skeleton-box" style={{ width: 400, height: 18, borderRadius: 6 }} />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="skeleton-box" style={{ width: 90, height: 48, borderRadius: 10 }} />
          <div className="skeleton-box" style={{ width: 90, height: 48, borderRadius: 10 }} />
          <div className="skeleton-box" style={{ width: 90, height: 48, borderRadius: 10 }} />
        </div>
      </div>

      {/* Phase banner skeleton */}
      <div className="skeleton-box" style={{ width: '100%', height: 50, borderRadius: 12, marginBottom: '1.5rem' }} />

      {/* Nodes grid skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="skeleton-box"
            style={{
              height: 140,
              borderRadius: 14,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function ProgressTrackerSkeleton() {
  return (
    <div
      className="glass-card"
      style={{
        padding: '2.25rem',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <div className="skeleton-box" style={{ width: 160, height: 24, borderRadius: 999, marginBottom: '0.75rem' }} />
          <div className="skeleton-box" style={{ width: 320, height: 36, borderRadius: 8 }} />
        </div>
        <div className="skeleton-box" style={{ width: 130, height: 36, borderRadius: 999 }} />
      </div>

      {/* Ring and stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="skeleton-box" style={{ height: 200, borderRadius: 16 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-box" style={{ height: 95, borderRadius: 12 }} />
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="skeleton-box" style={{ height: 220, borderRadius: 14 }} />
        <div className="skeleton-box" style={{ height: 220, borderRadius: 14 }} />
      </div>
    </div>
  )
}
