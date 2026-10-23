import React from 'react'
import RolesCatalogue from '../components/RolesCatalogue'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, Compass } from 'lucide-react'

export default function Explore() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1.5rem' }} className="animate-fadeIn">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <span className="pill-badge">
            <Compass size={14} color="#c6fd50" /> COMPREHENSIVE TECH TAXONOMY
          </span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
          Explore Industry Tech Roles & Required Skills
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 640, margin: '0 auto 1.5rem auto' }}>
          Browse all 16 standardized career paths across 128 canonical skills categorized by Foundational, Intermediate, and Applied stages.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          ⚡ Benchmark My Skills <ArrowRight size={16} />
        </button>
      </div>

      <RolesCatalogue />
    </div>
  )
}
