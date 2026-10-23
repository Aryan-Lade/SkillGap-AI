import { useMemo } from 'react'
import { Target } from 'lucide-react'

export default function SkillGapComparison({
  completedCount = 0,
  totalCount = 1,
  matchPercentage = 50,
  stages = { Foundational: 0, Intermediate: 0, Applied: 0 },
  stageTotals = { Foundational: 1, Intermediate: 1, Applied: 1 },
}) {
  const dimensions = useMemo(() => {
    const fRatio = (stages.Foundational || 0) / Math.max(stageTotals.Foundational || 1, 1)
    const iRatio = (stages.Intermediate || 0) / Math.max(stageTotals.Intermediate || 1, 1)
    const aRatio = (stages.Applied || 0) / Math.max(stageTotals.Applied || 1, 1)
    const overallRatio = completedCount / Math.max(totalCount || 1, 1)

    const base = Math.min(45, (matchPercentage || 50) * 0.45)

    return [
      {
        name: 'Foundations',
        required: 100,
        current: Math.round(base + fRatio * (100 - base)),
      },
      {
        name: 'Frameworks',
        required: 95,
        current: Math.round(base * 0.8 + iRatio * (95 - base * 0.8)),
      },
      {
        name: 'Architecture',
        required: 90,
        current: Math.round(base * 0.6 + ((iRatio + aRatio) / 2) * (90 - base * 0.6)),
      },
      {
        name: 'Production & Cloud',
        required: 85,
        current: Math.round(base * 0.5 + aRatio * (85 - base * 0.5)),
      },
      {
        name: 'Role Fit',
        required: 100,
        current: Math.min(100, Math.round(matchPercentage + overallRatio * (100 - matchPercentage))),
      },
    ]
  }, [completedCount, totalCount, matchPercentage, stages, stageTotals])

  const size = 260
  const center = size / 2
  const maxRadius = 90
  const angleStep = (2 * Math.PI) / dimensions.length

  const getCoordinates = (value, angle) => {
    const r = (value / 100) * maxRadius
    const x = center + r * Math.sin(angle)
    const y = center - r * Math.cos(angle)
    return { x, y }
  }

  const requiredPolygon = dimensions
    .map((d, i) => {
      const coord = getCoordinates(d.required, i * angleStep)
      return `${coord.x.toFixed(1)},${coord.y.toFixed(1)}`
    })
    .join(' ')

  const currentPolygon = dimensions
    .map((d, i) => {
      const coord = getCoordinates(d.current, i * angleStep)
      return `${coord.x.toFixed(1)},${coord.y.toFixed(1)}`
    })
    .join(' ')

  const avgClosedPct = Math.round(
    dimensions.reduce((acc, d) => acc + (d.current / d.required) * 100, 0) / dimensions.length
  )

  return (
    <div
      style={{
        padding: '1.4rem',
        borderRadius: '10px',
        background: '#ffffff',
        border: '1.5px solid #131311',
        boxShadow: '2.5px 2.5px 0px #131311',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.92rem', fontWeight: 800, color: '#131311' }}>
            <Target size={16} />
            Skill Gap Closed vs Target
          </div>
          <span style={{ fontSize: '0.78rem', color: '#80807c' }}>
            Current capability versus industry requirement
          </span>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: '0.2rem 0.65rem',
          borderRadius: 999,
          background: 'var(--accent-lime)',
          border: '1px solid #131311',
          color: '#131311',
          fontSize: '0.8rem',
          fontWeight: 800,
          boxShadow: '1px 1px 0px #131311',
        }}>
          {avgClosedPct}% Closed
        </div>
      </div>

      {/* SVG Radar Chart */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0.5rem 0' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
          {/* Web grid rings (25%, 50%, 75%, 100%) */}
          {[0.25, 0.5, 0.75, 1.0].map((ringLevel) => {
            const ringPts = dimensions
              .map((_, i) => {
                const coord = getCoordinates(100 * ringLevel, i * angleStep)
                return `${coord.x.toFixed(1)},${coord.y.toFixed(1)}`
              })
              .join(' ')
            return (
              <polygon
                key={ringLevel}
                points={ringPts}
                fill="none"
                stroke="#e5e4dc"
                strokeWidth="1.2"
              />
            )
          })}

          {/* Axis Spokes from center to perimeter */}
          {dimensions.map((d, i) => {
            const coord = getCoordinates(100, i * angleStep)
            return (
              <line
                key={d.name}
                x1={center}
                y1={center}
                x2={coord.x}
                y2={coord.y}
                stroke="#e5e4dc"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            )
          })}

          {/* Target Requirement Polygon (Dashed Charcoal) */}
          <polygon
            points={requiredPolygon}
            fill="none"
            stroke="#80807c"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />

          {/* Current Level Polygon (Lime Fill with Crisp Border) */}
          <polygon
            points={currentPolygon}
            fill="rgba(198, 253, 80, 0.45)"
            stroke="#131311"
            strokeWidth="2"
            style={{
              transition: 'all 0.5s ease',
            }}
          />

          {/* Vertex dots for current values */}
          {dimensions.map((d, i) => {
            const coord = getCoordinates(d.current, i * angleStep)
            return (
              <circle
                key={d.name}
                cx={coord.x}
                cy={coord.y}
                r="4"
                fill="var(--accent-lime)"
                stroke="#131311"
                strokeWidth="1.5"
              />
            )
          })}

          {/* Axis Labels outside chart */}
          {dimensions.map((d, i) => {
            const coord = getCoordinates(118, i * angleStep)
            return (
              <text
                key={d.name}
                x={coord.x}
                y={coord.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#131311"
                fontSize="9px"
                fontWeight="800"
              >
                {d.name}
              </text>
            )
          })}
        </svg>
      </div>

      {/* Legend & Summary */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        marginTop: '0.75rem',
        borderTop: '1.5px solid #131311',
        paddingTop: '0.75rem',
        fontSize: '0.78rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#131311', fontWeight: 700 }}>
          <span style={{ width: 12, height: 12, borderRadius: '3px', background: 'var(--accent-lime)', border: '1px solid #131311' }} />
          <span>Your Current Level</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#80807c', fontWeight: 600 }}>
          <span style={{ width: 14, height: 2, background: '#80807c', borderTop: '1px dashed #80807c' }} />
          <span>Target Required Level</span>
        </div>
      </div>
    </div>
  )
}
