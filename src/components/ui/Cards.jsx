import { Link } from 'react-router-dom'
import { DOMAIN_COLORS } from '../../lib/helpers'

export function TagChip({ label }) {
  return (
    <span className="font-mono text-xs px-2 py-1 rounded"
      style={{ background: 'rgba(14,165,233,0.1)', color: 'var(--blue)', border: '1px solid rgba(14,165,233,0.2)' }}>
      {label}
    </span>
  )
}

export function DomainBadge({ domain }) {
  const color = DOMAIN_COLORS[domain] || '#64748B'
  return (
    <span className="font-mono text-xs px-2 py-1 rounded"
      style={{ background: `${color}18`, color, border: `1px solid ${color}40` }}>
      {domain}
    </span>
  )
}

export function ProjectCard({ project }) {
  const tags = project.tags || []
  const shown = tags.slice(0, 3)
  const extra = tags.length - 3

  return (
    <Link to={`/projects/${project.slug}`} className="glow-card rounded-lg overflow-hidden block">
      {project.cover_image_url
        ? <img src={project.cover_image_url} alt={project.title} className="w-full h-44 object-cover" />
        : <div className="w-full h-44 flex items-center justify-center font-mono text-3xl"
            style={{ background: 'var(--border)', color: 'var(--green)' }}>&gt;_</div>
      }
      <div className="p-4 flex flex-col gap-2">
        <DomainBadge domain={project.domain} />
        <h3 className="font-mono font-semibold text-sm" style={{ color: 'var(--text)' }}>{project.title}</h3>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{project.tagline}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {shown.map(t => <TagChip key={t} label={t} />)}
          {extra > 0 && <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>+{extra}</span>}
        </div>
      </div>
    </Link>
  )
}
