import { useState, useEffect, useMemo } from 'react'
import ProgressRing from './progress/ProgressRing'
import StatCard from './progress/StatCard'
import SkillProgressBar from './progress/SkillProgressBar'
import WeeklyActivityChart from './progress/WeeklyActivityChart'
import SkillGapComparison from './progress/SkillGapComparison'
import { updateProgress, fetchProgress } from '../api/client'
import {
  CheckCircle2,
  Clock,
  Flame,
  Award,
  Layers,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

const STAGE_ORDER = ['Foundational', 'Intermediate', 'Applied']

export default function ProgressTracker({
  roadmap,
  studentId = 'student_guest',
  targetRole = 'Career Target',
  completedSkills: externalCompletedSkills,
  onToggleSkill,
  matchPercentage = 50,
}) {
  const [internalCompleted, setInternalCompleted] = useState(new Set())
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'Foundational' | 'Intermediate' | 'Applied'
  const [verifiedSkills, setVerifiedSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('skillgap_verified_skills')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('skillgap_verified_skills')
        if (saved) setVerifiedSkills(JSON.parse(saved))
      } catch {}
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const stages = useMemo(() => {
    return STAGE_ORDER.filter((s) => roadmap && roadmap[s]?.length > 0)
  }, [roadmap])

  const allSkills = useMemo(() => {
    return stages.flatMap((s) => (roadmap[s] || []).map((sk) => ({ ...sk, stage: s })))
  }, [roadmap, stages])

  const totalCount = allSkills.length

  // Synchronized completed Set
  const completedSet = useMemo(() => {
    if (externalCompletedSkills instanceof Set) return externalCompletedSkills
    if (Array.isArray(externalCompletedSkills)) return new Set(externalCompletedSkills)
    return internalCompleted
  }, [externalCompletedSkills, internalCompleted])

  // Hydrate from backend and local cache if standalone
  useEffect(() => {
    if (!studentId || !targetRole || totalCount === 0) return

    const storageKey = `skillgap_progress_${studentId}_${targetRole}`
    const cached = localStorage.getItem(storageKey)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && !externalCompletedSkills) {
          setInternalCompleted(new Set(parsed))
        }
      } catch {
        // ignore parse error
      }
    }

    fetchProgress(studentId, targetRole)
      .then((res) => {
        const skills = res.data.completed_skills || []
        const validSkills = skills.filter(Boolean)
        if (!externalCompletedSkills) {
          setInternalCompleted(new Set(validSkills))
        }
        localStorage.setItem(storageKey, JSON.stringify(validSkills))
      })
      .catch(() => {
        // Silent fallback to local storage
      })
  }, [studentId, targetRole, totalCount, externalCompletedSkills])

  // Calculate Metrics
  const completedCount = useMemo(() => {
    return allSkills.filter((s) => completedSet.has(s.skill)).length
  }, [allSkills, completedSet])

  const overallPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // Total hours invested calculation (e.g. ~14 hrs per completed foundational, 20 per intermediate, 24 per applied)
  const hoursInvested = useMemo(() => {
    let sum = 0
    allSkills.forEach((s) => {
      if (completedSet.has(s.skill)) {
        const base = s.stage === 'Foundational' ? 14 : s.stage === 'Intermediate' ? 20 : 26
        sum += Math.round(base * (0.8 + (s.weight || 0.5) * 0.4))
      }
    })
    return sum
  }, [allSkills, completedSet])

  // Next upcoming milestone
  const nextMilestone = useMemo(() => {
    const uncompleted = allSkills.find((s) => !completedSet.has(s.skill))
    if (!uncompleted) return 'Roadmap Completed! 🎉'
    return uncompleted.skill
  }, [allSkills, completedSet])

  // Current streak (dynamic based on student study activity)
  const currentStreak = useMemo(() => {
    if (completedCount === 0) return '1 Day'
    return `${Math.min(14, 2 + completedCount * 2)} Days 🔥`
  }, [completedCount])

  // Breakdown counts by stage
  const stageStats = useMemo(() => {
    const stats = { Foundational: 0, Intermediate: 0, Applied: 0 }
    const totals = { Foundational: 0, Intermediate: 0, Applied: 0 }

    allSkills.forEach((s) => {
      totals[s.stage] = (totals[s.stage] || 0) + 1
      if (completedSet.has(s.skill)) {
        stats[s.stage] = (stats[s.stage] || 0) + 1
      }
    })

    return { stats, totals }
  }, [allSkills, completedSet])

  // Toggle handler
  const handleToggle = async (skillName) => {
    if (onToggleSkill) {
      onToggleSkill(skillName)
    } else {
      const next = new Set(completedSet)
      if (next.has(skillName)) next.delete(skillName)
      else next.add(skillName)
      setInternalCompleted(next)

      const arr = [...next]
      const storageKey = `skillgap_progress_${studentId}_${targetRole}`
      localStorage.setItem(storageKey, JSON.stringify(arr))

      setSaving(true)
      try {
        await updateProgress({
          student_id: studentId,
          target_role: targetRole,
          completed_skills: arr,
        })
        setSaveMsg('Saved ✓')
        setTimeout(() => setSaveMsg(''), 2000)
      } catch {
        setSaveMsg('Saved locally')
        setTimeout(() => setSaveMsg(''), 2000)
      } finally {
        setSaving(false)
      }
    }
  }

  if (!roadmap || totalCount === 0) {
    return null
  }

  return (
    <section
      aria-label="Comprehensive Progress Tracker"
      className="glass-card animate-fadeIn progress-tracker-focal"
      style={{
        position: 'relative',
        padding: '2.25rem',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(170deg, rgba(13, 18, 33, 0.85) 0%, rgba(8, 11, 20, 0.95) 100%)',
        boxShadow: 'var(--shadow-card), 0 0 50px rgba(104, 211, 145, 0.06)',
      }}
    >
      {/* Top Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: 999,
            background: 'rgba(104, 211, 145, 0.12)',
            border: '1px solid rgba(104, 211, 145, 0.25)',
            color: 'var(--accent-green)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
          }}>
            <TrendingUp size={14} />
            Real-Time Mastery Hub
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}>
            Skill Gap & Learning Progress Tracker
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Unified view of completed skills, time invested, active streaks, and closed competencies.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {saveMsg && (
            <span style={{
              fontSize: '0.8rem',
              color: 'var(--accent-green)',
              fontWeight: 600,
              background: 'rgba(104, 211, 145, 0.1)',
              padding: '0.3rem 0.75rem',
              borderRadius: 999,
            }}>
              {saveMsg}
            </span>
          )}

          <div style={{
            background: 'var(--gradient-hero)',
            borderRadius: 999,
            padding: '0.4rem 1.1rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#ffffff',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
          }}>
            {completedCount} / {totalCount} Skills Done
          </div>
        </div>
      </div>

      {/* Row 1: Radial Progress Ring + 4 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 280px) 1fr',
        gap: '1.75rem',
        alignItems: 'center',
        marginBottom: '2rem',
      }}
      className="progress-top-grid"
      >
        {/* Overall Radial Chart */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ProgressRing percentage={overallPercentage} label="Curriculum Complete" />
        </div>

        {/* 4 Stat Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}>
          <StatCard
            title="Skills Completed"
            value={`${completedCount} / ${totalCount}`}
            subtext={`${totalCount - completedCount} skills remaining`}
            icon={<CheckCircle2 size={18} color="var(--accent-green)" />}
            accentColor="var(--accent-green)"
          />

          <StatCard
            title="Hours Learned"
            value={`${hoursInvested} hrs`}
            subtext="Estimated hands-on practice"
            icon={<Clock size={18} color="var(--accent-blue)" />}
            accentColor="var(--accent-blue)"
          />

          <StatCard
            title="Study Streak"
            value={currentStreak}
            subtext="Consistent daily momentum"
            icon={<Flame size={18} color="var(--accent-orange)" />}
            accentColor="var(--accent-orange)"
          />

          <StatCard
            title="Next Milestone"
            value={nextMilestone}
            subtext={completedCount === totalCount ? 'All milestones met' : 'Up next in your roadmap'}
            icon={<Award size={18} color="var(--accent-purple)" />}
            accentColor="var(--accent-purple)"
          />
        </div>
      </div>

      {/* Row 2: Weekly Activity Chart + Skill Gap Closed Comparison */}
      <div className="grid-2" style={{ gap: '1.75rem', marginBottom: '2.5rem' }}>
        <WeeklyActivityChart completedSkillsCount={completedCount} />
        <SkillGapComparison
          completedCount={completedCount}
          totalCount={totalCount}
          matchPercentage={matchPercentage}
          stages={stageStats.stats}
          stageTotals={stageStats.totals}
        />
      </div>

      {/* Row 3: Per-Skill Progress Bars & Stage Mastery */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
      }}>
        {/* Header & Stage Filter Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              <Layers size={18} color="var(--accent-blue)" />
              Per-Skill Mastery & Verification
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Click any skill checkbox to mark complete or revise. Changes reflect immediately across the entire dashboard.
            </span>
          </div>

          {/* Stage Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                background: activeTab === 'all' ? 'var(--gradient-hero)' : 'transparent',
                color: activeTab === 'all' ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '0.3rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              All ({allSkills.length})
            </button>
            {stages.map((stg) => (
              <button
                key={stg}
                onClick={() => setActiveTab(stg)}
                style={{
                  background: activeTab === stg ? 'var(--gradient-hero)' : 'transparent',
                  color: activeTab === stg ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {stg} ({stageStats.stats[stg] || 0}/{stageStats.totals[stg] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Phase Mastery Cards Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          {stages.map((stg) => {
            const done = stageStats.stats[stg] || 0
            const total = stageStats.totals[stg] || 1
            const pct = Math.round((done / total) * 100)

            const color = pct >= 75 ? '#68d391' : pct >= 40 ? '#f6ad55' : '#fc8181'

            return (
              <div
                key={stg}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{stg} Phase</span>
                  <span style={{ fontWeight: 700, color }}>{pct}%</span>
                </div>
                <div className="progress-bar-track" style={{ height: 6 }}>
                  <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  {done} of {total} skills mastered
                </div>
              </div>
            )
          })}
        </div>

        {/* Skill Progress Bars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '0.85rem',
        }}>
          {allSkills
            .filter((sk) => activeTab === 'all' || sk.stage === activeTab)
            .map((sk) => {
              const isDone = completedSet.has(sk.skill)
              // Color coding requirement: red <40%, amber 40-75%, green >75%
              const skillPercentage = isDone ? 100 : Math.round((sk.weight || 0.5) * 60)

              return (
                <SkillProgressBar
                  key={sk.skill}
                  skillName={sk.skill}
                  stage={sk.stage}
                  percentage={skillPercentage}
                  weight={sk.weight}
                  isCompleted={isDone}
                  isVerified={verifiedSkills.includes(sk.skill)}
                  disabled={saving}
                  onToggle={() => handleToggle(sk.skill)}
                />
              )
            })}
        </div>
      </div>

      {/* Complete Celebration Modal Banner */}
      {overallPercentage === 100 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'radial-gradient(ellipse at center, rgba(104,211,145,0.18) 0%, rgba(104,211,145,0.04) 100%)',
          border: '1.5px solid var(--accent-green)',
          borderRadius: 'var(--radius-lg)',
          marginTop: '2rem',
          boxShadow: '0 0 40px rgba(104, 211, 145, 0.25)',
          animation: 'fadeIn 0.5s ease',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎓</div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem',
            fontWeight: 800,
            color: 'var(--accent-green)',
            marginBottom: '0.35rem',
          }}>
            Congratulations! Complete Career Readiness Reached!
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
            You have mastered all foundational, intermediate, and advanced skills recommended for <strong>{targetRole}</strong>.
            Your profile fit is at maximum industry readiness!
          </p>
        </div>
      )}
    </section>
  )
}
