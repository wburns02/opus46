import { motion } from 'framer-motion'
import { FolderKanban, Plus, Search, Filter } from 'lucide-react'
import { projects } from '../data/mockData'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { ProjectStatus } from '../types'

const statusColors: Record<ProjectStatus, string> = {
  planning: 'bg-gray-100 text-gray-600',
  active: 'bg-teal-50 text-kdj-teal',
  in_review: 'bg-blue-50 text-kdj-blue',
  completed: 'bg-green-50 text-kdj-green',
  archived: 'bg-gray-50 text-gray-400',
}

export default function Projects() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all')

  const filtered = projects.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.clientName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-kdj-text flex items-center gap-2">
            <FolderKanban size={24} className="text-kdj-blue" /> Projects
          </h1>
          <p className="text-sm text-kdj-muted mt-1">Manage HEDIS, PQRS, and GPRO review projects</p>
        </div>
        <button className="flex items-center gap-2 bg-kdj-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-kdj-blue-light transition-colors">
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-kdj-muted" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search projects or clients..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-kdj-border rounded-lg focus:outline-none focus:ring-2 focus:ring-kdj-blue/20 focus:border-kdj-blue"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-kdj-border rounded-lg p-1">
          <Filter size={14} className="text-kdj-muted ml-2" />
          {(['all', 'active', 'planning', 'completed'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${filter === s ? 'bg-kdj-blue text-white' : 'text-kdj-muted hover:text-kdj-text'}`}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((p, i) => {
          const pct = p.totalRecords > 0 ? Math.round((p.completedRecords / p.totalRecords) * 100) : 0
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Link to={`/projects/${p.id}`} className="glass-card p-5 block hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-kdj-text">{p.name}</div>
                    <div className="text-xs text-kdj-muted mt-0.5">{p.clientName}</div>
                  </div>
                  <span className={`badge ${statusColors[p.status]}`}>{p.status.replace('_', ' ')}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <div className="text-lg font-bold text-kdj-text">{p.totalRecords.toLocaleString()}</div>
                    <div className="text-[10px] text-kdj-muted">Total Records</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-kdj-teal">{p.completedRecords.toLocaleString()}</div>
                    <div className="text-[10px] text-kdj-muted">Completed</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-kdj-text">{p.accuracy > 0 ? `${p.accuracy}%` : '—'}</div>
                    <div className="text-[10px] text-kdj-muted">Accuracy</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-kdj-muted mb-1">
                    <span>Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-kdj-teal rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-kdj-border/50">
                  <div className="text-[10px] text-kdj-muted">
                    {p.measures.slice(0, 3).join(', ')}{p.measures.length > 3 ? ` +${p.measures.length - 3}` : ''}
                  </div>
                  <div className="text-[10px] text-kdj-muted">
                    Due {new Date(p.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
