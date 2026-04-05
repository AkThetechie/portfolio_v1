import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ background: scrolled ? 'rgba(10,14,23,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? '1px solid var(--border)' : 'none' }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-mono font-bold text-lg" style={{ color: 'var(--green)' }}>
          &gt; akash<span className="cursor">_</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-8">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className="font-mono text-sm transition-colors"
              style={{ color: loc.pathname === l.to ? 'var(--green)' : 'var(--muted)' }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" style={{ color: 'var(--muted)' }} onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4" style={{ background: 'rgba(10,14,23,0.97)' }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="font-mono text-sm py-1"
              style={{ color: loc.pathname === l.to ? 'var(--green)' : 'var(--muted)' }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
