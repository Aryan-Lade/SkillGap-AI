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

const DEFAULT_SKILLS = ['Python', 'SQL', 'Docker', 'REST APIs', 'Git']

export default function StudyPlanner() {
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
    <div style={{ maxWidth: 1180, margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 1rem',
            borderRadius: 999,
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          <Calendar size={16} /> Automated Pacing & Calendar Sync
        </div>
        <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
          Smart Weekly Study Schedule & Calendar Sync
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: 680, margin: '0 auto' }}>
          Break down your skill gaps into realistic day-by-day learning sessions, track progress,
          and export your roadmap directly to Google Calendar, Apple iCal, or Outlook.
        </p>
      </div>

      {/* Configuration Controls Bar */}
      <div
        className="glass-card animate-fadeIn"
        style={{
          padding: '1.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.45) 0%, rgba(15, 23, 42, 0.7) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
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
                    padding: '0.45rem 0.5rem',
                    borderRadius: 8,
                    border: hoursPerWeek === opt.h ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: hoursPerWeek === opt.h ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                    color: hoursPerWeek === opt.h ? '#c7d2fe' : '#94a3b8',
                    fontSize: '0.78rem',
                    fontWeight: hoursPerWeek === opt.h ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Tags Selector */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>
              Skills to Schedule ({selectedSkills.length}):
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Type skill & press Enter</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
            {selectedSkills.map((s) => (
              <span
                key={s}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '3px 9px',
                  borderRadius: 6,
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  color: '#c7d2fe',
                  fontSize: '0.8rem',
                }}
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeSkill(s)}
                  style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer', padding: 0 }}
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
                color: '#fff',
                fontSize: '0.82rem',
                minWidth: 100,
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
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {/* Target Completion */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600 }}>TARGET COMPLETION DATE</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', marginTop: '0.3rem' }}>
              {plan.target_completion_date}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6ee7b7', marginTop: '0.2rem' }}>
              {plan.estimated_weeks} weeks ({plan.hours_per_week} hrs/week)
            </div>
          </div>

          {/* Total Sessions */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600 }}>CURRICULUM COMMITMENT</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.3rem' }}>
              {plan.total_study_hours} Hours
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              {plan.total_study_sessions} focused daily study sessions
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600 }}>ROADMAP COMPLETION</span>
              <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.82rem' }}>{progressPct}%</span>
            </div>
            <div
              style={{
                width: '100%',
                height: 8,
                borderRadius: 999,
                background: 'rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                margin: '0.6rem 0 0.3rem 0',
              }}
            >
              <div
                style={{
                  width: `${progressPct}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #38bdf8, #34d399)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {completedCount} of {totalDays} sessions completed
            </div>
          </div>

          {/* Export Action Card */}
          <div
            className="glass-card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.15) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
            }}
          >
            <button
              type="button"
              onClick={handleDownloadIcs}
              disabled={downloadingIcs}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '0.65rem 1rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: downloadingIcs ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
              }}
            >
              <Download size={16} />
              {downloadingIcs ? 'Generating .ics...' : 'Export Calendar (.ics)'}
            </button>
            <div style={{ fontSize: '0.7rem', color: '#c7d2fe', textAlign: 'center', marginTop: '0.4rem' }}>
              Syncs with Google Calendar, Apple iCal & Outlook
            </div>
          </div>
        </div>
      )}

      {/* Weekly Schedule View */}
      {plan && (
        <div className="glass-card animate-fadeIn">
          {/* Week Selector Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '0.75rem',
              marginBottom: '1.5rem',
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
                    padding: '0.5rem 1rem',
                    borderRadius: 8,
                    border: isSelected ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.06)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.02)',
                    color: isSelected ? '#e0e7ff' : '#94a3b8',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>Week {w.week_number}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#cbd5e1',
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
                  <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={20} color="#818cf8" />
                    {week.title}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
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
                          padding: '1rem 1.25rem',
                          borderRadius: 12,
                          background: isDone ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.6)',
                          border: isDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease-in-out',
                        }}
                      >
                        {/* Checkbox Icon */}
                        <div style={{ marginTop: '0.2rem' }}>
                          <CheckCircle2
                            size={22}
                            color={isDone ? '#34d399' : '#475569'}
                            fill={isDone ? 'rgba(52, 211, 153, 0.2)' : 'transparent'}
                          />
                        </div>

                        {/* Session Details */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  padding: '2px 7px',
                                  borderRadius: 4,
                                  background: 'rgba(99, 102, 241, 0.25)',
                                  color: '#a5b4fc',
                                }}
                              >
                                {day.skill}
                              </span>
                              <span
                                style={{
                                  fontWeight: 600,
                                  color: isDone ? '#94a3b8' : '#f8fafc',
                                  fontSize: '0.95rem',
                                  textDecoration: isDone ? 'line-through' : 'none',
                                }}
                              >
                                {day.topic}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: '#64748b' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Clock size={13} /> {day.duration_minutes} mins
                              </span>
                              <span>
                                {day.day_name}, {day.formatted_date}
                              </span>
                            </div>
                          </div>

                          <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: '0.4rem 0 0 0', lineHeight: 1.45 }}>
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
