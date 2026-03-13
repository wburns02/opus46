import { motion } from 'framer-motion'
import { Building2, Search, Plus, Mail, Phone, Calendar, DollarSign } from 'lucide-react'
import { clients } from '../data/mockData'
import { useState } from 'react'
import type { ClientType } from '../types'

const typeColors: Record<ClientType, string> = {
  hospital: 'bg-blue-50 text-kdj-blue',
  physician_group: 'bg-purple-50 text-kdj-purple',
  health_plan: 'bg-teal-50 text-kdj-teal',
}
const typeLabels: Record<ClientType, string> = {
  hospital: 'Hospital',
  physician_group: 'Physician Group',
  health_plan: 'Health Plan',
}

export default function Clients() {
  const [search, setSearch] = useState('')

  const filtered = clients.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.contactName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-kdj-text flex items-center gap-2">
            <Building2 size={24} className="text-kdj-purple" /> Client Management
          </h1>
          <p className="text-sm text-kdj-muted mt-1">Hospitals, physician groups, and health plans</p>
        </div>
        <button className="flex items-center gap-2 bg-kdj-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-kdj-blue-light transition-colors">
          <Plus size={16} /> Add Client
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-kdj-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-kdj-border rounded-lg focus:outline-none focus:ring-2 focus:ring-kdj-blue/20" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="glass-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-kdj-text">{c.name}</div>
                <span className={`badge mt-1 ${typeColors[c.type]}`}>{typeLabels[c.type]}</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-kdj-text">{c.activeProjects}</div>
                <div className="text-[10px] text-kdj-muted">Active Projects</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 py-3 border-y border-kdj-border/50">
              <div>
                <div className="text-sm font-bold text-kdj-text">{c.totalProjects}</div>
                <div className="text-[10px] text-kdj-muted">Total Projects</div>
              </div>
              <div>
                <div className="text-sm font-bold text-kdj-green flex items-center gap-0.5">
                  <DollarSign size={12} />{(c.totalSpend / 1000).toFixed(0)}K
                </div>
                <div className="text-[10px] text-kdj-muted">Total Spend</div>
              </div>
              <div>
                <div className="text-sm font-bold text-kdj-text flex items-center gap-0.5">
                  <Calendar size={12} className="text-kdj-muted" />{new Date(c.since).getFullYear()}
                </div>
                <div className="text-[10px] text-kdj-muted">Client Since</div>
              </div>
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="text-xs font-medium text-kdj-text">{c.contactName}</div>
              <div className="flex items-center gap-3 text-[10px] text-kdj-muted">
                <span className="flex items-center gap-1"><Mail size={10} /> {c.contactEmail}</span>
                <span className="flex items-center gap-1"><Phone size={10} /> {c.contactPhone}</span>
              </div>
            </div>

            {c.notes && (
              <div className="mt-3 pt-3 border-t border-kdj-border/50">
                <p className="text-[10px] text-kdj-muted leading-relaxed">{c.notes}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
