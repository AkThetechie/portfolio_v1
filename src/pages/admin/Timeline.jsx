import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import DraggableList from '../../components/admin/DraggableList'

const blank = { phase: '', label: '', description: '' }
const inputStyle = {
  background: '#0d1117', border: '1px solid var(--border)', color: 'var(--text)',
  caretColor: 'var(--green)', borderRadius: 6, padding: '6px 10px',
  fontFamily: "'JetBrains Mono',monospace", fontSize: 12, outline: 'none', width: '100%'
}

export default function Timeline() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('timeline').select('*').order('sort_order')
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  async function saveOrder(reordered) {
    setItems(reordered)
    await Promise.all(reordered.map((item, i) =>
      supabase.from('timeline').update({ sort_order: i }).eq('id', item.id)
    ))
  }

  async function saveEdit() {
    if (!editing.label) return
    setSaving(true)
    if (editing._new) {
      await supabase.from('timeline').insert({ ...editing, sort_order: items.length, _new: undefined })
    } else {
      const { _new, ...rest } = editing
      await supabase.from('timeline').update(rest).eq('id', editing.id)
    }
    setSaving(false); setEditing(null); load()
  }

  async function remove(id) {
    if (!confirm('Delete this entry?')) return
    await supabase.from('timeline').delete().eq('id', id)
    setItems(prev => prev.filter(x => x.id !== id))
  }

  return (
    <AdminLayout title="Timeline" subtitle="Your engineering journey — drag to reorder">
      <div className="max-w-2xl space-y-4">
        <DraggableList items={items} onReorder={saveOrder} renderItem={(item) => (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,255,136,0.1)', color: 'var(--green)' }}>{item.phase}</span>
                <span className="font-mono text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{item.label}</span>
              </div>
              <p className="font-mono text-xs truncate" style={{ color: 'var(--muted)' }}>{item.description}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => setEditing(item)} className="p-1.5 rounded" style={{ color: 'var(--blue)' }}><Edit2 size={13} /></button>
              <button onClick={() => remove(item.id)} className="p-1.5 rounded" style={{ color: '#f87171' }}><Trash2 size={13} /></button>
            </div>
          </div>
        )} />

        <button onClick={() => setEditing({ ...blank, _new: true })}
          className="flex items-center gap-2 px-4 py-2 rounded font-mono text-sm"
          style={{ border: '1px dashed var(--border)', color: 'var(--muted)', width: '100%', justifyContent: 'center' }}>
          <Plus size={14} /> Add Entry
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-md rounded-lg p-6 space-y-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="font-mono text-sm font-semibold" style={{ color: 'var(--text)' }}>{editing._new ? 'Add Entry' : 'Edit Entry'}</p>
            <div className="space-y-3">
              <div>
                <label className="font-mono text-xs block mb-1" style={{ color: 'var(--muted)' }}>phase (e.g. Early, Mid, Now)</label>
                <input style={inputStyle} value={editing.phase} onChange={e => setEditing(f => ({ ...f, phase: e.target.value }))} />
              </div>
              <div>
                <label className="font-mono text-xs block mb-1" style={{ color: 'var(--muted)' }}>label (project/milestone name)</label>
                <input style={inputStyle} value={editing.label} onChange={e => setEditing(f => ({ ...f, label: e.target.value }))} />
              </div>
              <div>
                <label className="font-mono text-xs block mb-1" style={{ color: 'var(--muted)' }}>description</label>
                <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={editing.description} onChange={e => setEditing(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={saveEdit} disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded font-mono text-sm font-semibold"
                style={{ background: 'var(--green)', color: '#0A0E17' }}>
                <Check size={13} /> {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setEditing(null)}
                className="flex items-center gap-1.5 px-4 py-2 rounded font-mono text-sm"
                style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>
                <X size={13} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
