import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/auth/AuthModal'

export default function LoginPage({ mode = 'login' }) {
  const { user, openAuthModal } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    } else {
      openAuthModal(mode)
    }
  }, [user, mode, navigate, openAuthModal])

  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <AuthModal />
    </div>
  )
}
