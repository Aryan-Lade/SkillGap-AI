import { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Lock, Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

export default function ProtectedRoute({ children, featureName = 'this feature' }) {
  const { user, loading, openAuthModal, signInAsGuest } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      // Auto-trigger auth modal for seamless onboarding
      openAuthModal('signup', `Please sign in or create an account to test ${featureName}.`)
    }
  }, [loading, user, featureName, openAuthModal])

  if (loading) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            border: '4px solid #f3f2ea',
            borderTop: '4px solid var(--accent-lime, #c6fd50)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ fontWeight: 700, color: '#52524e' }}>Loading your session...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div
        style={{
          maxWidth: 640,
          margin: '3rem auto',
          padding: '2.5rem',
          background: '#ffffff',
          borderRadius: '16px',
          border: '2px solid #131311',
          boxShadow: '8px 8px 0px #131311',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--accent-lime, #c6fd50)',
            border: '2px solid #131311',
            boxShadow: '3px 3px 0px #131311',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
          }}
        >
          <Lock size={28} color="#131311" />
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '3px 10px', background: '#fef3c7', border: '1px solid #131311', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          <Sparkles size={13} />
          <span>Authentication Required</span>
        </div>

        <h2 style={{ fontSize: '1.85rem', fontWeight: 900, marginBottom: '0.65rem', color: '#131311' }}>
          Sign In to Access {featureName}
        </h2>

        <p style={{ color: '#52524e', fontSize: '0.98rem', lineHeight: 1.55, maxWidth: 480, margin: '0 auto 1.75rem auto' }}>
          To benchmark your skill gaps, generate tailored study roadmaps, and save your progress across devices, please sign in or register your account.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 360, margin: '0 auto' }}>
          {/* Quick Demo One-Click Access */}
          <button
            onClick={() => signInAsGuest()}
            className="btn btn-primary"
            style={{
              padding: '0.85rem 1.25rem',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <Zap size={18} fill="#131311" />
            <span>⚡ Instant Demo Access (One-Click)</span>
          </button>

          {/* Standard Sign In / Up */}
          <button
            onClick={() => openAuthModal('login')}
            className="btn btn-outline"
            style={{
              padding: '0.75rem 1.25rem',
              fontSize: '0.95rem',
            }}
          >
            Sign In with Email or Google
          </button>

          <button
            onClick={() => openAuthModal('signup')}
            style={{
              background: 'none',
              border: 'none',
              color: '#52524e',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              marginTop: '0.25rem',
            }}
          >
            Don't have an account? Sign Up Free
          </button>
        </div>
      </div>
    )
  }

  return children
}
