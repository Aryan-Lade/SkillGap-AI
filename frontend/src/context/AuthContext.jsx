import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../api/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'signup'
  const [authPromptMessage, setAuthPromptMessage] = useState('')
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)

  useEffect(() => {
    // 1. Check local demo user first if saved
    const savedDemo = localStorage.getItem('skillgap_demo_user')
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo)
        setUser(parsed)
        setLoading(false)
        return
      } catch (e) {
        localStorage.removeItem('skillgap_demo_user')
      }
    }

    // 2. Check Supabase session
    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        setSession(currentSession)
        if (currentSession?.user) {
          setUser(currentSession.user)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })

    // 3. Listen for auth changes (sign in, sign out, token refresh, OAuth callback)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession?.user) {
        setUser(newSession.user)
        localStorage.removeItem('skillgap_demo_user')
      }
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Email / Password Login
  const signInWithEmail = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    localStorage.removeItem('skillgap_demo_user')
    setUser(data.user)
    setSession(data.session)
    setIsAuthModalOpen(false)
    setAuthPromptMessage('')
    return data
  }, [])

  // Email / Password Sign Up
  const signUpWithEmail = useCallback(async (email, password, fullName = '') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    if (error) throw error
    if (data.session && data.user) {
      localStorage.removeItem('skillgap_demo_user')
      setUser(data.user)
      setSession(data.session)
    } else if (data.user && !data.session) {
      // If email confirmation is enabled on Supabase, grant immediate authenticated session for tester/user
      const confirmedUser = {
        ...data.user,
        user_metadata: {
          ...(data.user.user_metadata || {}),
          full_name: fullName || 'SkillGap Engineer',
        },
      }
      setUser(confirmedUser)
      localStorage.setItem('skillgap_demo_user', JSON.stringify(confirmedUser))
    }
    return data
  }, [])

  // Sign In with Google (Gmail OAuth)
  const signInWithGoogle = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (error) throw error
    return data
  }, [])

  // One-Click Instant Demo Login (for testing without email confirmation delays)
  const signInAsGuest = useCallback((customName = '', customEmail = '') => {
    const demoUser = {
      id: 'demo_' + Date.now().toString(36),
      email: customEmail.trim() || 'developer.tester@skillgap.ai',
      user_metadata: {
        full_name: customName.trim() || 'Alex Rivera (Demo Student)',
        target_role: 'Full Stack Developer',
        is_demo: true,
      },
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    }
    setUser(demoUser)
    localStorage.setItem('skillgap_demo_user', JSON.stringify(demoUser))
    setIsAuthModalOpen(false)
    setAuthPromptMessage('')
    return demoUser
  }, [])

  // Sign Out
  const signOut = useCallback(async () => {
    localStorage.removeItem('skillgap_demo_user')
    setUser(null)
    setSession(null)
    setIsAccountModalOpen(false)
    try {
      await supabase.auth.signOut()
    } catch (e) {
      // Ignored if user was offline or in demo mode
    }
  }, [])

  // Update Profile Name or metadata
  const updateProfile = useCallback(
    (fullName, targetRole) => {
      if (!user) return
      const updated = {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          full_name: fullName,
          target_role: targetRole || user.user_metadata?.target_role,
        },
      }
      setUser(updated)
      if (localStorage.getItem('skillgap_demo_user')) {
        localStorage.setItem('skillgap_demo_user', JSON.stringify(updated))
      }
    },
    [user]
  )

  const openAuthModal = useCallback((mode = 'login', message = '') => {
    setAuthMode(mode)
    setAuthPromptMessage(message)
    setIsAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false)
    setAuthPromptMessage('')
  }, [])

  const openAccountModal = useCallback(() => {
    setIsAccountModalOpen(true)
  }, [])

  const closeAccountModal = useCallback(() => {
    setIsAccountModalOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signInAsGuest,
      signOut,
      updateProfile,
      isAuthModalOpen,
      authMode,
      authPromptMessage,
      openAuthModal,
      closeAuthModal,
      setAuthMode,
      isAccountModalOpen,
      openAccountModal,
      closeAccountModal,
    }),
    [
      user,
      session,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signInAsGuest,
      signOut,
      updateProfile,
      isAuthModalOpen,
      authMode,
      authPromptMessage,
      openAuthModal,
      closeAuthModal,
      setAuthMode,
      isAccountModalOpen,
      openAccountModal,
      closeAccountModal,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
