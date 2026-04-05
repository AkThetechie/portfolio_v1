import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, Github, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { TagChip, DomainBadge } from '../components/ui/Cards'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    supabase.from('projects').select('*').eq('slug', slug).eq('status', 'published').single()
      .then(({ data }) => { setProject(data); setLoading(false) })
  }, [slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-mono pt-20" style={{ color: 'var(--green)' }}>
      &gt; Loading<span className="cursor">_</span>
    </div>
  )

  if (!project) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20">
      <p className="font-mono" style={{ color: 'var(--muted)' }}>Project not found.</p>
      <Link to="/projects" className="font-mono text-sm" style={{ color: 'var(--blue)' }}>← Back to projects</Link>
    </div>
  )

  const images = project.images || []
  const components = project.components || []
  const tags = project.tags || []

  return (
    <main className="pt-24 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      {/* Back */}
      <Link to="/projects" className="inline-flex items-center gap-2 font-mono text-sm mb-8 transition-colors"
        style={{ color: 'var(--muted)' }}>
        <ArrowLeft size={14} /> Back to projects
      </Link>

      {/* Cover */}
      {project.cover_image_url && (
        <div className="rounded-lg overflow-hidden mb-8" style={{ maxHeight: 400 }}>
          <img src={project.cover_image_url} alt={project.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <DomainBadge domain={project.domain} />
          <h1 className="font-mono font-bold text-3xl md:text-4xl" style={{ color: 'var(--text)' }}>{project.title}</h1>
          <p className="text-base" style={{ color: 'var(--muted)' }}>{project.tagline}</p>
        </div>
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded font-mono text-sm transition-all"
            style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>
            <Github size={14} /> GitHub <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map(t => <TagChip key={t} label={t} />)}
        </div>
      )}

      {/* Divider */}
      <div className="mb-8" style={{ borderTop: '1px solid var(--border)' }} />

      {/* Description */}
      {project.description && (
        <div className="markdown mb-10">
          <ReactMarkdown>{project.description}</ReactMarkdown>
        </div>
      )}

      {/* Components Used */}
      {components.length > 0 && (
        <div className="mb-8">
          <h2 className="font-mono font-semibold text-sm mb-3" style={{ color: 'var(--green)' }}>
            &gt; Components Used
          </h2>
          <div className="flex flex-wrap gap-2">
            {components.map(c => (
              <span key={c} className="font-mono text-xs px-3 py-1 rounded"
                style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Challenges */}
      {project.challenges && (
        <div className="mb-8 p-5 rounded-lg"
          style={{ background: 'var(--surface)', borderLeft: '3px solid var(--amber)' }}>
          <h2 className="font-mono font-semibold text-sm mb-3" style={{ color: '#F59E0B' }}>
            &gt; Challenges &amp; Fixes
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{project.challenges}</p>
        </div>
      )}

      {/* Outcome */}
      {project.outcome && (
        <div className="mb-8 p-5 rounded-lg"
          style={{ background: 'var(--surface)', borderLeft: '3px solid var(--green)' }}>
          <h2 className="font-mono font-semibold text-sm mb-3" style={{ color: 'var(--green)' }}>
            &gt; Outcome &amp; Learnings
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{project.outcome}</p>
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="mt-10">
          <h2 className="font-mono font-semibold text-sm mb-4" style={{ color: 'var(--green)' }}>
            &gt; Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((url, i) => (
              <div key={i} className="rounded overflow-hidden cursor-pointer aspect-video"
                style={{ border: '1px solid var(--border)' }}
                onClick={() => setLightbox(url)}>
                <img src={url} alt={`${project.title} ${i + 1}`} className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TODO: Add video section when video_url support is added */}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.9)' }}
          onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Preview" className="max-w-full max-h-full rounded-lg object-contain" />
        </div>
      )}
    </main>
  )
}
