import { useState, useMemo } from 'react'
import RoadmapHeader from './roadmap/RoadmapHeader'
import RoadmapTimeline from './roadmap/RoadmapTimeline'
import RoadmapDetailPanel from './roadmap/RoadmapDetailPanel'
import QuizModal from './quiz/QuizModal'
import { getSkillDetails } from '../data/skillResources'
import { Map, Sparkles, Filter } from 'lucide-react'

const STAGE_ORDER = ['Foundational', 'Intermediate', 'Applied']

export default function VisualRoadmap({
  roadmap,
  targetRole = 'Target Role',
  completedSkills: externalCompletedSkills,
  onToggleSkill,
}) {
  // Internal state fallback if not managed externally
  const [internalCompleted, setInternalCompleted] = useState(new Set())
  const [activeSkillOverride, setActiveSkillOverride] = useState(null)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [filter, setFilter] = useState('all')
  const [activeQuizSkill, setActiveQuizSkill] = useState(null)
  const [verifiedSkills, setVerifiedSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('skillgap_verified_skills')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const handleSkillVerified = (skillName) => {
    setVerifiedSkills((prev) => {
      const updated = Array.from(new Set([...prev, skillName]))
      try {
        localStorage.setItem('skillgap_verified_skills', JSON.stringify(updated))
      } catch (err) {
        console.error(err)
      }
      return updated
    })
    // Auto-mark skill as completed if not already marked
    if (!completedSet.has(skillName)) {
      toggleSkill(skillName)
    }
  }

  const completedSet = useMemo(() => {
    if (externalCompletedSkills instanceof Set) return externalCompletedSkills
    if (Array.isArray(externalCompletedSkills)) return new Set(externalCompletedSkills)
    return internalCompleted
  }, [externalCompletedSkills, internalCompleted])

  const toggleSkill = (skillName) => {
    if (onToggleSkill) {
      onToggleSkill(skillName)
    } else {
      setInternalCompleted((prev) => {
        const next = new Set(prev)
        if (next.has(skillName)) next.delete(skillName)
        else next.add(skillName)
        return next
      })
    }
  }

  // Flatten and sequence skills
  const { phases, allSkills, totalCount, completedCount, totalHours, estimatedWeeks } = useMemo(() => {
    if (!roadmap) {
      return { phases: [], allSkills: [], totalCount: 0, completedCount: 0, totalHours: 0, estimatedWeeks: '0 weeks' }
    }

    const availableStages = STAGE_ORDER.filter((s) => roadmap[s] && roadmap[s].length > 0)
    let foundFirstIncomplete = false
    const flattened = []
    let hoursSum = 0

    const phaseList = availableStages.map((stage) => {
      const skillsInStage = (roadmap[stage] || []).map((raw) => {
        const details = getSkillDetails(raw.skill, stage, raw.weight)
        hoursSum += details.hours || 15

        const isDone = completedSet.has(raw.skill)
        let status = 'locked'

        if (isDone) {
          status = 'completed'
        } else if (activeSkillOverride === raw.skill) {
          status = 'in-progress'
          foundFirstIncomplete = true
        } else if (!foundFirstIncomplete) {
          status = 'in-progress'
          foundFirstIncomplete = true
        } else if (flattened.filter((s) => s.status === 'in-progress').length > 0 && flattened[flattened.length - 1]?.status === 'in-progress') {
          status = 'up-next'
        } else {
          status = 'locked'
        }

        const skillObj = {
          ...details,
          ...raw,
          stage,
          status,
        }

        flattened.push(skillObj)
        return skillObj
      })

      return {
        stage,
        skills: skillsInStage,
      }
    })

    const doneCount = flattened.filter((s) => completedSet.has(s.skill)).length
    const weeksCalc = Math.max(2, Math.ceil(hoursSum / 12))

    return {
      phases: phaseList,
      allSkills: flattened,
      totalCount: flattened.length,
      completedCount: doneCount,
      totalHours: hoursSum,
      estimatedWeeks: `${weeksCalc} weeks (${hoursSum} hrs)`,
    }
  }, [roadmap, completedSet, activeSkillOverride])

  // If a skill was selected, keep its details updated
  const activeSelectedSkill = useMemo(() => {
    if (!selectedSkill) return null
    return allSkills.find((s) => s.skill === selectedSkill.skill) || selectedSkill
  }, [selectedSkill, allSkills])

  if (!roadmap || totalCount === 0) {
    return null
  }

  return (
    <section
      aria-label="Interactive Learning Roadmap"
      className="neo-card animate-fadeIn roadmap-section-focal"
      style={{
        position: 'relative',
        padding: '2.25rem',
        background: '#ffffff',
      }}
    >
      {/* Top Banner & Filter Summary */}
      <RoadmapHeader
        targetRole={targetRole}
        totalSkills={totalCount}
        completedCount={completedCount}
        estimatedWeeks={estimatedWeeks}
        filter={filter}
        onFilterChange={setFilter}
      />

      {/* Expanded detail panel if a node is clicked */}
      {activeSelectedSkill && (
        <RoadmapDetailPanel
          skill={activeSelectedSkill}
          status={activeSelectedSkill.status}
          isVerified={verifiedSkills.includes(activeSelectedSkill.skill)}
          onClose={() => setSelectedSkill(null)}
          onToggleComplete={(skillName) => toggleSkill(skillName)}
          onStartLearning={(skillName) => {
            setActiveSkillOverride(skillName)
            setSelectedSkill(null)
          }}
          onOpenQuiz={(skillName) => setActiveQuizSkill(skillName)}
        />
      )}

      {/* Visual Timeline Path */}
      <div style={{ marginTop: activeSelectedSkill ? '2rem' : '1.5rem' }}>
        <RoadmapTimeline
          phases={phases}
          selectedSkill={activeSelectedSkill}
          verifiedSkills={verifiedSkills}
          onSelectSkill={(skill) => {
            if (activeSelectedSkill?.skill === skill.skill) {
              setSelectedSkill(null) // toggle close
            } else {
              setSelectedSkill(skill)
            }
          }}
          filter={filter}
        />
      </div>

      {/* Skill Verification Quiz Modal */}
      <QuizModal
        isOpen={Boolean(activeQuizSkill)}
        skill={activeQuizSkill}
        role={targetRole}
        onClose={() => setActiveQuizSkill(null)}
        onVerified={(verifiedSkillName) => {
          handleSkillVerified(verifiedSkillName)
        }}
      />
    </section>
  )
}
