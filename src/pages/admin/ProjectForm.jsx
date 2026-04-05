import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { slugify, DOMAINS } from '../../lib/helpers'
import TagInput from '../../components/admin/TagInput'
import ImageUploader from '../../components/admin/ImageUploader'

const empty = {
  title: '', slug: '', tagline: '', domain: DOMAINS[0],
  tags: [], components: [], status: 'draft', featured: false,
  description: '', challenges: '', outcome: '', github_url: '',
  cover_image_url: '', images: [],
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-xs" style={{ color: 'var(--muted)' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  background: '#0d1117', border: '1px solid var(--border)',
  color: 'var(--text)', caretColor: 'var(--green)',
  borderRadius: 6, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, outline: 'none', width: '100%'
}

export default function ProjectForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    if (isEdit) {
      supabase.from('projects').select('*').eq('id', id).single()
        .then(({ data }) => { if (data) setForm({ ...empty, ...data }) })
    }
  }, [id])

  function set(key, val) {
    setForm(f => {
      const next = { ...f, [key]: val }
      if (key === 'title' && !isEdit) next.slug = slugify(val)
      return next
    })
  }

  async function save() {
    if (!form.title || !form.slug) { setError('Title and slug are required.'); return }
    setSaving(true)
    setError('')
    const now = new Date().toISOString()
    const payload = { ...form, updated_at: now }

    let err
    if (isEdit) {
      ({ error: err } = await supabase.from('projects').update(payload).eq('id', id))
    } else {
      delete payload.id
      payload.created_at = now
      ;({ error: err } = await supabase.from('projects').insert(payload))
    }

    if (err) { setError(err.message); setSaving(false) }
    else navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs mb-1" style={{ color: 'var(--green)' }}>&gt; {isEdit ? 'edit' : 'new'} project</p>
          <h1 className="font-mono font-bold text-2xl" style={{ color: 'var(--text)' }}>
            {isEdit ? 'Edit Project' : 'Add Project'}
          </h1>
        </div>
        <Link to="/admin/dashboard" className="font-mono text-sm" style={{ color: 'var(--muted)' }}>← Dashboard</Link>
      </div>

      <div className="space-y-6">
        {/* Title + Slug */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="title *">
            <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Project Title" />
          </Field>
          <Field label="slug *">
            <input style={inputStyle} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="url-safe-slug" />
          </Field>
        </div>

        {/* Tagline */}
        <Field label="tagline">
          <input style={inputStyle} value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="One-line description" />
        </Field>

        {/* Domain + Status + Featured */}
        <div className="grid grid-cols-3 gap-4">
          <Field label="domain">
            <select style={inputStyle} value={form.domain} onChange={e => set('domain', e.target.value)}>
              {DOMAINS.map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="status">
            <select style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <Field label="featured on home?">
            <select style={inputStyle} value={form.featured ? 'yes' : 'no'} onChange={e => set('featured', e.target.value === 'yes')}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </Field>
        </div>

        {/* Tags */}
        <Field label="tech tags (Enter to add)">
          <TagInput value={form.tags} onChange={v => set('tags', v)} placeholder="e.g. Arduino, Python..." />
        </Field>

        {/* Components */}
        <Field label="components used (Enter to add)">
          <TagInput value={form.components} onChange={v => set('components', v)} placeholder="e.g. ESP8266, Op-Amp..." />
        </Field>

        {/* GitHub */}
        <Field label="github url (optional)">
          <input style={inputStyle} value={form.github_url} onChange={e => set('github_url', e.target.value)} placeholder="https://github.com/..." />
        </Field>

        {/* Description */}
        <Field label="description (markdown supported)">
          <div className="flex gap-2 mb-1">
            <button onClick={() => setPreview(false)} className="font-mono text-xs px-3 py-1 rounded"
              style={{ background: !preview ? 'var(--green)' : 'var(--border)', color: !preview ? '#0A0E17' : 'var(--muted)' }}>
              Edit
            </button>
            <button onClick={() => setPreview(true)} className="font-mono text-xs px-3 py-1 rounded"
              style={{ background: preview ? 'var(--green)' : 'var(--border)', color: preview ? '#0A0E17' : 'var(--muted)' }}>
              Preview
            </button>
          </div>
          {preview
            ? <div className="markdown p-4 rounded min-h-32" style={{ background: '#0d1117', border: '1px solid var(--border)' }}>
                {form.description || <span style={{ color: 'var(--muted)' }}>Nothing to preview.</span>}
              </div>
            : <textarea rows={8} style={{ ...inputStyle, resize: 'vertical' }}
                value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Write about the project in markdown..." />
          }
        </Field>

        {/* Challenges */}
        <Field label="challenges & fixes">
          <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }}
            value={form.challenges} onChange={e => set('challenges', e.target.value)}
            placeholder="What broke, what you learned..." />
        </Field>

        {/* Outcome */}
        <Field label="outcome & learnings">
          <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }}
            value={form.outcome} onChange={e => set('outcome', e.target.value)}
            placeholder="What you built, what you took away..." />
        </Field>

        {/* Cover Image */}
        <ImageUploader label="Cover Image" value={form.cover_image_url} onChange={v => set('cover_image_url', v)} />

        {/* Gallery Images */}
        <ImageUploader label="Gallery Images (multiple)" value={form.images} onChange={v => set('images', v)} multiple />

        {/* TODO: Add video_url field when video upload support is added */}

        {/* Error */}
        {error && <p className="font-mono text-xs" style={{ color: '#f87171' }}>{error}</p>}

        {/* Save */}
        <div className="flex gap-3 pt-2">
          <button onClick={save} disabled={saving}
            className="px-6 py-2.5 rounded font-mono text-sm font-semibold transition-opacity"
            style={{ background: 'var(--green)', color: '#0A0E17', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving...' : isEdit ? '> Save Changes' : '> Create Project'}
          </button>
          <Link to="/admin/dashboard"
            className="px-6 py-2.5 rounded font-mono text-sm"
            style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}
