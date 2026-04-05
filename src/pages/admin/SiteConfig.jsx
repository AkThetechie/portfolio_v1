import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Save } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'

const inputStyle = {
  background: '#0d1117', border: '1px solid var(--border)',
  color: 'var(--text)', caretColor: 'var(--green)',
  borderRadius: 6, padding: '8px 12px',
  fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
  outline: 'none', width: '100%'
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-xs" style={{ color: 'var(--muted)' }}>{label}</label>
      {hint && <p className="font-mono text-xs" style={{ color: '#475569' }}>{hint}</p>}
      {children}
    </div>
  )
}

export default function SiteConfig() {
  const [form, setForm] = useState({
    name: '', subtitle: '', college: '', bio: '',
    currently_building_title: '', currently_building_desc: '',
    email: '', github_url: '', linkedin_url: ''
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('site_config').select('*').eq('id', 1).single()
      .then(({ data }) => { if (data) setForm(f => ({ ...f, ...data })); setLoading(false) })
  }, [])

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    await supabase.from('site_config').upsert({ ...form, id: 1 })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <AdminLayout title="Site Config"><p className="font-mono text-sm" style={{ color: 'var(--muted)' }}>Loading...</p></AdminLayout>

  return (
    <AdminLayout title="Site Config" subtitle="Edit your homepage content">
      <div className="space-y-6 max-w-2xl">

        <div className="p-5 rounded-lg space-y-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="font-mono text-xs" style={{ color: 'var(--green)' }}>// Hero Section</p>
          <Field label="your name"><input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} /></Field>
          <Field label="subtitle (degree)"><input style={inputStyle} value={form.subtitle} onChange={e => set('subtitle', e.target.value)} /></Field>
          <Field label="college"><input style={inputStyle} value={form.college} onChange={e => set('college', e.target.value)} /></Field>
          <Field label="bio (shown under name)">
            <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.bio} onChange={e => set('bio', e.target.value)} />
          </Field>
        </div>

        <div className="p-5 rounded-lg space-y-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="font-mono text-xs" style={{ color: 'var(--green)' }}>// Currently Building</p>
          <Field label="title"><input style={inputStyle} value={form.currently_building_title} onChange={e => set('currently_building_title', e.target.value)} /></Field>
          <Field label="description">
            <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.currently_building_desc} onChange={e => set('currently_building_desc', e.target.value)} />
          </Field>
        </div>

        <div className="p-5 rounded-lg space-y-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="font-mono text-xs" style={{ color: 'var(--green)' }}>// Contact Info</p>
          <Field label="email"><input style={inputStyle} value={form.email} onChange={e => set('email', e.target.value)} /></Field>
          <Field label="github url"><input style={inputStyle} value={form.github_url} onChange={e => set('github_url', e.target.value)} /></Field>
          <Field label="linkedin url"><input style={inputStyle} value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} /></Field>
        </div>

        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded font-mono text-sm font-semibold"
          style={{ background: saved ? '#10B981' : 'var(--green)', color: '#0A0E17', opacity: saving ? 0.7 : 1 }}>
          <Save size={14} /> {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </AdminLayout>
  )
}
