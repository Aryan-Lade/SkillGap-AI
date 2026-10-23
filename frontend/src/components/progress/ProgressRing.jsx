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
  const { strokeColor, glowColor, motivationalText, emoji } = useMemo(() => {
    if (pct >= 85) {
      return {
        strokeColor: '#68d391',
        glowColor: 'rgba(104, 211, 145, 0.4)',
        motivationalText: 'Career Ready · Outstanding!',
        emoji: '🚀',
      }
    }
    if (pct >= 70) {
      return {
        strokeColor: '#4fd1c5',
        glowColor: 'rgba(79, 209, 197, 0.35)',
        motivationalText: 'Nearing Target Readiness',
        emoji: '⚡',
      }
    }
    if (pct >= 40) {
      return {
        strokeColor: '#f6ad55',
        glowColor: 'rgba(246, 173, 85, 0.35)',
        motivationalText: 'Building Strong Momentum',
        emoji: '🔥',
      }
    }
    if (pct > 0) {
      return {
        strokeColor: '#63b3ed',
        glowColor: 'rgba(99, 179, 237, 0.35)',
        motivationalText: 'Great Start · Keep Going',
        emoji: '🌱',
      }
    }
    return {
      strokeColor: '#63b3ed',
      glowColor: 'rgba(99, 179, 237, 0.2)',
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
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="ringProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="60%" stopColor={strokeColor} />
              <stop offset="100%" stopColor={strokeColor} />
            </linearGradient>
            <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={strokeColor} floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth={strokeWidth}
          />

          {/* Animated Progress Fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="url(#ringProgressGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#ringGlow)"
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
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: 'var(--text-primary)',
          }}>
            {pct}%
          </div>
          <span style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: '0.2rem',
          }}>
            {label}
          </span>
        </div>
      </div>

      {/* Motivational Label Badge */}
      <div style={{
        marginTop: '0.85rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.3rem 0.85rem',
        borderRadius: 999,
        background: glowColor,
        border: `1px solid ${strokeColor}44`,
        color: strokeColor,
        fontSize: '0.82rem',
        fontWeight: 600,
      }}>
        {motivationalText}
      </div>
    </div>
  )
}
