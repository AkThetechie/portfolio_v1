import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function ProtectedRoute({ children }) {
  const [state, setState] = useState('loading') // loading | authed | unauthed

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setState(data.session ? 'authed' : 'unauthed')
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setState(session ? 'authed' : 'unauthed')
    })
    return () => subscription.unsubscribe()
  }, [])

  if (state === 'loading') return (
    <div className="min-h-screen flex items-center justify-center font-mono" style={{ color: 'var(--green)' }}>
      &gt; Authenticating<span className="cursor">_</span>
    </div>
  )
  if (state === 'unauthed') return <Navigate to="/admin/login" replace />
  return children
}
