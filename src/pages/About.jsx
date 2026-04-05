import { useEffect, useState } from 'react'
import { Github, Linkedin, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function About() {
  const [config, setConfig] = useState(null)
  const [skills, setSkills] = useState([])
  const [timeline, setTimeline] = useState([])

  useEffect(() => {
    supabase.from('site_config').select('*').eq('id', 1).single().then(({ data }) => setConfig(data))
    supabase.from('skills').select('*').order('sort_order').then(({ data }) => setSkills(data || []))
    supabase.from('timeline').select('*').order('sort_order').then(({ data }) => setTimeline(data || []))
  }, [])

  const email = config?.email || 'akash.r2024@vitstudent.ac.in'
  const github = config?.github_url || 'https://github.com/AkThetechie'
  const linkedin = config?.linkedin_url || 'https://linkedin.com/in/akash-r-6a4bb4321'
  const bio = config?.bio || "Second-year ECE student at VIT Chennai."

  return (
    <main className="pt-24 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <h1 className="font-mono font-bold text-4xl mb-2" style={{ color: 'var(--text)' }}>
        <span style={{ color: 'var(--green)' }}>&gt; </span>About
      </h1>
      <p className="font-mono text-sm mb-12" style={{ color: 'var(--muted)' }}>Who I am and how I work.</p>

      {/* Bio */}
      <div className="mb-14 max-w-2xl space-y-4 text-base leading-relaxed" style={{ color: '#94a3b8' }}>
        <p>{bio}</p>
        <p>I'm particularly interested in how embedded systems and IoT connect to real-world problems — agriculture, sustainability, and energy being areas I care about.</p>
        <p>Right now I'm exploring ROS and autonomous systems, working toward building things that could operate meaningfully in the field.</p>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-14">
          <h2 className="font-mono font-semibold text-lg mb-6" style={{ color: 'var(--text)' }}>
            <span style={{ color: 'var(--green)' }}>&gt; </span>Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {skills.map(({ id, category, items }) => (
              <div key={id} className="glow-card rounded-lg p-5">
                <p className="font-mono text-xs mb-3" style={{ color: 'var(--green)' }}>// {category}</p>
                <div className="flex flex-wrap gap-2">
                  {(items || []).map(item => (
                    <span key={item} className="font-mono text-xs px-2 py-1 rounded"
                      style={{ background: 'var(--border)', color: 'var(--muted)' }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <section className="mb-14">
          <h2 className="font-mono font-semibold text-lg mb-6" style={{ color: 'var(--text)' }}>
            <span style={{ color: 'var(--green)' }}>&gt; </span>Engineering Timeline
          </h2>
          <div className="relative pl-6" style={{ borderLeft: '2px solid var(--border)' }}>
            {timeline.map((item, i) => (
              <div key={item.id} className="mb-8 relative">
                <div className="absolute -left-[25px] w-3 h-3 rounded-full mt-1"
                  style={{ background: i === timeline.length - 1 ? 'var(--green)' : 'var(--border)', border: '2px solid var(--green)' }} />
                <p className="font-mono text-xs mb-1" style={{ color: 'var(--green)' }}>{item.phase}</p>
                <p className="font-mono font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{item.label}</p>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Links */}
      <section>
        <h2 className="font-mono font-semibold text-lg mb-5" style={{ color: 'var(--text)' }}>
          <span style={{ color: 'var(--green)' }}>&gt; </span>Links
        </h2>
        <div className="flex flex-wrap gap-4">
          {[
            { href: github, icon: Github, label: 'GitHub' },
            { href: linkedin, icon: Linkedin, label: 'LinkedIn' },
            { href: `mailto:${email}`, icon: Mail, label: 'Email' },
          ].map(({ href, icon: Icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded font-mono text-sm glow-card"
              style={{ color: 'var(--muted)' }}>
              <Icon size={15} /> {label}
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
