import { useState, useRef } from 'react'
import { GripVertical } from 'lucide-react'

// Drag-to-reorder list using HTML5 drag events — no extra library
export default function DraggableList({ items, onReorder, renderItem }) {
  const dragIndex = useRef(null)
  const [dragOver, setDragOver] = useState(null)

  function onDragStart(i) { dragIndex.current = i }

  function onDragEnter(i) { setDragOver(i) }

  function onDrop(i) {
    if (dragIndex.current === null || dragIndex.current === i) { setDragOver(null); return }
    const next = [...items]
    const [moved] = next.splice(dragIndex.current, 1)
    next.splice(i, 0, moved)
    onReorder(next)
    dragIndex.current = null
    setDragOver(null)
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={item.id ?? i}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragEnter={() => onDragEnter(i)}
          onDragOver={e => e.preventDefault()}
          onDrop={() => onDrop(i)}
          onDragEnd={() => setDragOver(null)}
          className="flex items-center gap-3 rounded-lg p-3 transition-all"
          style={{
            background: dragOver === i ? 'rgba(0,255,136,0.06)' : 'var(--surface)',
            border: `1px solid ${dragOver === i ? 'rgba(0,255,136,0.3)' : 'var(--border)'}`,
            cursor: 'grab'
          }}>
          <GripVertical size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <div className="flex-1 min-w-0">{renderItem(item, i)}</div>
        </div>
      ))}
    </div>
  )
}
