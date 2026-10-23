import { useState, useEffect } from 'react'
import ProfileForm from '../components/ProfileForm'
import SkillGapReport from '../components/SkillGapReport'
import MatchGauge from '../components/MatchGauge'
import VisualRoadmap from '../components/VisualRoadmap'
import ProgressTracker from '../components/ProgressTracker'
import { RoadmapSkeleton, ProgressTrackerSkeleton } from '../components/common/DashboardSkeletons'
import EmptyDashboardState from '../components/common/EmptyDashboardState'
import { getSkillGap, getRoadmap, updateProgress, fetchProgress } from '../api/client'
import { SAMPLE_PROFILES } from '../data/sampleRoadmap'
import { ChevronDown, ChevronUp, Sparkles, RefreshCw } from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { saveUserProgressToSupabase, fetchUserProgressFromSupabase } from '../api/supabaseProgress'
import { recordActivity } from '../utils/history'

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [skillGapData, setSkillGapData] = useState(null)
  const [roadmapData, setRoadmapData] = useState(null)
  const [profile, setProfile] = useState(null)
  const [completedSkills, setCompletedSkills] = useState(new Set())
  const [showProfileForm, setShowProfileForm] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Hydrate completed skills from Supabase, backend, or local cache when profile changes
  const loadExistingProgress = async (studentId, targetRole) => {
    if (!targetRole) return
    const activeId = user?.id || studentId
    if (!activeId) return

    const storageKey = `skillgap_progress_${activeId}_${targetRole}`
    const cached = localStorage.getItem(storageKey)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed)) {
          setCompletedSkills(new Set(parsed))
        }
      } catch {
        // ignore JSON parse error
      }
    }

    // Try Supabase first if authenticated
    if (user?.id) {
      const supaSkills = await fetchUserProgressFromSupabase(user.id, targetRole)
      if (supaSkills && supaSkills.length > 0) {
        setCompletedSkills(new Set(supaSkills))
        localStorage.setItem(storageKey, JSON.stringify(supaSkills))
        return
      }
    }

    try {
      const res = await fetchProgress(activeId, targetRole)
      if (res.data?.completed_skills) {
        const skills = res.data.completed_skills.filter(Boolean)
        setCompletedSkills(new Set(skills))
        localStorage.setItem(storageKey, JSON.stringify(skills))
      }
    } catch {
      // offline or mock fallback
    }
  }

  // Handle Profile Form Submission (Live Backend API)
  const handleSubmit = async (formProfile) => {
    setLoading(true)
    setError(null)
    setSkillGapData(null)
    setRoadmapData(null)
    setProfile(formProfile)
    setIsDemoMode(false)

    try {
      const [gapRes, roadRes] = await Promise.all([
        getSkillGap(formProfile),
        getRoadmap(formProfile),
      ])
      setSkillGapData(gapRes.data)
      setRoadmapData(roadRes.data.roadmap)
      setShowProfileForm(false) // Collapse form once results are loaded so roadmap/progress take the focal center
      await loadExistingProgress(formProfile.student_id, formProfile.target_role)

      const matchPct = Math.round((gapRes.data?.match_score || 0.75) * 100)
      recordActivity(user?.id || formProfile.student_id || 'guest', {
        type: 'skillgap',
        title: `${formProfile.target_role} Skill Gap Analysis`,
        subtitle: `Experience: ${formProfile.experience_level} · Current Skills: ${formProfile.current_skills?.length || 0}`,
        score: `${matchPct}% Match`,
        details: `Identified missing skills: ${gapRes.data?.missing_skills?.slice(0, 4).join(', ') || 'None'}`,
        link: '/dashboard',
      })
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        'Could not connect to the backend. Make sure the API is running on port 8000.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Load Sample Profile & Roadmap for interactive demo preview
  const handleLoadDemo = (roleName = 'Full Stack Developer') => {
    const demo = SAMPLE_PROFILES[roleName] || SAMPLE_PROFILES['Full Stack Developer']
    setError(null)
    setProfile(demo.profile)
    setSkillGapData(demo.skillGapData)
    setRoadmapData(demo.roadmap)
    setCompletedSkills(new Set(demo.defaultCompleted || []))
    setIsDemoMode(true)
    setShowProfileForm(false)
  }

  // Shared Skill Toggle: Synchronizes Learning Roadmap and Progress Tracker reactively!
  const handleToggleSkill = async (skillName) => {
    const next = new Set(completedSkills)
    if (next.has(skillName)) {
      next.delete(skillName)
    } else {
      next.add(skillName)
    }
    setCompletedSkills(next)

    const skillList = [...next]
    const activeUserId = user?.id || profile?.student_id || 'guest_user'
    const targetRole = profile?.target_role || 'Target Role'
    const storageKey = `skillgap_progress_${activeUserId}_${targetRole}`

    localStorage.setItem(storageKey, JSON.stringify(skillList))

    // Save to Supabase cloud if user is signed in
    if (user?.id && targetRole) {
      saveUserProgressToSupabase({
        userId: user.id,
        targetRole,
        completedSkills: skillList,
      })
    }

    if (!isDemoMode && profile?.student_id && profile?.target_role) {
      try {
        await updateProgress({
          student_id: profile.student_id,
          target_role: profile.target_role,
          completed_skills: skillList,
        })
      } catch {
        // Saved in localStorage and Supabase
      }
    }
  }

  const hasResults = Boolean(skillGapData && roadmapData)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <div className="pill-badge pill-badge-lime" style={{ marginBottom: '0.65rem' }}>
            <Sparkles size={14} /> AI CAREER DIAGNOSTICS
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.5rem',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            marginBottom: '0.4rem',
            color: '#131311',
          }}>
            Skill Gap AI Dashboard
          </h1>
          <p style={{ color: '#52524e', fontSize: '1rem', fontWeight: 500 }}>
            AI-driven competency analysis, visual career roadmaps, and real-time progress tracking.
          </p>
        </div>

        {hasResults && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {isDemoMode && (
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--accent-orange)',
                background: 'rgba(246, 173, 85, 0.12)',
                border: '1px solid rgba(246, 173, 85, 0.3)',
                padding: '0.3rem 0.75rem',
                borderRadius: 999,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}>
                <Sparkles size={14} /> Interactive Preview Mode
              </span>
            )}

            <button
              onClick={() => setShowProfileForm(!showProfileForm)}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.86rem',
                padding: '0.5rem 1rem',
              }}
            >
              {showProfileForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {showProfileForm ? 'Hide Profile Form' : 'Edit / Re-analyze Profile'}
            </button>
          </div>
        )}
      </div>

      {/* Collapsible Profile Form */}
      {(showProfileForm || !hasResults) && (
        <div className="animate-fadeIn">
          <ProfileForm onSubmit={handleSubmit} loading={loading} />
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="error-banner animate-fadeIn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>⚠️ {error}</div>
          <button
            onClick={() => handleLoadDemo('Full Stack Developer')}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
          >
            Launch Interactive Demo Instead
          </button>
        </div>
      )}

      {/* Skeleton Loaders during calculation */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <RoadmapSkeleton />
          <ProgressTrackerSkeleton />
        </div>
      )}

      {/* Empty State when no profile is analyzed yet */}
      {!hasResults && !loading && (
        <EmptyDashboardState onLoadDemo={handleLoadDemo} />
      )}

      {/* Focal Redesigned Sections when Results are loaded */}
      {hasResults && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* FOCAL SECTION 1: Learning Roadmap */}
          <VisualRoadmap
            roadmap={roadmapData}
            targetRole={profile?.target_role || 'Target Role'}
            completedSkills={completedSkills}
            onToggleSkill={handleToggleSkill}
          />

          {/* FOCAL SECTION 2: Progress Tracker */}
          <ProgressTracker
            roadmap={roadmapData}
            studentId={profile?.student_id || 'guest_student'}
            targetRole={profile?.target_role || 'Target Role'}
            completedSkills={completedSkills}
            onToggleSkill={handleToggleSkill}
            matchPercentage={skillGapData?.match_percentage || 50}
          />

          {/* Complementary Role Fit Gauge & Detailed Skill Gap Report */}
          <div style={{ marginTop: '0.5rem' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              marginBottom: '1rem',
              letterSpacing: '-0.01em',
            }}>
              Analysis Diagnostics & Role Match
            </h3>
            <div className="grid-2" style={{ alignItems: 'start' }}>
              <MatchGauge percentage={skillGapData.match_percentage} />
              <SkillGapReport data={skillGapData} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
