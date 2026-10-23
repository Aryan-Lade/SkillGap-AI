import { useMemo } from 'react'
import { Target, CheckCircle2 } from 'lucide-react'

export default function SkillGapComparison({
  completedCount = 0,
  totalCount = 1,
  matchPercentage = 50,
  stages = { Foundational: 0, Intermediate: 0, Applied: 0 },
  stageTotals = { Foundational: 1, Intermediate: 1, Applied: 1 },
}) {
  // Dimensions for skill competency radar comparison
  // 1. Fundamentals
  // 2. Frameworks & Libs
  // 3. Systems & Cloud
  // 4. Architecture & Delivery
  const dimensions = useMemo(() => {
    const fRatio = (stages.Foundational || 0) / Math.max(stageTotals.Foundational || 1, 1)
    const iRatio = (stages.Intermediate || 0) / Math.max(stageTotals.Intermediate || 1, 1)
    const aRatio = (stages.Applied || 0) / Math.max(stageTotals.Applied || 1, 1)
    const overallRatio = completedCount / Math.max(totalCount || 1, 1)

    // Baseline minimum is 20% so user has visible baseline before completing
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

  // Radar geometry calculations
  const size = 260
  const center = size / 2
  const maxRadius = 90
  const angleStep = (2 * Math.PI) / dimensions.length

  // Generate polygon points
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
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            <Target size={16} color="var(--accent-green)" />
            Skill Gap Closed vs Target
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Current capability versus industry job role requirement
          </span>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: '0.2rem 0.65rem',
          borderRadius: 999,
          background: 'rgba(104, 211, 145, 0.12)',
          border: '1px solid rgba(104, 211, 145, 0.3)',
          color: 'var(--accent-green)',
          fontSize: '0.8rem',
          fontWeight: 700,
        }}>
          {avgClosedPct}% Closed
        </div>
      </div>

      {/* SVG Radar Chart */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0.5rem 0' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
          <defs>
            <radialGradient id="currentAreaGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#68d391" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#63b3ed" stopOpacity="0.2" />
            </radialGradient>
          </defs>

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
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
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
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            )
          })}

          {/* Target Requirement Polygon (Dashed Purple/White) */}
          <polygon
            points={requiredPolygon}
            fill="rgba(183, 148, 244, 0.06)"
            stroke="rgba(183, 148, 244, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />

          {/* Current Level Polygon (Glowing Gradient Fill) */}
          <polygon
            points={currentPolygon}
            fill="url(#currentAreaGrad)"
            stroke="#68d391"
            strokeWidth="2"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(104, 211, 145, 0.4))',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
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
                r="3.5"
                fill="#68d391"
                stroke="#080b14"
                strokeWidth="1.5"
                style={{ transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
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
                fill="var(--text-secondary)"
                fontSize="9px"
                fontWeight="600"
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
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '0.75rem',
        fontSize: '0.78rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-green)' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#68d391', boxShadow: '0 0 6px rgba(104,211,145,0.6)' }} />
          <span>Your Current Level</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-purple)' }}>
          <span style={{ width: 12, height: 2, background: 'var(--accent-purple)' }} />
          <span>Required Role Level</span>
        </div>
      </div>
    </div>
  )
}
