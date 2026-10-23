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
        <div className="pill-badge pill-badge-lime" style={{ marginBottom: '1rem' }}>
          <TrendingUp size={15} /> TECH COMPENSATION INDEX 2026
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#131311', letterSpacing: '-0.03em', margin: '0 0 0.75rem 0' }}>
          Live Tech Job Market & Salary Estimator
        </h1>
        <p style={{ color: '#52524e', fontSize: '1.05rem', maxWidth: 680, margin: '0 auto', lineHeight: 1.5 }}>
          Explore compensation percentiles across top engineering roles and see exactly how closing
          your technical skill gaps multiplies your career earning potential.
        </p>

        {/* Currency Switcher */}
        <div style={{ display: 'inline-flex', gap: '0.4rem', marginTop: '1.5rem', padding: '5px', borderRadius: '12px', background: '#ffffff', border: '1.5px solid #131311', boxShadow: '2px 2px 0px #131311' }}>
          {['USD', 'INR', 'EUR'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrency(c)}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '8px',
                border: currency === c ? '1.5px solid #131311' : '1.5px solid transparent',
                background: currency === c ? 'var(--accent-lime)' : 'transparent',
                color: '#131311',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: currency === c ? '1.5px 1.5px 0px #131311' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {c === 'USD' ? '🇺🇸 USD ($)' : c === 'INR' ? '🇮🇳 INR (LPA)' : '🇪🇺 EUR (€)'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Calculator Card */}
      <div
        className="neo-card animate-fadeIn"
        style={{
          padding: '2.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'inline-block', background: 'var(--accent-lime)', border: '1.5px solid #131311', borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              ROI Simulator
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#131311', letterSpacing: '-0.02em', margin: 0 }}>
              Estimated Compensation for {selectedRole}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Role Select */}
            <select
              className="form-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{ minWidth: 200, padding: '0.6rem 0.95rem', fontSize: '0.9rem', fontWeight: 700 }}
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
              style={{ minWidth: 180, padding: '0.6rem 0.95rem', fontSize: '0.9rem', fontWeight: 700 }}
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
              padding: '1.5rem',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1.5px solid #131311',
              boxShadow: '3px 3px 0px #131311',
            }}
          >
            <div style={{ color: '#52524e', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>CURRENT BASELINE</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#131311', marginTop: '0.4rem', letterSpacing: '-0.02em' }}>
              {formatCurrency(baseAmount, currency)}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#80807c', marginTop: '0.35rem' }}>
              Standard benchmark for {experienceLevel}
            </div>
          </div>

          {/* Potential Salary with Boost */}
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '12px',
              background: 'var(--accent-lime-subtle)',
              border: '1.5px solid #131311',
              boxShadow: '4px 4px 0px #131311',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#131311', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                POST-ROADMAP POTENTIAL
              </div>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: '#131311',
                  color: 'var(--accent-lime)',
                }}
              >
                +{totalBoostPct}% GAIN
              </span>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#131311', marginTop: '0.4rem', letterSpacing: '-0.02em' }}>
              {formatCurrency(boostedAmount, currency)}
            </div>
            <div style={{ fontSize: '0.84rem', color: '#131311', fontWeight: 700, marginTop: '0.35rem' }}>
              ⚡ +{formatCurrency(gainAmount, currency)} annual upside
            </div>
          </div>

          {/* Market Demand Indicator */}
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1.5px solid #131311',
              boxShadow: '3px 3px 0px #131311',
            }}
          >
            <div style={{ color: '#52524e', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>MARKET DEMAND</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#131311', marginTop: '0.4rem' }}>
              {roleData?.demand_level || 'Very High'}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  background: '#131311',
                  color: '#ffffff',
                  fontWeight: 700,
                }}
              >
                {roleData?.hiring_status || 'Aggressive Hiring'}
              </span>
              <span style={{ fontSize: '0.82rem', color: '#52524e', fontWeight: 600 }}>
                YoY: <b style={{ color: '#131311' }}>{roleData?.growth_rate_yoy || '+28%'}</b>
              </span>
            </div>
          </div>
        </div>

        {/* Skill Multipliers Checklist */}
        <div style={{ borderTop: '1.5px solid #131311', paddingTop: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#131311', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} fill="#131311" /> Select High-Value Skills to Add to Your Roadmap
            </div>
            <span className="sticker-bubble" style={{ fontSize: '1.05rem', padding: '0.2rem 0.65rem' }}>
              Click skills to see salary bump!
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            {Object.entries(premiums).map(([skill, boost]) => {
              const isChecked = selectedSkillsToLearn.includes(skill)
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '10px',
                    border: '1.5px solid #131311',
                    background: isChecked ? 'var(--accent-lime)' : '#ffffff',
                    color: '#131311',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: isChecked ? '3px 3px 0px #131311' : '1.5px 1.5px 0px #131311',
                    transform: isChecked ? 'translate(-1px, -1px)' : 'none',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <span>{skill}</span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '6px',
                      background: isChecked ? '#131311' : '#f1fccf',
                      color: isChecked ? 'var(--accent-lime)' : '#131311',
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
        <div className="neo-card">
          <h3 style={{ margin: '0 0 1.25rem 0', color: '#131311', fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={20} /> Tech Engineering Hiring Index
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(marketOverview?.hottest_roles || []).map((r) => {
              const isSelected = selectedRole === r.role
              return (
                <div
                  key={r.role}
                  onClick={() => setSelectedRole(r.role)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '10px',
                    background: isSelected ? 'var(--accent-lime)' : '#ffffff',
                    border: '1.5px solid #131311',
                    boxShadow: isSelected ? '3px 3px 0px #131311' : '1.5px 1.5px 0px #131311',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: '#131311', fontSize: '0.95rem' }}>{r.role}</div>
                    <div style={{ fontSize: '0.78rem', color: '#52524e', fontWeight: 600 }}>{r.hiring_status}</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, color: '#131311', fontSize: '0.95rem' }}>
                      {currency === 'INR' ? r.mid_salary_inr : `$${r.mid_salary_usd.toLocaleString()}`}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#131311', fontWeight: 700 }}>
                      {r.growth_rate} YoY
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Highest Paying Skills of 2026 */}
        <div className="neo-card">
          <h3 style={{ margin: '0 0 1.25rem 0', color: '#131311', fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} /> Highest-Value Tech Skills
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(marketOverview?.highest_paying_skills || []).map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.15rem',
                  borderRadius: '10px',
                  background: '#ffffff',
                  border: '1.5px solid #131311',
                  boxShadow: '1.5px 1.5px 0px #131311',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: '#131311', fontSize: '0.92rem' }}>{s.skill}</div>
                  <div style={{ fontSize: '0.78rem', color: '#80807c' }}>Domain: {s.category}</div>
                </div>

                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: 'var(--accent-lime)',
                    color: '#131311',
                    border: '1.5px solid #131311',
                    boxShadow: '1.5px 1.5px 0px #131311',
                  }}
                >
                  {s.premium} Avg Premium
                </span>
              </div>
            ))}

            {/* Top Hiring Locations */}
            <div style={{ marginTop: '0.75rem', padding: '1rem', borderRadius: '10px', background: 'var(--bg-surface-secondary)', border: '1.5px solid #131311' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#131311', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
                <MapPin size={16} /> Top Tech Hiring Hubs
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(roleData?.top_locations || ['Remote', 'Bengaluru', 'San Francisco', 'London']).map((loc) => (
                  <span
                    key={loc}
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: '999px',
                      background: '#ffffff',
                      border: '1.5px solid #131311',
                      color: '#131311',
                      boxShadow: '1px 1px 0px #131311',
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
