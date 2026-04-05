import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { LogOut, LayoutDashboard, Globe, Layers, Clock, Wrench, FolderOpen } from 'lucide-react'

const nav = [
  { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Projects' },
  { to: '/admin/site',       icon: Globe,           label: 'Site Config' },
  { to: '/admin/domains',    icon: Layers,          label: 'Domains' },
  { to: '/admin/timeline',   icon: Clock,           label: 'Timeline' },
  { to: '/admin/skills',     icon: Wrench,          label: 'Skills' },
]

export default function AdminLayout({ title, subtitle, children }) {
  const loc = useLocation()
  const navigate = useNavigate()

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0 flex flex-col py-8 px-4 gap-1"
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
        <Link to="/" className="font-mono font-bold text-base mb-6 px-2" style={{ color: 'var(--green)' }}>
          &gt; akash<span style={{ opacity: 0.5 }}>_</span>
        </Link>

        {nav.map(({ to, icon: Icon, label }) => {
          const active = loc.pathname === to
          return (
            <Link key={to} to={to}
              className="flex items-center gap-2.5 px-3 py-2 rounded font-mono text-xs transition-all"
              style={{
                background: active ? 'rgba(0,255,136,0.1)' : 'transparent',
                color: active ? 'var(--green)' : 'var(--muted)',
                border: active ? '1px solid rgba(0,255,136,0.2)' : '1px solid transparent'
              }}>
              <Icon size={13} /> {label}
            </Link>
          )
        })}

        <div className="mt-auto">
          <Link to="/" className="flex items-center gap-2.5 px-3 py-2 rounded font-mono text-xs mb-1"
            style={{ color: 'var(--muted)' }}>
            <FolderOpen size={13} /> View Site
          </Link>
          <button onClick={signOut}
            className="flex items-center gap-2.5 px-3 py-2 rounded font-mono text-xs w-full"
            style={{ color: '#f87171' }}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-8 py-10 overflow-y-auto">
        <div className="mb-8">
          <p className="font-mono text-xs mb-1" style={{ color: 'var(--green)' }}>&gt; admin</p>
          <h1 className="font-mono font-bold text-2xl" style={{ color: 'var(--text)' }}>{title}</h1>
          {subtitle && <p className="font-mono text-xs mt-1" style={{ color: 'var(--muted)' }}>{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  )
}
