import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Upload, X } from 'lucide-react'

export default function ImageUploader({ value, onChange, multiple = false, label = 'Upload Image' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    setError('')
    try {
      const urls = []
      for (const file of files) {
        const ext = file.name.split('.').pop()
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: upErr } = await supabase.storage.from('project-images').upload(path, file)
        if (upErr) throw upErr
        const { data } = supabase.storage.from('project-images').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
      if (multiple) {
        onChange([...(value || []), ...urls])
      } else {
        onChange(urls[0])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  function remove(url) {
    if (multiple) onChange((value || []).filter(u => u !== url))
    else onChange('')
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-xs mb-1" style={{ color: 'var(--muted)' }}>{label}</label>

      <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded border font-mono text-sm w-fit"
        style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
        <Upload size={14} />
        {uploading ? 'Uploading...' : 'Choose file(s)'}
        <input type="file" accept="image/*" multiple={multiple} className="hidden" onChange={handleFile} disabled={uploading} />
      </label>

      {error && <p className="text-xs font-mono" style={{ color: '#f87171' }}>{error}</p>}

      {/* Preview */}
      <div className="flex flex-wrap gap-2 mt-1">
        {multiple
          ? (value || []).map(url => <Thumb key={url} url={url} onRemove={() => remove(url)} />)
          : value ? <Thumb url={value} onRemove={() => remove(value)} /> : null
        }
      </div>

      {/* TODO: Add video upload support */}
    </div>
  )
}

function Thumb({ url, onRemove }) {
  return (
    <div className="relative w-20 h-20 rounded overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <img src={url} alt="" className="w-full h-full object-cover" />
      <button onClick={onRemove} className="absolute top-1 right-1 rounded-full p-0.5"
        style={{ background: 'rgba(0,0,0,0.7)', color: '#f87171' }}>
        <X size={10} />
      </button>
    </div>
  )
}
