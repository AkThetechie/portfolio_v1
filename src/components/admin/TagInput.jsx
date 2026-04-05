import { useState } from 'react'
import { X } from 'lucide-react'

export default function TagInput({ value = [], onChange, placeholder = 'Type and press Enter' }) {
  const [input, setInput] = useState('')

  function onKey(e) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      const tag = input.trim().replace(/,$/, '')
      if (tag && !value.includes(tag)) onChange([...value, tag])
      setInput('')
    } else if (e.key === 'Backspace' && !input && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 rounded min-h-10"
      style={{ background: '#0d1117', border: '1px solid var(--border)' }}>
      {value.map(t => (
        <span key={t} className="flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded"
          style={{ background: 'rgba(0,255,136,0.1)', color: 'var(--green)', border: '1px solid rgba(0,255,136,0.2)' }}>
          {t}
          <button onClick={() => onChange(value.filter(x => x !== t))} style={{ color: 'var(--muted)' }}><X size={10} /></button>
        </span>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey}
        placeholder={placeholder}
        className="bg-transparent font-mono text-sm outline-none flex-1 min-w-24"
        style={{ color: 'var(--text)', caretColor: 'var(--green)' }} />
    </div>
  )
}
