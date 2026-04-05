import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Cpu, Radio, Zap, GitBranch, Waves, Leaf, Box, Wifi, Server, Database, Code, Layers } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { ProjectCard } from '../components/ui/Cards'

const ICON_MAP = { Cpu, Radio, Zap, GitBranch, Waves, Leaf, Box, Wifi, Server, Database, Code, Layers }

const DEFAULT_CONFIG = {
  name: 'R Akash', subtitle: 'Electronics & Computer Engineering', college: 'VIT Chennai',
  bio: "I build hardware and software systems — from solar microgrids to robotic arms. Most of what I know came from things breaking and figuring out why.",
  currently_building_title: 'Exploring ROS + Gazebo',
  currently_building_desc: 'Working through autonomous navigation and sensor fusion concepts in simulation.',
}

export default function Home() {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [featured, setFeatured] = useState([])
  const [domains, setDomains] = useState([])

  useEffect(() => {
    supabase.from('site_config').select('*').eq('id', 1).single().then(({ data }) => { if (data) setConfig(data) })
    supabase.from('projects').select('*').eq('status', 'published').eq('featured', true).limit(3).then(({ data }) => setFeatured(data || []))
    supabase.from('domains').select('*').order('sort_order').then(({ data }) => setDomains(data || []))
  }, [])

  return (
    <main className="circuit-bg min-h-screen">

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center px-6 max-w-4xl mx-auto pt-20">
        <p className="font-mono text-sm mb-4 fade-up" style={{ color: 'var(--green)' }}>&gt; Initializing portfolio...</p>
        <h1 className="font-mono font-bold text-5xl md:text-7xl mb-4 fade-up-1" style={{ color: 'var(--text)' }}>
          {config.name}<span className="cursor" style={{ color: 'var(--green)' }}>_</span>
        </h1>
        <p className="font-mono text-lg md:text-xl mb-6 fade-up-2" style={{ color: 'var(--muted)' }}>
          {config.subtitle}&nbsp;<span style={{ color: 'var(--border)' }}>//</span>&nbsp;{config.college}
        </p>
        <p className="text-base md:text-lg max-w-xl mb-10 leading-relaxed fade-up-3" style={{ color: '#94a3b8' }}>
          {config.bio}
        </p>
        <div className="flex gap-4 flex-wrap fade-up-4">
          <Link to="/projects" className="flex items-center gap-2 px-6 py-3 rounded font-mono text-sm font-semibold"
            style={{ background: 'var(--green)', color: '#0A0E17' }}>
            View Projects <ArrowRight size={16} />
          </Link>
          <Link to="/about" className="flex items-center gap-2 px-6 py-3 rounded font-mono text-sm"
            style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>
            About Me
          </Link>
        </div>
      </section>

      {/* Featured Projects */}
      {featured.length > 0 && (
        <section className="px-6 py-20 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-mono font-semibold text-xl" style={{ color: 'var(--text)' }}>
              <span style={{ color: 'var(--green)' }}>&gt; </span>Featured Projects
            </h2>
            <Link to="/projects" className="font-mono text-sm flex items-center gap-1" style={{ color: 'var(--blue)' }}>
              All projects <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featured.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>
      )}

      {/* What I Work With */}
      {domains.length > 0 && (
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <h2 className="font-mono font-semibold text-xl mb-8" style={{ color: 'var(--text)' }}>
            <span style={{ color: 'var(--green)' }}>&gt; </span>What I Work With
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {domains.map(({ id, label, icon, color, description }) => {
              const Icon = ICON_MAP[icon] || Cpu
              return (
                <div key={id} className="glow-card rounded-lg p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}18`, color }}>
                      <Icon size={16} />
                    </div>
                    <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{description}</p>
                  <div className="h-0.5 w-8 rounded" style={{ background: color }} />
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Currently Building */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="font-mono font-semibold text-xl mb-6" style={{ color: 'var(--text)' }}>
          <span style={{ color: 'var(--green)' }}>&gt; </span>Currently Building
        </h2>
        <div className="glow-card rounded-lg p-6 max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--green)', boxShadow: '0 0 6px var(--green)' }} />
            <p className="font-mono text-xs" style={{ color: 'var(--green)' }}>active</p>
          </div>
          <p className="font-mono font-semibold mb-2" style={{ color: 'var(--text)' }}>{config.currently_building_title}</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{config.currently_building_desc}</p>
        </div>
      </section>
    </main>
  )
}
