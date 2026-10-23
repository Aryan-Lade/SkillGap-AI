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
          <div className="pill-badge pill-badge-lime" style={{ marginBottom: '0.65rem' }}>
            <Target size={14} />
            Target Career Path
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.85rem',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: '#131311',
          }}>
            {targetRole} Learning Roadmap
          </h2>
          <p style={{ color: '#52524e', fontSize: '0.92rem', marginTop: '0.25rem' }}>
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
            background: '#ffffff',
            border: '1.5px solid #131311',
            boxShadow: '2px 2px 0px #131311',
            borderRadius: '8px',
            padding: '0.55rem 0.95rem',
          }}>
            <Layers size={17} color="#131311" />
            <div style={{ fontSize: '0.82rem' }}>
              <span style={{ color: '#80807c', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Skills</span>
              <strong style={{ color: '#131311', fontWeight: 900, fontSize: '1rem' }}>{totalSkills}</strong>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--accent-lime-subtle)',
            border: '1.5px solid #131311',
            boxShadow: '2px 2px 0px #131311',
            borderRadius: '8px',
            padding: '0.55rem 0.95rem',
          }}>
            <CheckCircle2 size={17} color="#131311" />
            <div style={{ fontSize: '0.82rem' }}>
              <span style={{ color: '#131311', display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Completed</span>
              <strong style={{ color: '#131311', fontWeight: 900, fontSize: '1rem' }}>{completedCount}</strong>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#ffffff',
            border: '1.5px solid #131311',
            boxShadow: '2px 2px 0px #131311',
            borderRadius: '8px',
            padding: '0.55rem 0.95rem',
          }}>
            <Flame size={17} color="#ff7660" />
            <div style={{ fontSize: '0.82rem' }}>
              <span style={{ color: '#80807c', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Remaining</span>
              <strong style={{ color: '#131311', fontWeight: 900, fontSize: '1rem' }}>{remainingCount}</strong>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#ffffff',
            border: '1.5px solid #131311',
            boxShadow: '2px 2px 0px #131311',
            borderRadius: '8px',
            padding: '0.55rem 0.95rem',
          }}>
            <Clock size={17} color="#131311" />
            <div style={{ fontSize: '0.82rem' }}>
              <span style={{ color: '#80807c', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Timeline</span>
              <strong style={{ color: '#131311', fontWeight: 900, fontSize: '0.95rem' }}>{estimatedWeeks}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '5px',
        background: '#ffffff',
        border: '1.5px solid #131311',
        boxShadow: '2px 2px 0px #131311',
        borderRadius: '10px',
        width: 'fit-content',
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 800,
          color: '#80807c',
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
                background: isActive ? 'var(--accent-lime)' : 'transparent',
                color: '#131311',
                border: isActive ? '1.5px solid #131311' : '1.5px solid transparent',
                borderRadius: '6px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                boxShadow: isActive ? '1.5px 1.5px 0px #131311' : 'none',
                transition: 'all 0.12s ease',
              }}
            >
              <span>{opt.label}</span>
              {typeof opt.count === 'number' && (
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: 999,
                  background: isActive ? '#131311' : 'var(--bg-surface-secondary)',
                  color: isActive ? 'var(--accent-lime)' : '#131311',
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
