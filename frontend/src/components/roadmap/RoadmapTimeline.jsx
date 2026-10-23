import { Fragment } from 'react'
import RoadmapNode from './RoadmapNode'
import { Sparkles, ChevronRight } from 'lucide-react'

const PHASE_CONFIG = {
  Foundational: {
    number: '1',
    badge: 'Phase 1 · Foundational',
    label: 'Core Fundamentals',
    description: 'Essential bedrock concepts, syntax, and foundational primitives.',
    color: 'var(--accent-blue)',
    gradient: 'linear-gradient(135deg, rgba(99, 179, 237, 0.15) 0%, rgba(99, 179, 237, 0.03) 100%)',
    border: 'rgba(99, 179, 237, 0.25)',
  },
  Intermediate: {
    number: '2',
    badge: 'Phase 2 · Intermediate',
    label: 'Practical Implementation',
    description: 'Frameworks, data pipelines, architectural patterns, and testing.',
    color: 'var(--accent-purple)',
    gradient: 'linear-gradient(135deg, rgba(183, 148, 244, 0.15) 0%, rgba(183, 148, 244, 0.03) 100%)',
    border: 'rgba(183, 148, 244, 0.25)',
  },
  Applied: {
    number: '3',
    badge: 'Phase 3 · Advanced',
    label: 'Production Mastery',
    description: 'Deployment, optimization, cloud scaling, and end-to-end delivery.',
    color: 'var(--accent-green)',
    gradient: 'linear-gradient(135deg, rgba(104, 211, 145, 0.15) 0%, rgba(104, 211, 145, 0.03) 100%)',
    border: 'rgba(104, 211, 145, 0.25)',
  },
}

export default function RoadmapTimeline({
  phases = [],
  selectedSkill = null,
  onSelectSkill,
  filter = 'all',
  verifiedSkills = [],
}) {
  let globalIndex = 0

  return (
    <div className="roadmap-journey-container" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {phases.map((phaseGroup, pIdx) => {
        const phaseCfg = PHASE_CONFIG[phaseGroup.stage] || {
          number: `${pIdx + 1}`,
          badge: `Phase ${pIdx + 1} · ${phaseGroup.stage}`,
          label: phaseGroup.stage,
          description: '',
          color: 'var(--accent-blue)',
          gradient: 'rgba(255, 255, 255, 0.03)',
          border: 'var(--border-subtle)',
        }

        const filteredSkills = phaseGroup.skills.filter((s) => {
          if (filter === 'all') return true
          return s.status === filter
        })

        if (filteredSkills.length === 0 && filter !== 'all') {
          return null
        }

        return (
          <div
            key={phaseGroup.stage}
            className="roadmap-phase-section"
            style={{ position: 'relative' }}
          >
            {/* Phase Milestone Header Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: phaseCfg.gradient,
              border: `1px solid ${phaseCfg.border}`,
              marginBottom: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: phaseCfg.color,
                  color: '#080b14',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  boxShadow: `0 0 12px ${phaseCfg.color}66`,
                }}>
                  {phaseCfg.number}
                </span>

                <div>
                  <div style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    color: phaseCfg.color,
                  }}>
                    {phaseCfg.badge}
                  </div>
                  <div style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}>
                    {phaseCfg.label}
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <span>{filteredSkills.length} {filteredSkills.length === 1 ? 'skill' : 'skills'} in this phase</span>
                <span style={{ color: 'var(--border-subtle)' }}>•</span>
                <span style={{ color: phaseCfg.color, fontWeight: 600 }}>
                  {filteredSkills.filter((s) => s.status === 'completed').length} completed
                </span>
              </div>
            </div>

            {/* Connected Journey Grid / Track */}
            <div
              className="roadmap-nodes-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.25rem',
                position: 'relative',
              }}
            >
              {filteredSkills.map((skill) => {
                globalIndex += 1
                const isSelected = selectedSkill?.skill === skill.skill

                return (
                  <RoadmapNode
                    key={skill.skill}
                    skill={skill}
                    status={skill.status}
                    isVerified={verifiedSkills.includes(skill.skill)}
                    isSelected={isSelected}
                    index={globalIndex}
                    onSelect={() => onSelectSkill(skill)}
                  />
                )
              })}
            </div>

            {/* Stage Transition Connector (between Phase 1 and 2, and 2 and 3) */}
            {pIdx < phases.length - 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '1.75rem',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                <div style={{ height: 1, flex: 1, background: 'var(--border-subtle)' }} />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  Next Phase <ChevronRight size={14} />
                </span>
                <div style={{ height: 1, flex: 1, background: 'var(--border-subtle)' }} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
