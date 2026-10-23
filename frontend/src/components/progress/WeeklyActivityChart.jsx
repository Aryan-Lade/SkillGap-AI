import { useState } from 'react'
import { Calendar, TrendingUp } from 'lucide-react'

export default function WeeklyActivityChart({ completedSkillsCount = 0 }) {
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1 // 0=Mon, 6=Sun

  const baseHours = [
    2.5,
    3.0,
    1.5,
    4.0,
    3.5,
    5.0,
    completedSkillsCount > 0 ? 3.0 : 1.0,
  ]

  const scale = Math.max(0.7, Math.min(2.0, 0.8 + completedSkillsCount * 0.15))
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const activityData = days.map((day, i) => {
    const val = Number((baseHours[i] * scale).toFixed(1))
    return {
      day,
      hours: i <= todayIdx ? val : Number((val * 0.4).toFixed(1)),
      isToday: i === todayIdx,
    }
  })

  const [hoveredDay, setHoveredDay] = useState(null)

  const maxHours = Math.max(...activityData.map((d) => d.hours), 5)
  const totalWeeklyHours = activityData.reduce((acc, d) => acc + d.hours, 0).toFixed(1)
  const dailyAverage = (totalWeeklyHours / 7).toFixed(1)

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.92rem', fontWeight: 800, color: '#131311' }}>
            <Calendar size={16} />
            Weekly Learning Activity
          </div>
          <span style={{ fontSize: '0.78rem', color: '#80807c' }}>
            Estimated study investment over the past 7 days
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#131311', fontFamily: 'var(--font-display)' }}>
            {totalWeeklyHours} hrs
          </div>
          <span style={{ fontSize: '0.72rem', color: '#52524e', fontWeight: 700 }}>
            Avg {dailyAverage}h / day
          </span>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '0.5rem',
        height: 120,
        paddingTop: '1rem',
        borderBottom: '1.5px solid #131311',
        paddingBottom: '0.5rem',
        position: 'relative',
      }}>
        {activityData.map((d) => {
          const heightPct = Math.round((d.hours / maxHours) * 100)
          const isHovered = hoveredDay === d.day

          return (
            <div
              key={d.day}
              onMouseEnter={() => setHoveredDay(d.day)}
              onMouseLeave={() => setHoveredDay(null)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  top: -28,
                  background: '#131311',
                  border: '1px solid #131311',
                  borderRadius: 4,
                  padding: '0.15rem 0.45rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--accent-lime)',
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                  boxShadow: '1.5px 1.5px 0px #131311',
                }}>
                  {d.hours} hrs
                </div>
              )}

              {/* Bar Fill */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 28,
                  height: `${heightPct}%`,
                  minHeight: 8,
                  borderRadius: '4px 4px 0 0',
                  background: d.isToday
                    ? 'var(--accent-lime)'
                    : isHovered
                    ? '#d6d5cb'
                    : '#eae9e0',
                  border: '1.5px solid #131311',
                  borderBottom: 'none',
                  boxShadow: d.isToday ? '1px -1px 0px #131311' : 'none',
                  transition: 'height 0.3s ease, background 0.15s',
                }}
              />
            </div>
          )
        })}
      </div>

      {/* X-Axis Day Labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '0.5rem',
        padding: '0 0.25rem',
      }}>
        {activityData.map((d) => (
          <span
            key={d.day}
            style={{
              fontSize: '0.72rem',
              fontWeight: d.isToday ? 800 : 600,
              color: d.isToday ? '#131311' : '#80807c',
              textAlign: 'center',
              flex: 1,
            }}
          >
            {d.day}
          </span>
        ))}
      </div>
    </div>
  )
}
