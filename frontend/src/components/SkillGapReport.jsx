import React from 'react'
import { CheckCircle2, AlertTriangle, ArrowRight, Zap, Target } from 'lucide-react'

export default function SkillGapReport({ data }) {
  if (!data) return null

  const { target_role, match_percentage, missing_skills, present_skills } = data

  const topMissing = missing_skills.slice(0, 4).map((s) => s.skill).join(', ')

  return (
    <div className="neo-card animate-fadeIn">
      <div className="section-title">
        <span style={{ background: 'var(--accent-lime)', padding: '2px 8px', borderRadius: 6, border: 'var(--border-main)' }}>📊</span>
        Skill Gap Analysis Report
      </div>

      {present_skills && present_skills.length > 0 && (
        <div style={{ marginBottom: '1.75rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Validated Existing Skills ({present_skills.length})
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {present_skills.map((s) => (
              <span
                key={s}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: 'var(--accent-lime-subtle)',
                  color: '#131311',
                  border: '1px solid #131311',
                  borderRadius: 999,
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  boxShadow: '1px 1px 0px #131311',
                }}
              >
                ✓ {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {missing_skills.length > 0 ? (
        <>
          <div
            style={{
              background: 'var(--accent-lime)',
              border: 'var(--border-main)',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              marginBottom: '1.75rem',
              fontSize: '0.92rem',
              color: '#131311',
              fontWeight: 600,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            🎯 <strong>Critical Focus:</strong> Mastering <strong>{topMissing}</strong>{missing_skills.length > 4 ? ` and ${missing_skills.length - 4} other skills` : ''} will elevate you to interview readiness for <strong>{target_role}</strong>.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {missing_skills.map((skill, i) => (
              <SkillRow key={skill.skill} skill={skill} rank={i + 1} />
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '2.5rem', background: 'var(--accent-lime-subtle)', border: 'var(--border-main)', borderRadius: 12 }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
          <h3 style={{ fontWeight: 800, color: '#131311' }}>Ready to Apply!</h3>
          <p style={{ color: 'var(--text-secondary)' }}>You possess all required core competencies for {target_role}.</p>
        </div>
      )}
    </div>
  )
}

function SkillRow({ skill, rank }) {
  const stageBg = {
    Foundational: 'var(--accent-teal-subtle)',
    Intermediate: 'var(--accent-lime-subtle)',
    Applied: 'var(--accent-coral-subtle)',
  }[skill.stage] || 'var(--bg-surface-secondary)'

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: 'var(--border-main)',
        borderRadius: '10px',
        padding: '1rem 1.25rem',
        boxShadow: 'var(--shadow-sm)',
        animation: `fadeIn 0.25s ease ${rank * 0.04}s both`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span
            style={{
              width: 26,
              height: 26,
              background: '#131311',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#ffffff',
            }}
          >
            {rank}
          </span>
          <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>{skill.skill}</span>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: 6,
            background: stageBg,
            border: '1px solid #131311',
            color: '#131311',
          }}
        >
          {skill.stage}
        </span>
      </div>

      <div
        style={{
          width: '100%',
          height: 8,
          background: '#eaeaea',
          border: '1px solid #131311',
          borderRadius: 999,
          overflow: 'hidden',
          marginBottom: '0.5rem',
        }}
      >
        <div
          style={{
            width: `${Math.round(skill.weight * 100)}%`,
            height: '100%',
            background: 'var(--accent-lime)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
        {skill.reason}
      </p>
    </div>
  )
}
