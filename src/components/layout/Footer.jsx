import { Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t mt-20 py-8 px-6" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-mono text-sm" style={{ color: 'var(--muted)' }}>
          &gt; R Akash // ECM @ VIT Chennai
        </span>
        <div className="flex gap-5">
          <a href="https://github.com/AkThetechie" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)' }} className="hover:text-white transition-colors"><Github size={18} /></a>
          <a href="https://linkedin.com/in/akash-r-6a4bb4321" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)' }} className="hover:text-white transition-colors"><Linkedin size={18} /></a>
          <a href="mailto:akash.r2024@vitstudent.ac.in" style={{ color: 'var(--muted)' }} className="hover:text-white transition-colors"><Mail size={18} /></a>
        </div>
      </div>
    </footer>
  )
}
