import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatDate } from '../../lib/helpers'
import AdminLayout from '../../components/admin/AdminLayout'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setProjects(data || []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function toggleStatus(p) {
    const next = p.status === 'published' ? 'draft' : 'published'
    await supabase.from('projects').update({ status: next }).eq('id', p.id)
    setProjects(prev => prev.map(x => x.id === p.id ? { ...x, status: next } : x))
  }

  async function remove(p) {
    if (!confirm(`Delete "${p.title}"?`)) return
    await supabase.from('projects').delete().eq('id', p.id)
    setProjects(prev => prev.filter(x => x.id !== p.id))
  }

  const published = projects.filter(p => p.status === 'published').length

  return (
    <AdminLayout title="Projects" subtitle="Manage your portfolio projects">
      <div className="flex justify-end mb-6">
        <Link to="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 rounded font-mono text-sm font-semibold"
          style={{ background: 'var(--green)', color: '#0A0E17' }}>
          <Plus size={14} /> New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total', value: projects.length },
          { label: 'Published', value: published, color: 'var(--green)' },
          { label: 'Drafts', value: projects.length - published, color: '#F59E0B' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-lg p-5 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="font-mono font-bold text-3xl mb-1" style={{ color: color || 'var(--text)' }}>{value}</p>
            <p className="font-mono text-xs" style={{ color: 'var(--muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {loading
        ? <p className="font-mono text-sm" style={{ color: 'var(--muted)' }}>Loading...</p>
        : projects.length === 0
          ? <p className="font-mono text-sm" style={{ color: 'var(--muted)' }}>No projects yet. Add one!</p>
          : (
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <div className="grid grid-cols-12 gap-4 px-5 py-3 font-mono text-xs"
                style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>
                <span className="col-span-4">Title</span>
                <span className="col-span-2">Domain</span>
                <span className="col-span-2">Status</span>
                <span className="col-span-2">Created</span>
                <span className="col-span-2 text-right">Actions</span>
              </div>
              {projects.map((p, i) => (
                <div key={p.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center"
                  style={{ borderBottom: i < projects.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div className="col-span-4">
                    <p className="font-mono text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{p.title}</p>
                    <p className="font-mono text-xs truncate" style={{ color: 'var(--muted)' }}>{p.tagline}</p>
                  </div>
                  <span className="col-span-2 font-mono text-xs" style={{ color: 'var(--muted)' }}>{p.domain}</span>
                  <span className="col-span-2">
                    <span className="font-mono text-xs px-2 py-1 rounded"
                      style={{
                        background: p.status === 'published' ? 'rgba(0,255,136,0.1)' : 'rgba(245,158,11,0.1)',
                        color: p.status === 'published' ? 'var(--green)' : '#F59E0B',
                        border: `1px solid ${p.status === 'published' ? 'rgba(0,255,136,0.2)' : 'rgba(245,158,11,0.2)'}`
                      }}>
                      {p.status}
                    </span>
                  </span>
                  <span className="col-span-2 font-mono text-xs" style={{ color: 'var(--muted)' }}>{formatDate(p.created_at)}</span>
                  <div className="col-span-2 flex justify-end gap-1">
                    <button onClick={() => toggleStatus(p)} className="p-1.5 rounded" style={{ color: 'var(--muted)' }} title="Toggle status">
                      {p.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <Link to={`/admin/projects/${p.id}`} className="p-1.5 rounded" style={{ color: 'var(--blue)' }}><Edit2 size={14} /></Link>
                    <button onClick={() => remove(p)} className="p-1.5 rounded" style={{ color: '#f87171' }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )
      }
    </AdminLayout>
  )
}
