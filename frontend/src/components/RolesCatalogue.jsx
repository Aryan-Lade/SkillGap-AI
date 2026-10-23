import { useState, useEffect } from 'react'
import { getAllRoles } from '../api/client'
import { ArrowRight, Sparkles, ChevronDown, ChevronUp, Layers } from 'lucide-react'

const STAGE_COLORS = {
  Foundational: { bg: 'var(--accent-teal-subtle)', color: '#131311', border: '#131311' },
  Intermediate: { bg: 'var(--accent-lime-subtle)', color: '#131311', border: '#131311' },
  Applied: { bg: 'var(--accent-coral-subtle)', color: '#131311', border: '#131311' },
}

const ROLE_ICONS = {
  'Data Scientist': '📊',
  'Backend Developer': '⚙️',
  'ML Engineer': '🤖',
  'Frontend Developer': '🎨',
  'AI Engineer': '🧠',
  'DevOps Engineer': '🚀',
  'Java Developer': '☕',
  'Cloud Engineer': '☁️',
  'Data Engineer': '🌊',
  'Cybersecurity Analyst': '🛡️',
  'Full Stack Developer': '💻',
  'Mobile App Developer': '📱',
  'QA / Automation Engineer': '🧪',
  'Blockchain Developer': '⛓️',
  'Game Developer': '🎮',
  'Embedded Systems Engineer': '🔌',
}

const ROLE_DESCRIPTIONS = {
  'Data Scientist': 'Analyze complex data to drive business decisions using statistical modeling and ML.',
  'Backend Developer': 'Build scalable server-side systems, APIs, and databases that power applications.',
  'ML Engineer': 'Design, deploy, and maintain machine learning pipelines in production environments.',
  'Frontend Developer': 'Craft engaging, accessible user interfaces with modern web technologies.',
  'AI Engineer': 'Build cutting-edge LLMs, RAG systems, and autonomous agent workflows.',
  'DevOps Engineer': 'Automate CI/CD pipelines, container orchestration, and cloud infrastructure.',
  'Java Developer': 'Architect enterprise-grade microservices and robust Spring Boot applications.',
  'Cloud Engineer': 'Design resilient, highly scalable cloud architectures and serverless systems.',
  'Data Engineer': 'Build big data ETL pipelines, distributed streaming systems, and data lakes.',
  'Cybersecurity Analyst': 'Protect network infrastructure, monitor threat telemetry, and lead incident response.',
  'Full Stack Developer': 'Bridge frontend and backend to deliver complete end-to-end web applications.',
  'Mobile App Developer': 'Create fluid cross-platform mobile apps for iOS and Android using Flutter/React Native.',
  'QA / Automation Engineer': 'Build automated testing suites to guarantee software quality and reliability.',
  'Blockchain Developer': 'Engineer decentralized applications, smart contracts, and Web3 protocols.',
  'Game Developer': 'Build immersive gameplay systems, physics, and interactive 3D virtual worlds.',
  'Embedded Systems Engineer': 'Program microcontrollers, firmware, RTOS, and IoT hardware devices.',
}

export default function RolesCatalogue() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getAllRoles()
      .then((res) => setRoles(res.data.roles))
      .catch(() => setError('Failed to load roles. Make sure the backend is running.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <div className="spinner" style={{ margin: '0 auto 1rem auto' }} />
      <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Loading taxonomy catalogue...</span>
    </div>
  )

  if (error) return <div className="error-banner">{error}</div>

  const roleData = selected ? roles.find((r) => r.role === selected) : null

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {roles.map((role) => {
          const icon = ROLE_ICONS[role.role] || '💼'
          const isActive = selected === role.role
          const skillCount = role.skills.length
          const foundational = role.skills.filter((s) => s.stage === 'Foundational').length
          const intermediate = role.skills.filter((s) => s.stage === 'Intermediate').length
          const applied = role.skills.filter((s) => s.stage === 'Applied').length

          return (
            <div
              key={role.role}
              className="neo-card"
              style={{
                cursor: 'pointer',
                background: isActive ? 'var(--accent-lime-subtle)' : 'var(--bg-surface)',
                boxShadow: isActive ? 'var(--shadow-lg)' : 'var(--shadow-main)',
                transform: isActive ? 'translate(-2px, -2px)' : 'none',
                transition: 'all 0.15s ease-in-out',
              }}
              onClick={() => setSelected(isActive ? null : role.role)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: 48, height: 48,
                  background: 'var(--accent-lime)',
                  border: 'var(--border-main)',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexShrink: 0,
                  boxShadow: '2px 2px 0px #131311',
                }}>
                  {icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.25rem' }}>
                    {role.role}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {ROLE_DESCRIPTIONS[role.role]}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 7px', borderRadius: 6, background: '#e0f2fe', border: '1px solid #131311', color: '#131311' }}>
                  {foundational} Foundational
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 7px', borderRadius: 6, background: '#fef3c7', border: '1px solid #131311', color: '#131311' }}>
                  {intermediate} Intermediate
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 7px', borderRadius: 6, background: '#dcfce7', border: '1px solid #131311', color: '#131311' }}>
                  {applied} Applied
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.65rem', borderTop: '1px solid rgba(19,19,17,0.1)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                <span>{skillCount} Required Skills</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#131311' }}>
                  {isActive ? 'Hide Details' : 'View Breakdown'} {isActive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Expanded Role Detail Drawer */}
      {roleData && (
        <div
          className="neo-card animate-fadeIn"
          style={{
            marginTop: '2rem',
            background: 'var(--bg-surface)',
            padding: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>{ROLE_ICONS[roleData.role]}</span>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{roleData.role} Skill Breakdown</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{ROLE_DESCRIPTIONS[roleData.role]}</p>
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
            >
              Close
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {['Foundational', 'Intermediate', 'Applied'].map((stage) => {
              const stageSkills = roleData.skills.filter((s) => s.stage === stage)
              const cfg = STAGE_COLORS[stage]

              return (
                <div
                  key={stage}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '10px',
                    border: 'var(--border-main)',
                    background: cfg.bg,
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#131311', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {stage}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: '#131311', color: '#fff' }}>
                      {stageSkills.length} skills
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {stageSkills.map((s) => (
                      <div
                        key={s.name}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.45rem 0.65rem',
                          borderRadius: 6,
                          background: '#ffffff',
                          border: '1px solid #131311',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#131311',
                        }}
                      >
                        <span>{s.name}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Weight: {s.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
