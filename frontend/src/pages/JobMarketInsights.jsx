import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Sparkles,
  MapPin,
  ArrowUpRight,
  ShieldAlert,
  Zap,
  Globe,
  Award,
} from 'lucide-react'
import { getMarketOverview, getRoleMarketData, estimateSalaryBoost } from '../api/client'

const ROLES_LIST = [
  'ML Engineer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Data Scientist',
  'Cybersecurity Analyst',
  'Full Stack Developer',
  'Backend Developer',
  'Frontend Developer',
]

export default function JobMarketInsights() {
  const [currency, setCurrency] = useState('USD') // 'USD' | 'INR' | 'EUR'
  const [selectedRole, setSelectedRole] = useState('ML Engineer')
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level (2-5 yrs)')
  const [roleData, setRoleData] = useState(null)
  const [marketOverview, setMarketOverview] = useState(null)
  const [selectedSkillsToLearn, setSelectedSkillsToLearn] = useState(['MLOps', 'Docker'])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMarketOverview()
      .then((res) => setMarketOverview(res.data))
      .catch((err) => console.error('Failed to load market overview', err))
  }, [])

  useEffect(() => {
    setLoading(true)
    getRoleMarketData(selectedRole)
      .then((res) => {
        setRoleData(res.data)
        const availablePremiums = Object.keys(res.data.skill_premiums || {})
        setSelectedSkillsToLearn(availablePremiums.slice(0, 2))
      })
      .catch((err) => console.error('Failed to load role market data', err))
      .finally(() => setLoading(false))
  }, [selectedRole])

  const toggleSkill = (skill) => {
    if (selectedSkillsToLearn.includes(skill)) {
      setSelectedSkillsToLearn(selectedSkillsToLearn.filter((s) => s !== skill))
    } else {
      setSelectedSkillsToLearn([...selectedSkillsToLearn, skill])
    }
  }

  // Calculate live dynamic salary boost
  const baseBand = roleData?.salary_bands?.[experienceLevel] || { usd: 120000, inr_lpa: 16.0, eur: 85000 }
  const premiums = roleData?.skill_premiums || {}

  let totalBoostPct = 0
  selectedSkillsToLearn.forEach((s) => {
    if (premiums[s]) totalBoostPct += premiums[s]
  })
  totalBoostPct = Math.min(totalBoostPct, 45)

  const formatCurrency = (amount, cur) => {
    if (cur === 'USD') return `$${Math.round(amount).toLocaleString()}`
    if (cur === 'EUR') return `€${Math.round(amount).toLocaleString()}`
    if (cur === 'INR') return `₹${amount.toFixed(1)} LPA`
    return `${amount}`
  }

  const baseAmount =
    currency === 'USD' ? baseBand.usd : currency === 'EUR' ? baseBand.eur : baseBand.inr_lpa

  const boostedAmount =
    currency === 'INR'
      ? parseFloat((baseAmount * (1 + totalBoostPct / 100)).toFixed(1))
      : Math.round(baseAmount * (1 + totalBoostPct / 100))

  const gainAmount =
    currency === 'INR'
      ? parseFloat((boostedAmount - baseAmount).toFixed(1))
      : boostedAmount - baseAmount

  return (
    <div style={{ maxWidth: 1150, margin: '2rem auto', padding: '0 1rem' }}>
      {/* Hero Title */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 1rem',
            borderRadius: 999,
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          <TrendingUp size={16} /> Tech Industry Hiring & Compensation Index (2026)
        </div>
        <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
          Live Tech Job Market & Salary Estimator
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: 680, margin: '0 auto' }}>
          Explore compensation percentiles across top engineering roles and see exactly how closing
          your technical skill gaps multiplies your career earning potential.
        </p>

        {/* Currency Switcher */}
        <div style={{ display: 'inline-flex', gap: '0.4rem', marginTop: '1.25rem', padding: '4px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {['USD', 'INR', 'EUR'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrency(c)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: 8,
                border: 'none',
                background: currency === c ? 'rgba(99, 102, 241, 0.35)' : 'transparent',
                color: currency === c ? '#a5b4fc' : '#94a3b8',
                fontWeight: currency === c ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              {c === 'USD' ? '🇺🇸 USD ($)' : c === 'INR' ? '🇮🇳 INR (LPA)' : '🇪🇺 EUR (€)'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Calculator Card */}
      <div
        className="glass-card animate-fadeIn"
        style={{
          border: '1px solid rgba(99, 102, 241, 0.35)',
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.5) 0%, rgba(15, 23, 42, 0.75) 100%)',
          padding: '2rem',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ color: '#a5b4fc', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Interactive Career ROI Simulator
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: '0.25rem 0 0 0' }}>
              Estimated Compensation for {selectedRole}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Role Select */}
            <select
              className="form-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{ minWidth: 200, padding: '0.55rem 0.85rem', fontSize: '0.88rem' }}
            >
              {ROLES_LIST.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Experience Level Select */}
            <select
              className="form-select"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              style={{ minWidth: 180, padding: '0.55rem 0.85rem', fontSize: '0.88rem' }}
            >
              <option value="Junior (0-2 yrs)">Junior (0-2 yrs)</option>
              <option value="Mid-Level (2-5 yrs)">Mid-Level (2-5 yrs)</option>
              <option value="Senior (5-8 yrs)">Senior (5-8 yrs)</option>
              <option value="Staff / Lead (8+ yrs)">Staff / Lead (8+ yrs)</option>
            </select>
          </div>
        </div>

        {/* Dynamic ROI Metrics Display */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Base Salary */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 12,
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>CURRENT BASELINE SALARY</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.35rem' }}>
              {formatCurrency(baseAmount, currency)}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
              Standard industry benchmark for {experienceLevel}
            </div>
          </div>

          {/* Potential Salary with Boost */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#6ee7b7', fontSize: '0.82rem', fontWeight: 700 }}>
                POTENTIAL POST-ROADMAP SALARY
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: 'rgba(52, 211, 153, 0.25)',
                  color: '#34d399',
                }}
              >
                +{totalBoostPct}% GAIN
              </span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#34d399', marginTop: '0.35rem' }}>
              {formatCurrency(boostedAmount, currency)}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#a7f3d0', marginTop: '0.25rem' }}>
              + {formatCurrency(gainAmount, currency)} annual earnings upside
            </div>
          </div>

          {/* Market Demand Indicator */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 12,
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>MARKET DEMAND & HIRING STATUS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c084fc', marginTop: '0.35rem' }}>
              {roleData?.demand_level || 'Very High'}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: 'rgba(168, 85, 247, 0.2)',
                  color: '#d8b4fe',
                  fontWeight: 600,
                }}
              >
                {roleData?.hiring_status || 'Aggressive Hiring'}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Growth: <b style={{ color: '#4ade80' }}>{roleData?.growth_rate_yoy || '+28%'}</b>
              </span>
            </div>
          </div>
        </div>

        {/* Skill Multipliers Checklist */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={16} color="#fbbf24" /> Select High-Value Skills to Add to Your Roadmap
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Click to simulate your salary boost
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {Object.entries(premiums).map(([skill, boost]) => {
              const isChecked = selectedSkillsToLearn.includes(skill)
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  style={{
                    padding: '0.55rem 0.9rem',
                    borderRadius: 10,
                    border: isChecked ? '1px solid #34d399' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: isChecked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: isChecked ? '#6ee7b7' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: isChecked ? 600 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.15s ease-in-out',
                  }}
                >
                  <span>{skill}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: isChecked ? 'rgba(52, 211, 153, 0.3)' : 'rgba(255, 255, 255, 0.07)',
                      color: isChecked ? '#fff' : '#cbd5e1',
                    }}
                  >
                    +{boost}%
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Role Comparison Table & Highest Paying Skills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* Industry Benchmarks */}
        <div className="glass-card">
          <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={20} color="#818cf8" /> Tech Engineering Hiring Index
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(marketOverview?.hottest_roles || []).map((r) => (
              <div
                key={r.role}
                onClick={() => setSelectedRole(r.role)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 10,
                  background: selectedRole === r.role ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: selectedRole === r.role ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>{r.role}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{r.hiring_status}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.88rem' }}>
                    {currency === 'INR' ? r.mid_salary_inr : `$${r.mid_salary_usd.toLocaleString()}`}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#a5b4fc', fontWeight: 600 }}>
                    {r.growth_rate} YoY
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highest Paying Skills of 2026 */}
        <div className="glass-card">
          <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="#f59e0b" /> Highest-Value Tech Skills
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(marketOverview?.highest_paying_skills || []).map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.88rem' }}>{s.skill}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Domain: {s.category}</div>
                </div>

                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: 999,
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  {s.premium} Avg Premium
                </span>
              </div>
            ))}

            {/* Top Hiring Locations */}
            <div style={{ marginTop: '0.5rem', padding: '0.85rem', borderRadius: 10, background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <MapPin size={15} color="#818cf8" /> Top Tech Hiring Hubs
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(roleData?.top_locations || ['Remote', 'Bengaluru', 'San Francisco', 'London']).map((loc) => (
                  <span
                    key={loc}
                    style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#cbd5e1',
                    }}
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
