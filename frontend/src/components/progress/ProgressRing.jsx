import { useMemo } from 'react'

export default function ProgressRing({
  percentage = 0,
  size = 190,
  strokeWidth = 14,
  label = 'Overall Mastery',
}) {
  const pct = Math.max(0, Math.min(100, Math.round(percentage)))

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (pct / 100) * circumference

  // Dynamic gradient and status color
  const { motivationalText, emoji } = useMemo(() => {
    if (pct >= 85) {
      return {
        motivationalText: 'Career Ready · Outstanding!',
        emoji: '🚀',
      }
    }
    if (pct >= 70) {
      return {
        motivationalText: 'Nearing Target Readiness',
        emoji: '⚡',
      }
    }
    if (pct >= 40) {
      return {
        motivationalText: 'Building Strong Momentum',
        emoji: '🔥',
      }
    }
    if (pct > 0) {
      return {
        motivationalText: 'Great Start · Keep Going',
        emoji: '🌱',
      }
    }
    return {
      motivationalText: 'Ready to Start Journey',
      emoji: '🎯',
    }
  }, [pct])

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label}: ${pct}% completed`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#eae9e0"
            strokeWidth={strokeWidth}
          />

          {/* Animated Progress Fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--accent-lime)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <span style={{ fontSize: '1.25rem', marginBottom: '-0.1rem' }}>{emoji}</span>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.5rem',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: '#131311',
          }}>
            {pct}%
          </div>
          <span style={{
            fontSize: '0.72rem',
            color: '#52524e',
            fontWeight: 700,
            marginTop: '0.25rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            {label}
          </span>
        </div>
      </div>

      <div style={{
        marginTop: '0.75rem',
        fontSize: '0.84rem',
        fontWeight: 700,
        color: '#131311',
      }}>
        {motivationalText}
      </div>
    </div>
  )
}
