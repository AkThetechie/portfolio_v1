export function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const DOMAINS = [
  'Embedded Systems', 'Robotics', 'IoT', 'Blockchain',
  'Signal Processing', 'Energy Harvesting', 'Simulation', 'Other'
]

export const DOMAIN_COLORS = {
  'Embedded Systems': '#F59E0B',
  'Robotics':         '#0EA5E9',
  'IoT':              '#00FF88',
  'Blockchain':       '#8B5CF6',
  'Signal Processing':'#EC4899',
  'Energy Harvesting':'#10B981',
  'Simulation':       '#6366F1',
  'Other':            '#64748B',
}
