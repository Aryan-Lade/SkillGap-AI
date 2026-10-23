import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  X,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authMode,
    setAuthMode,
    authPromptMessage,
    signInWithEmail,
    signUpWithEmail,
  } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  if (!isAuthModalOpen) return null

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFullName('')
    setShowPassword(false)
    setError(null)
    setSuccessMsg(null)
  }

  const handleSwitchMode = (mode) => {
    setAuthMode(mode)
    setError(null)
    setSuccessMsg(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)

    try {
      if (authMode === 'login') {
        await signInWithEmail(email.trim(), password)
        closeAuthModal()
        resetForm()
      } else {
        const res = await signUpWithEmail(email.trim(), password, fullName.trim())
        if (res.user && !res.session) {
          setSuccessMsg('Account registered! Please check your email to confirm your account.')
        } else {
          setSuccessMsg('Account successfully created! Welcome to SkillGap AI.')
          setTimeout(() => {
            closeAuthModal()
            resetForm()
          }, 1200)
        }
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError(err?.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(19, 19, 17, 0.75)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal()
      }}
    >
      <div
        className="animate-fadeIn"
        style={{
          width: '100%',
          maxWidth: 460,
          background: '#ffffff',
          borderRadius: '16px',
          border: '2px solid #131311',
          boxShadow: '8px 8px 0px #131311',
          padding: '2.25rem',
          position: 'relative',
          color: '#131311',
          maxHeight: '94vh',
          overflowY: 'auto',
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-surface-secondary, #f3f2ea)',
            border: '1.5px solid #131311',
            borderRadius: '50%',
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#131311',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '1px 1px 0px #131311',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-1px, -1px)'
            e.currentTarget.style.boxShadow = '2px 2px 0px #131311'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = '1px 1px 0px #131311'
          }}
        >
          <X size={18} />
        </button>

        {/* Top Tag & Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '3px 10px', background: 'var(--accent-lime, #c6fd50)', border: '1.5px solid #131311', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', boxShadow: '2px 2px 0px #131311' }}>
            <Sparkles size={13} />
            <span>Secure Authentication</span>
          </div>

          <h2
            style={{
              fontSize: '1.85rem',
              fontWeight: 900,
              color: '#131311',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '0.4rem',
            }}
          >
            {authMode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
          </h2>

          <p style={{ color: '#52524e', fontSize: '0.92rem', lineHeight: 1.45 }}>
            {authMode === 'login'
              ? 'Sign in to access your personalized learning roadmap and test features.'
              : 'Sign up to track skill benchmarks and unlock personalized roadmaps.'}
          </p>

          {/* Prompt Message if redirected from a protected action */}
          {authPromptMessage && (
            <div
              style={{
                marginTop: '0.85rem',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                background: '#e6f6f6',
                border: '1.5px solid #5db7b7',
                color: '#131311',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textAlign: 'left',
              }}
            >
              <ShieldCheck size={16} color="#0d9488" style={{ flexShrink: 0 }} />
              <span>{authPromptMessage}</span>
            </div>
          )}
        </div>

        {/* Mode Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            background: '#f3f2ea',
            padding: '4px',
            borderRadius: '10px',
            border: '1.5px solid #131311',
            marginBottom: '1.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => handleSwitchMode('login')}
            style={{
              flex: 1,
              padding: '0.6rem',
              border: authMode === 'login' ? '1.5px solid #131311' : '1.5px solid transparent',
              borderRadius: '7px',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              background: authMode === 'login' ? 'var(--accent-lime, #c6fd50)' : 'transparent',
              color: '#131311',
              boxShadow: authMode === 'login' ? '2px 2px 0px #131311' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('signup')}
            style={{
              flex: 1,
              padding: '0.6rem',
              border: authMode === 'signup' ? '1.5px solid #131311' : '1.5px solid transparent',
              borderRadius: '7px',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              background: authMode === 'signup' ? 'var(--accent-lime, #c6fd50)' : 'transparent',
              color: '#131311',
              boxShadow: authMode === 'signup' ? '2px 2px 0px #131311' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
              padding: '0.75rem 0.95rem',
              borderRadius: '8px',
              background: '#ffece8',
              border: '1.5px solid #ff7660',
              color: '#991b1b',
              fontSize: '0.86rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
              padding: '0.75rem 0.95rem',
              borderRadius: '8px',
              background: '#f1fccf',
              border: '1.5px solid #16a34a',
              color: '#14532d',
              fontSize: '0.86rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {authMode === 'signup' && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '0.35rem',
                  color: '#131311',
                }}
              >
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#80807c',
                  }}
                />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem 0.75rem 2.5rem',
                    borderRadius: '8px',
                    border: '1.5px solid #131311',
                    background: '#ffffff',
                    color: '#131311',
                    fontSize: '0.92rem',
                    outline: 'none',
                    fontWeight: 500,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#c6fd50')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#131311')}
                />
              </div>
            </div>
          )}

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '0.35rem',
                color: '#131311',
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#80807c',
                }}
              />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.85rem 0.75rem 2.5rem',
                  borderRadius: '8px',
                  border: '1.5px solid #131311',
                  background: '#ffffff',
                  color: '#131311',
                  fontSize: '0.92rem',
                  outline: 'none',
                  fontWeight: 500,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#c6fd50')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#131311')}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#131311',
                }}
              >
                Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#80807c',
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                  borderRadius: '8px',
                  border: '1.5px solid #131311',
                  background: '#ffffff',
                  color: '#131311',
                  fontSize: '0.92rem',
                  outline: 'none',
                  fontWeight: 500,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#c6fd50')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#131311')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#80807c',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              padding: '0.85rem',
              borderRadius: '10px',
              border: '2px solid #131311',
              background: 'var(--accent-lime, #c6fd50)',
              color: '#131311',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '3px 3px 0px #131311',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translate(-2px, -2px)'
                e.currentTarget.style.boxShadow = '5px 5px 0px #131311'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '3px 3px 0px #131311'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{authMode === 'login' ? 'Sign In to Dashboard' : 'Create Free Account'}</span>
            )}
          </button>
        </form>

        {/* Footer Switch Prompt */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.86rem', color: '#52524e' }}>
          {authMode === 'login' ? (
            <>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('signup')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#131311',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Sign up free
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#131311',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Sign in here
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
