import { Mail, Github, Linkedin } from 'lucide-react'

export default function Contact() {
  return (
    <main className="pt-24 pb-20 px-6 max-w-2xl mx-auto min-h-screen">
      <h1 className="font-mono font-bold text-4xl mb-2" style={{ color: 'var(--text)' }}>
        <span style={{ color: 'var(--green)' }}>&gt; </span>Contact
      </h1>
      <p className="font-mono text-sm mb-12" style={{ color: 'var(--muted)' }}>
        I'm currently open to internship opportunities.
      </p>

      <div className="space-y-4">
        {[
          { href: 'mailto:akash.r2024@vitstudent.ac.in', icon: Mail, label: 'Email', value: 'akash.r2024@vitstudent.ac.in', color: 'var(--green)' },
          { href: 'https://github.com/AkThetechie', icon: Github, label: 'GitHub', value: 'github.com/AkThetechie', color: '#94a3b8' },
          { href: 'https://linkedin.com/in/akash-r-6a4bb4321', icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/akash-r-6a4bb4321', color: '#0EA5E9' },
        ].map(({ href, icon: Icon, label, value, color }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer"
            className="flex items-center gap-4 p-5 rounded-lg glow-card transition-all">
            <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18`, color }}>
              <Icon size={18} />
            </div>
            <div>
              <p className="font-mono text-xs mb-0.5" style={{ color: 'var(--muted)' }}>{label}</p>
              <p className="font-mono text-sm" style={{ color: 'var(--text)' }}>{value}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-14 p-6 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="font-mono text-xs mb-2" style={{ color: 'var(--green)' }}>&gt; note</p>
        <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
          Best way to reach me is email. I'm based in Tamil Nadu, India and 
          available for remote or on-site internship opportunities, including international programs.
        </p>
      </div>
    </main>
  )
}
