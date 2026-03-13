import { motion } from 'framer-motion'
import { Users, Search, UserPlus, MapPin, Award, Clock } from 'lucide-react'
import { contractors } from '../data/mockData'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { ContractorStatus } from '../types'

const statusColors: Record<ContractorStatus, string> = {
  available: 'bg-green-50 text-kdj-green',
  assigned: 'bg-blue-50 text-kdj-blue',
  on_leave: 'bg-amber-50 text-kdj-amber',
  inactive: 'bg-gray-100 text-gray-500',
}

export default function Contractors() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<ContractorStatus | 'all'>('all')

  const filtered = contractors.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.specialties.join(' ').toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-kdj-text flex items-center gap-2">
            <Users size={24} className="text-kdj-teal" /> Contractor Management
          </h1>
          <p className="text-sm text-kdj-muted mt-1">RN reviewers, credentials, and availability</p>
        </div>
        <button className="flex items-center gap-2 bg-kdj-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-kdj-blue-light transition-colors">
          <UserPlus size={16} /> Add Contractor
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: contractors.length, color: 'bg-kdj-blue/10 text-kdj-blue' },
          { label: 'Assigned', value: contractors.filter(c => c.status === 'assigned').length, color: 'bg-blue-50 text-kdj-blue' },
          { label: 'Available', value: contractors.filter(c => c.status === 'available').length, color: 'bg-green-50 text-kdj-green' },
          { label: 'On Leave', value: contractors.filter(c => c.status === 'on_leave').length, color: 'bg-amber-50 text-kdj-amber' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-kdj-text">{s.value}</div>
            <div className="text-xs text-kdj-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-kdj-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or specialty..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-kdj-border rounded-lg focus:outline-none focus:ring-2 focus:ring-kdj-blue/20" />
        </div>
        <div className="flex items-center gap-1 bg-white border border-kdj-border rounded-lg p-1">
          {(['all', 'assigned', 'available', 'on_leave'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${filter === s ? 'bg-kdj-blue text-white' : 'text-kdj-muted hover:text-kdj-text'}`}>
              {s === 'all' ? 'All' : s === 'on_leave' ? 'On Leave' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Contractor Cards */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Link to={`/contractors/${c.id}`} className="glass-card p-5 block hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-kdj-teal/10 text-kdj-teal flex items-center justify-center text-sm font-bold shrink-0">
                  {c.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-kdj-text">{c.name}</div>
                    <span className={`badge ${statusColors[c.status]}`}>{c.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-kdj-muted mt-1">
                    <span className="flex items-center gap-1"><MapPin size={10} /> {c.state}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> Since {new Date(c.hireDate).getFullYear()}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mt-3">
                    <div>
                      <div className="text-sm font-bold text-kdj-text">{c.accuracyRate}%</div>
                      <div className="text-[10px] text-kdj-muted">Accuracy</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-kdj-text">{c.avgRecordsPerDay}</div>
                      <div className="text-[10px] text-kdj-muted">Records/Day</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-kdj-text">{c.totalRecordsReviewed.toLocaleString()}</div>
                      <div className="text-[10px] text-kdj-muted">Total Reviewed</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-kdj-text">{c.activeProjects}</div>
                      <div className="text-[10px] text-kdj-muted">Projects</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {c.specialties.map(s => (
                      <span key={s} className="badge bg-kdj-surface text-kdj-muted text-[10px]">{s}</span>
                    ))}
                  </div>

                  {/* Cert alerts */}
                  {c.certifications.some(cert => cert.status === 'expiring_soon') && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-kdj-amber">
                      <Award size={10} /> Certification expiring soon
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
