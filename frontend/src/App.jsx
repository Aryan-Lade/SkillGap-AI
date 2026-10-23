import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import JobDescriptionAnalyzer from './pages/JobDescriptionAnalyzer'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthModal from './components/auth/AuthModal'
import { LogIn, LogOut, User as UserIcon } from 'lucide-react'

function Nav() {
  const { user, openAuthModal, signOut } = useAuth()

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Learner'

  const userInitial = displayName.charAt(0).toUpperCase()

  return (
    <nav className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="nav-logo">
          SkillGap AI
        </NavLink>

        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
              🏠 Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
              🎯 Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/explore" className={({ isActive }) => (isActive ? 'active' : '')}>
              🔍 Explore
            </NavLink>
          </li>
          <li>
            <NavLink to="/job-analyzer" className={({ isActive }) => (isActive ? 'active' : '')}>
              📋 JD Matcher
            </NavLink>
          </li>
        </ul>

        {/* Auth Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 999,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'var(--gradient-hero)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {userInitial}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {displayName}
                </span>
              </div>

              <button
                onClick={signOut}
                title="Sign out"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.4rem 0.65rem',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.82rem',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent-pink)'
                  e.currentTarget.style.borderColor = 'rgba(252, 129, 129, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)'
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                }}
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => openAuthModal('login')}
                className="btn btn-secondary"
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.86rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => openAuthModal('signup')}
                className="btn btn-primary"
                style={{
                  padding: '0.45rem 1.1rem',
                  fontSize: '0.86rem',
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-layout">
          <Nav />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/job-analyzer" element={<JobDescriptionAnalyzer />} />
            </Routes>
          </main>
          <AuthModal />
          <footer
            style={{
              borderTop: '1px solid var(--border-subtle)',
              padding: '1.5rem 2rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
            }}
          >
            SkillGap AI — ML-Powered Career Readiness Platform · Random Forest Model · 90%+ Accuracy
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
