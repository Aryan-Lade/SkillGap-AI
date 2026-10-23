import { Target, Clock, CheckCircle2, Flame, Layers } from 'lucide-react'

export default function RoadmapHeader({
  targetRole = 'Target Role',
  totalSkills = 0,
  completedCount = 0,
  estimatedWeeks = '8-12 weeks',
  filter = 'all',
  onFilterChange,
}) {
  const remainingCount = Math.max(0, totalSkills - completedCount)

  const filterOptions = [
    { id: 'all', label: 'All Skills', count: totalSkills },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'up-next', label: 'Up Next' },
    { id: 'completed', label: 'Completed', count: completedCount },
  ]

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Top Title & Role Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: 999,
            background: 'rgba(99, 179, 237, 0.12)',
            border: '1px solid rgba(99, 179, 237, 0.25)',
            color: 'var(--accent-blue)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
          }}>
            <Target size={14} />
            Target Career Path
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}>
            {targetRole} Learning Roadmap
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Structured phase-by-phase progression optimized by skill importance and industry hiring demand.
          </p>
        </div>

        {/* Highlight Stats Strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 0.85rem',
          }}>
            <Layers size={16} color="var(--accent-blue)" />
            <div style={{ fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Total Skills</span>
              <strong style={{ color: 'var(--text-primary)' }}>{totalSkills}</strong>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 0.85rem',
          }}>
            <CheckCircle2 size={16} color="var(--accent-green)" />
            <div style={{ fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Completed</span>
              <strong style={{ color: 'var(--accent-green)' }}>{completedCount}</strong>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 0.85rem',
          }}>
            <Flame size={16} color="var(--accent-orange)" />
            <div style={{ fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Remaining</span>
              <strong style={{ color: 'var(--accent-orange)' }}>{remainingCount}</strong>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 0.85rem',
          }}>
            <Clock size={16} color="var(--accent-purple)" />
            <div style={{ fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Est. Timeline</span>
              <strong style={{ color: 'var(--text-primary)' }}>{estimatedWeeks}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.35rem',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        width: 'fit-content',
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '0 0.5rem',
        }}>
          Filter:
        </span>
        {filterOptions.map((opt) => {
          const isActive = filter === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => onFilterChange(opt.id)}
              style={{
                background: isActive ? 'var(--gradient-hero)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: isActive ? 600 : 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <span>{opt.label}</span>
              {typeof opt.count === 'number' && (
                <span style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: 999,
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                }}>
                  {opt.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
