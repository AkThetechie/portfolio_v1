import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { ProjectCard } from '../components/ui/Cards'
import { DOMAINS } from '../lib/helpers'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('projects').select('*').eq('status', 'published').order('created_at', { ascending: false })
      .then(({ data }) => { setProjects(data || []); setLoading(false) })
  }, [])

  const filtered = filter === 'All' ? projects : projects.filter(p => p.domain === filter)
  const activeDomains = ['All', ...DOMAINS.filter(d => projects.some(p => p.domain === d))]

  return (
    <main className="pt-24 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      <h1 className="font-mono font-bold text-4xl mb-2" style={{ color: 'var(--text)' }}>
        <span style={{ color: 'var(--green)' }}>&gt; </span>Projects
      </h1>
      <p className="font-mono text-sm mb-10" style={{ color: 'var(--muted)' }}>
        Things I've built, debugged, and learned from.
      </p>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {activeDomains.map(d => (
          <button key={d} onClick={() => setFilter(d)}
            className="font-mono text-xs px-3 py-1.5 rounded transition-all"
            style={{
              background: filter === d ? 'var(--green)' : 'var(--surface)',
              color: filter === d ? '#0A0E17' : 'var(--muted)',
              border: `1px solid ${filter === d ? 'var(--green)' : 'var(--border)'}`
            }}>
            {d}
          </button>
        ))}
      </div>

      {loading && (
        <p className="font-mono text-sm" style={{ color: 'var(--muted)' }}>&gt; Loading<span className="cursor">_</span></p>
      )}

      {!loading && filtered.length === 0 && (
        <p className="font-mono text-sm" style={{ color: 'var(--muted)' }}>No projects found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    </main>
  )
}
