import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import JobDescriptionAnalyzer from './pages/JobDescriptionAnalyzer'
import JobMarketInsights from './pages/JobMarketInsights'
import CodeSandbox from './pages/CodeSandbox'
import StudyPlanner from './pages/StudyPlanner'
import LoginPage from './pages/LoginPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthModal from './components/auth/AuthModal'
import AccountModal from './components/account/AccountModal'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { LogIn, LogOut, User as UserIcon, Clock, Sparkles } from 'lucide-react'

function Nav() {
  const { user, openAuthModal, openAccountModal, signOut } = useAuth()

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Learner'

  const userInitial = displayName.charAt(0).toUpperCase()

  return (
    <nav className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="nav-logo">
          ⚡ SkillGap AI
        </NavLink>

        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/explore" className={({ isActive }) => (isActive ? 'active' : '')}>
              Explore Roles
            </NavLink>
          </li>
          <li>
            <NavLink to="/job-analyzer" className={({ isActive }) => (isActive ? 'active' : '')}>
              JD Matcher
            </NavLink>
          </li>
          <li>
            <NavLink to="/job-market" className={({ isActive }) => (isActive ? 'active' : '')}>
              Market & Salary
            </NavLink>
          </li>
          <li>
            <NavLink to="/sandbox" className={({ isActive }) => (isActive ? 'active' : '')}>
              Code Sandbox
            </NavLink>
          </li>
          <li>
            <NavLink to="/planner" className={({ isActive }) => (isActive ? 'active' : '')}>
              Study Planner
            </NavLink>
          </li>
        </ul>

        {/* Auth Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {/* Account Profile & History Button */}
              <button
                onClick={openAccountModal}
                title="View your account details and past history"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 999,
                  background: 'var(--bg-surface, #ffffff)',
                  border: '1.5px solid #131311',
                  boxShadow: '2px 2px 0px #131311',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-1px, -1px)'
                  e.currentTarget.style.boxShadow = '3px 3px 0px #131311'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = '2px 2px 0px #131311'
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--accent-lime, #c6fd50)',
                    border: '1px solid #131311',
                    color: '#131311',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                  }}
                >
                  {userInitial}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#131311', fontWeight: 800 }}>
                  {displayName}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    background: '#fef3c7',
                    padding: '1px 6px',
                    borderRadius: 999,
                    border: '1px solid #131311',
                    fontWeight: 700,
                  }}
                >
                  Account & History
                </span>
              </button>

              <button
                onClick={signOut}
                title="Sign out"
                style={{
                  background: 'var(--bg-surface, #ffffff)',
                  border: '1.5px solid #131311',
                  borderRadius: '8px',
                  padding: '0.4rem 0.65rem',
                  color: '#52524e',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  boxShadow: '2px 2px 0px #131311',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#dc2626'
                  e.currentTarget.style.borderColor = '#dc2626'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#52524e'
                  e.currentTarget.style.borderColor = '#131311'
                }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => openAuthModal('login')}
                className="btn btn-outline"
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
                Get Started
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
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute featureName="Dashboard & AI Roadmap">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute featureName="Explore Roles & Skills">
                    <Explore />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/job-analyzer"
                element={
                  <ProtectedRoute featureName="Job Description Matcher">
                    <JobDescriptionAnalyzer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/job-market"
                element={
                  <ProtectedRoute featureName="Market Insights & Salary Estimator">
                    <JobMarketInsights />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sandbox"
                element={
                  <ProtectedRoute featureName="Interactive Code Sandbox">
                    <CodeSandbox />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/planner"
                element={
                  <ProtectedRoute featureName="Smart Study Planner">
                    <StudyPlanner />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPage mode="login" />} />
              <Route path="/signup" element={<LoginPage mode="signup" />} />
            </Routes>
          </main>
          <AuthModal />
          <AccountModal />
          <footer
            style={{
              background: 'var(--bg-surface, #ffffff)',
              borderTop: 'var(--border-main, 1.5px solid #131311)',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              color: '#52524e',
              fontSize: '0.85rem',
            }}
          >
            <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#131311' }}>
                <span style={{ background: 'var(--accent-lime, #c6fd50)', padding: '2px 8px', borderRadius: 4, border: '1.5px solid #131311' }}>SkillGap AI</span>
                <span>— Precision Career Roadmaps for Engineers</span>
              </div>
              <div>
                Random Forest ML Model · 128+ Technical Skills · Zero Fluff
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
