import React, { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  CheckCircle2,
  Download,
  Sparkles,
  ArrowRight,
  BookOpen,
  Zap,
  Target,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  RotateCcw,
} from 'lucide-react'
import { generateStudyPlan, exportCalendarIcs } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { recordActivity } from '../utils/history'

const DEFAULT_SKILLS = ['Python', 'SQL', 'Docker', 'REST APIs', 'Git']

export default function StudyPlanner() {
  const { user } = useAuth()
  const [targetRole, setTargetRole] = useState('Full Stack Developer')
  const [hoursPerWeek, setHoursPerWeek] = useState(10)
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0])
  const [selectedSkills, setSelectedSkills] = useState(DEFAULT_SKILLS)
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState(null)
  const [completedSessions, setCompletedSessions] = useState({})
  const [downloadingIcs, setDownloadingIcs] = useState(false)
  const [activeWeekTab, setActiveWeekTab] = useState(1)

  useEffect(() => {
    fetchPlan()
  }, [])

  const fetchPlan = async (skills = selectedSkills, hours = hoursPerWeek) => {
    setLoading(true)
    try {
      const res = await generateStudyPlan({
        target_role: targetRole,
        skills_to_learn: skills,
        hours_per_week: hours,
        start_date: startDate,
      })
      setPlan(res.data)
      setActiveWeekTab(1)

      recordActivity(user?.id || 'guest', {
        type: 'planner',
        title: `${targetRole} Study Schedule`,
        subtitle: `${hours} hrs/week · ${res.data?.total_weeks || 4} Weeks Plan`,
        score: `${res.data?.total_hours || (hours * 4)} Total Hrs`,
        details: `Skills scheduled: ${skills.slice(0, 4).join(', ')}`,
        link: '/planner',
      })
    } catch (err) {
      console.error('Failed to generate study plan', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const val = skillInput.trim().replace(/^,+|,+$/g, '')
      if (val && !selectedSkills.includes(val)) {
        const updated = [...selectedSkills, val]
        setSelectedSkills(updated)
        setSkillInput('')
        fetchPlan(updated, hoursPerWeek)
      }
    }
  }

  const removeSkill = (skill) => {
    const updated = selectedSkills.filter((s) => s !== skill)
    setSelectedSkills(updated)
    fetchPlan(updated, hoursPerWeek)
  }

  const handleToggleSession = (sessionId) => {
    setCompletedSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }))
  }

  const handleDownloadIcs = async () => {
    setDownloadingIcs(true)
    try {
      const res = await exportCalendarIcs({
        target_role: targetRole,
        skills_to_learn: selectedSkills,
        hours_per_week: hoursPerWeek,
        start_date: startDate,
      })

      const blob = new Blob([res.data], { type: 'text/calendar' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `SkillGap-Study-Plan-${targetRole.replace(/\s+/g, '-')}.ics`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download calendar', err)
    } finally {
      setDownloadingIcs(false)
    }
  }

  // Calculate completion percentage
  const totalDays = plan?.weekly_modules?.reduce((sum, w) => sum + w.days.length, 0) || 1
  const completedCount = Object.values(completedSessions).filter(Boolean).length
  const progressPct = Math.min(100, Math.round((completedCount / totalDays) * 100))

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="pill-badge pill-badge-lime" style={{ marginBottom: '1rem' }}>
          <Calendar size={15} /> CALENDAR & PACING AUTOMATION
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#131311', letterSpacing: '-0.03em', margin: '0 0 0.75rem 0' }}>
          Smart Weekly Study Schedule & Calendar Sync
        </h1>
        <p style={{ color: '#52524e', fontSize: '1.05rem', maxWidth: 680, margin: '0 auto', lineHeight: 1.5 }}>
          Break down your skill gaps into realistic day-by-day learning sessions, track progress,
          and export your roadmap directly to Google Calendar, Apple iCal, or Outlook.
        </p>
      </div>

      {/* Configuration Controls Bar */}
      <div
        className="neo-card animate-fadeIn"
        style={{
          padding: '1.75rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
          {/* Target Role */}
          <div>
            <label className="form-label" style={{ fontSize: '0.82rem' }}>Target Career Role</label>
            <input
              type="text"
              className="form-input"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Backend Developer"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="form-label" style={{ fontSize: '0.82rem' }}>Start Date</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                fetchPlan(selectedSkills, hoursPerWeek)
              }}
            />
          </div>

          {/* Weekly Hours Pacing */}
          <div>
            <label className="form-label" style={{ fontSize: '0.82rem' }}>
              Weekly Commitment ({hoursPerWeek} hrs/week)
            </label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {[
                { h: 5, label: '5h Casual' },
                { h: 10, label: '10h Balanced' },
                { h: 20, label: '20h Intensive' },
              ].map((opt) => (
                <button
                  key={opt.h}
                  type="button"
                  onClick={() => {
                    setHoursPerWeek(opt.h)
                    fetchPlan(selectedSkills, opt.h)
                  }}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.5rem',
                    borderRadius: '8px',
                    border: '1.5px solid #131311',
                    background: hoursPerWeek === opt.h ? 'var(--accent-lime)' : '#ffffff',
                    color: '#131311',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: hoursPerWeek === opt.h ? '2px 2px 0px #131311' : '1px 1px 0px #131311',
                    transition: 'all 0.12s ease',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Tags Selector */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1.5px solid #131311' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#131311' }}>
              Skills to Schedule ({selectedSkills.length}):
            </span>
            <span className="sticker-note" style={{ fontSize: '1.15rem' }}>
              type skill & press Enter!
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            {selectedSkills.map((s) => (
              <span
                key={s}
                className="tag"
              >
                {s}
                <button
                  type="button"
                  className="tag-remove"
                  onClick={() => removeSkill(s)}
                >
                  ×
                </button>
              </span>
            ))}

            <input
              type="text"
              placeholder="+ Add skill..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#131311',
                fontWeight: 600,
                fontSize: '0.88rem',
                minWidth: 120,
                padding: '0.3rem 0.5rem',
              }}
            />
          </div>
        </div>
      </div>

      {/* Plan Metrics & Calendar Export Header */}
      {plan && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          {/* Target Completion */}
          <div className="neo-card" style={{ padding: '1.5rem' }}>
            <div style={{ color: '#52524e', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>TARGET COMPLETION</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#131311', marginTop: '0.35rem' }}>
              {plan.target_completion_date}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#52524e', fontWeight: 600, marginTop: '0.2rem' }}>
              {plan.estimated_weeks} weeks ({plan.hours_per_week} hrs/week)
            </div>
          </div>

          {/* Total Sessions */}
          <div className="neo-card" style={{ padding: '1.5rem' }}>
            <div style={{ color: '#52524e', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>CURRICULUM COMMITMENT</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#131311', marginTop: '0.35rem' }}>
              {plan.total_study_hours} Hours
            </div>
            <div style={{ fontSize: '0.82rem', color: '#80807c', marginTop: '0.2rem' }}>
              {plan.total_study_sessions} focused daily sessions
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="neo-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#52524e', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>ROADMAP COMPLETION</span>
              <span style={{ color: '#131311', fontWeight: 900, fontSize: '0.95rem' }}>{progressPct}%</span>
            </div>
            <div className="progress-bar-track" style={{ margin: '0.75rem 0 0.4rem 0' }}>
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#80807c' }}>
              {completedCount} of {totalDays} sessions completed
            </div>
          </div>

          {/* Export Action Card */}
          <div
            className="neo-card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'var(--accent-lime-subtle)',
            }}
          >
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDownloadIcs}
              disabled={downloadingIcs}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.92rem',
              }}
            >
              <Download size={17} />
              {downloadingIcs ? 'Generating .ics...' : 'Export Calendar (.ics)'}
            </button>
            <div style={{ fontSize: '0.75rem', color: '#131311', fontWeight: 700, textAlign: 'center', marginTop: '0.5rem' }}>
              Syncs with Google, Apple & Outlook
            </div>
          </div>
        </div>
      )}

      {/* Weekly Schedule View */}
      {plan && (
        <div className="neo-card animate-fadeIn">
          {/* Week Selector Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              borderBottom: '1.5px solid #131311',
              paddingBottom: '0.85rem',
              marginBottom: '1.75rem',
            }}
          >
            {plan.weekly_modules.map((w) => {
              const isSelected = activeWeekTab === w.week_number
              return (
                <button
                  key={w.week_number}
                  type="button"
                  onClick={() => setActiveWeekTab(w.week_number)}
                  style={{
                    padding: '0.55rem 1.15rem',
                    borderRadius: '8px',
                    border: '1.5px solid #131311',
                    background: isSelected ? 'var(--accent-lime)' : '#ffffff',
                    color: '#131311',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: isSelected ? '2px 2px 0px #131311' : '1px 1px 0px #131311',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <span>Week {w.week_number}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '999px',
                      border: '1px solid #131311',
                      background: isSelected ? '#131311' : 'var(--bg-surface-secondary)',
                      color: isSelected ? 'var(--accent-lime)' : '#131311',
                    }}
                  >
                    {w.total_hours}h
                  </span>
                </button>
              )
            })}
          </div>

          {/* Active Week Sessions List */}
          {plan.weekly_modules
            .filter((w) => w.week_number === activeWeekTab)
            .map((week) => (
              <div key={week.week_number}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, color: '#131311', fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={20} />
                    {week.title}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: '#52524e', fontWeight: 600 }}>
                    {week.days.length} study sessions planned
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {week.days.map((day) => {
                    const isDone = Boolean(completedSessions[day.session_number])
                    return (
                      <div
                        key={day.session_number}
                        onClick={() => handleToggleSession(day.session_number)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1rem',
                          padding: '1.15rem 1.35rem',
                          borderRadius: '10px',
                          background: isDone ? 'var(--accent-lime-subtle)' : '#ffffff',
                          border: '1.5px solid #131311',
                          boxShadow: isDone ? '1px 1px 0px #131311' : '3px 3px 0px #131311',
                          cursor: 'pointer',
                          transition: 'all 0.12s ease-in-out',
                        }}
                      >
                        {/* Checkbox Icon */}
                        <div style={{ marginTop: '0.2rem' }}>
                          <CheckCircle2
                            size={22}
                            color="#131311"
                            fill={isDone ? 'var(--accent-lime)' : 'transparent'}
                          />
                        </div>

                        {/* Session Details */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '999px',
                                  border: '1px solid #131311',
                                  background: 'var(--accent-lime)',
                                  color: '#131311',
                                }}
                              >
                                {day.skill}
                              </span>
                              <span
                                style={{
                                  fontWeight: 800,
                                  color: isDone ? '#80807c' : '#131311',
                                  fontSize: '1rem',
                                  textDecoration: isDone ? 'line-through' : 'none',
                                }}
                              >
                                {day.topic}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: '#52524e', fontWeight: 600 }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Clock size={13} /> {day.duration_minutes} mins
                              </span>
                              <span>
                                {day.day_name}, {day.formatted_date}
                              </span>
                            </div>
                          </div>

                          <p style={{ color: '#52524e', fontSize: '0.86rem', margin: '0.5rem 0 0 0', lineHeight: 1.5 }}>
                            {day.learning_objectives}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
