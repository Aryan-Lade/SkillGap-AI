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
  Zap,
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
    signInWithGoogle,
    signInAsGuest,
  } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
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
          setSuccessMsg('Account registered! Please check your email to confirm your account, or use Demo Mode for instant access.')
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
      const msg = err?.message || 'Authentication failed. Please check your credentials.'
      if (msg.toLowerCase().includes('email not confirmed')) {
        setError('Email confirmation required by Supabase. You can also click "Instant Demo Access" below to test immediately.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err?.message || 'Google authentication failed. Ensure Google OAuth is enabled in Supabase.')
      setGoogleLoading(false)
    }
  }

  const handleDemoSignIn = () => {
    signInAsGuest(
      authMode === 'signup' && fullName.trim() ? fullName.trim() : 'Alex Rivera (Demo Student)',
      email.trim() || 'alex.tester@skillgap.ai'
    )
    closeAuthModal()
    resetForm()
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
          maxWidth: 480,
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
            marginBottom: '1.25rem',
          }}
        >
          <button
            type="button"
            onClick={() => handleSwitchMode('login')}
            style={{
              flex: 1,
              padding: '0.55rem',
              border: authMode === 'login' ? '1.5px solid #131311' : '1.5px solid transparent',
              borderRadius: '7px',
              fontSize: '0.88rem',
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
              padding: '0.55rem',
              border: authMode === 'signup' ? '1.5px solid #131311' : '1.5px solid transparent',
              borderRadius: '7px',
              fontSize: '0.88rem',
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

        {/* Quick Demo Login Banner */}
        <button
          type="button"
          onClick={handleDemoSignIn}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            background: '#fef3c7',
            border: '2px solid #131311',
            boxShadow: '3px 3px 0px #131311',
            color: '#131311',
            fontSize: '0.92rem',
            fontWeight: 800,
            cursor: 'pointer',
            marginBottom: '1rem',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-1px, -1px)'
            e.currentTarget.style.boxShadow = '4px 4px 0px #131311'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = '3px 3px 0px #131311'
          }}
        >
          <Zap size={18} fill="#f59e0b" color="#d97706" />
          <span>⚡ Instant Demo Access (One-Click Test)</span>
        </button>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            background: '#ffffff',
            border: '1.5px solid #131311',
            boxShadow: '2px 2px 0px #131311',
            color: '#131311',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: googleLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            marginBottom: '1.25rem',
          }}
          onMouseEnter={(e) => {
            if (!googleLoading) {
              e.currentTarget.style.transform = 'translate(-1px, -1px)'
              e.currentTarget.style.boxShadow = '3px 3px 0px #131311'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = '2px 2px 0px #131311'
          }}
        >
          {googleLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Continue with Google / Gmail</span>
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            margin: '1.25rem 0',
            color: '#80807c',
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 700,
          }}
        >
          <div style={{ flex: 1, height: 1.5, background: '#e5e7eb' }} />
          <span>or with email & password</span>
          <div style={{ flex: 1, height: 1.5, background: '#e5e7eb' }} />
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
              marginBottom: '1rem',
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
              marginBottom: '1rem',
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
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
              {authMode === 'login' && (
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: '#52524e',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                  onClick={() => alert('Password reset: Please sign in via Google OAuth or use Instant Demo Access.')}
                >
                  Forgot password?
                </span>
              )}
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

        {/* Footer Note */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.82rem', color: '#80807c' }}>
          By continuing, you agree to SkillGap AI terms of service and privacy policy.
        </div>
      </div>
    </div>
  )
}
