import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false) }
    else navigate('/admin/dashboard')
  }

  return (
    <div className="circuit-bg min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="glow-card rounded-lg p-8">
          <p className="font-mono text-xs mb-2" style={{ color: 'var(--green)' }}>&gt; admin access</p>
          <h1 className="font-mono font-bold text-2xl mb-8" style={{ color: 'var(--text)' }}>
            Login<span className="cursor" style={{ color: 'var(--green)' }}>_</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-mono text-xs block mb-2" style={{ color: 'var(--muted)' }}>email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-2.5 rounded font-mono text-sm outline-none"
                style={{ background: '#0d1117', border: '1px solid var(--border)', color: 'var(--text)', caretColor: 'var(--green)' }}
              />
            </div>
            <div>
              <label className="font-mono text-xs block mb-2" style={{ color: 'var(--muted)' }}>password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-2.5 rounded font-mono text-sm outline-none"
                style={{ background: '#0d1117', border: '1px solid var(--border)', color: 'var(--text)', caretColor: 'var(--green)' }}
              />
            </div>

            {error && <p className="font-mono text-xs" style={{ color: '#f87171' }}>{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded font-mono text-sm font-semibold transition-opacity"
              style={{ background: 'var(--green)', color: '#0A0E17', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Authenticating...' : '> Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
