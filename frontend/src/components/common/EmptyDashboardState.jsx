import { Map, TrendingUp, Sparkles, Compass } from 'lucide-react'

export default function EmptyDashboardState({ onLoadDemo }) {
  return (
    <div
      className="glass-card animate-fadeIn"
      style={{
        padding: '3rem 2rem',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(145deg, rgba(13, 18, 33, 0.7) 0%, rgba(8, 11, 20, 0.9) 100%)',
        border: '1px solid var(--border-subtle)',
        textAlign: 'center',
        marginTop: '2rem',
      }}
    >
      <div style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: 'rgba(99, 179, 237, 0.1)',
        border: '1px solid var(--border-glow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
        boxShadow: 'var(--shadow-glow)',
      }}>
        <Compass size={32} color="var(--accent-blue)" />
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.6rem',
        fontWeight: 800,
        color: 'var(--text-primary)',
        letterSpacing: '-0.02em',
        marginBottom: '0.6rem',
      }}>
        No Roadmap or Progress Tracked Yet
      </h3>

      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
        maxWidth: 580,
        margin: '0 auto 1.75rem',
        lineHeight: 1.6,
      }}>
        Fill out your current skills and target role in the form above to run a skill gap analysis and generate your personalized learning journey, or preview a pre-loaded roadmap below.
      </p>

      {onLoadDemo && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => onLoadDemo('Full Stack Developer')}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              padding: '0.75rem 1.4rem',
            }}
          >
            <Sparkles size={16} />
            Preview Full Stack Developer Roadmap
          </button>

          <button
            onClick={() => onLoadDemo('Data Scientist')}
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              padding: '0.75rem 1.4rem',
            }}
          >
            <TrendingUp size={16} />
            Preview Data Scientist Roadmap
          </button>
        </div>
      )}
    </div>
  )
}
