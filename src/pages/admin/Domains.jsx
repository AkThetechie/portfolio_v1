import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import DraggableList from '../../components/admin/DraggableList'

const ICONS = ['Cpu','Radio','Zap','GitBranch','Waves','Leaf','Box','Wifi','Server','Database','Code','Layers']
const COLORS = ['#F59E0B','#0EA5E9','#00FF88','#10B981','#EC4899','#8B5CF6','#34D399','#F97316','#06B6D4','#EF4444']

const blank = { label: '', description: '', icon: 'Cpu', color: '#00FF88', sort_order: 0 }

const inputStyle = {
  background: '#0d1117', border: '1px solid var(--border)', color: 'var(--text)',
  caretColor: 'var(--green)', borderRadius: 6, padding: '6px 10px',
  fontFamily: "'JetBrains Mono',monospace", fontSize: 12, outline: 'none'
}

export default function Domains() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null) // {id, ...fields} or {_new: true, ...fields}
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('domains').select('*').order('sort_order')
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  async function saveOrder(reordered) {
    setItems(reordered)
    await Promise.all(reordered.map((item, i) =>
      supabase.from('domains').update({ sort_order: i }).eq('id', item.id)
    ))
  }

  async function saveEdit() {
    if (!editing.label) return
    setSaving(true)
    if (editing._new) {
      await supabase.from('domains').insert({ ...editing, sort_order: items.length, _new: undefined })
    } else {
      const { _new, ...rest } = editing
      await supabase.from('domains').update(rest).eq('id', editing.id)
    }
    setSaving(false)
    setEditing(null)
    load()
  }

  async function remove(id) {
    if (!confirm('Delete this domain?')) return
    await supabase.from('domains').delete().eq('id', id)
    setItems(prev => prev.filter(x => x.id !== id))
  }

  return (
    <AdminLayout title="Domains" subtitle="What I Work With section — drag to reorder">
      <div className="max-w-2xl space-y-4">

        <DraggableList items={items} onReorder={saveOrder} renderItem={(item) => (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-6 h-6 rounded flex-shrink-0" style={{ background: `${item.color}30`, border: `1px solid ${item.color}60` }} />
              <div className="min-w-0">
                <p className="font-mono text-sm truncate" style={{ color: 'var(--text)' }}>{item.label}</p>
                <p className="font-mono text-xs truncate" style={{ color: 'var(--muted)' }}>{item.description}</p>
              </div>
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
          <Plus size={14} /> Add Domain
        </button>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-md rounded-lg p-6 space-y-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="font-mono text-sm font-semibold" style={{ color: 'var(--text)' }}>{editing._new ? 'Add Domain' : 'Edit Domain'}</p>

            <div className="space-y-3">
              <div>
                <label className="font-mono text-xs block mb-1" style={{ color: 'var(--muted)' }}>label</label>
                <input style={{ ...inputStyle, width: '100%' }} value={editing.label} onChange={e => setEditing(f => ({ ...f, label: e.target.value }))} placeholder="e.g. Robotics" />
              </div>
              <div>
                <label className="font-mono text-xs block mb-1" style={{ color: 'var(--muted)' }}>description</label>
                <input style={{ ...inputStyle, width: '100%' }} value={editing.description} onChange={e => setEditing(f => ({ ...f, description: e.target.value }))} placeholder="Short description..." />
              </div>
              <div>
                <label className="font-mono text-xs block mb-1" style={{ color: 'var(--muted)' }}>icon name (lucide)</label>
                <select style={{ ...inputStyle, width: '100%' }} value={editing.icon} onChange={e => setEditing(f => ({ ...f, icon: e.target.value }))}>
                  {ICONS.map(ic => <option key={ic}>{ic}</option>)}
                </select>
              </div>
              <div>
                <label className="font-mono text-xs block mb-2" style={{ color: 'var(--muted)' }}>color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setEditing(f => ({ ...f, color: c }))}
                      className="w-7 h-7 rounded-full transition-all"
                      style={{ background: c, outline: editing.color === c ? `2px solid white` : 'none', outlineOffset: 2 }} />
                  ))}
                  <input type="color" value={editing.color} onChange={e => setEditing(f => ({ ...f, color: e.target.value }))}
                    className="w-7 h-7 rounded-full cursor-pointer border-0" style={{ padding: 0 }} title="Custom color" />
                </div>
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
