import { motion } from 'framer-motion'
import { FileText, Search, ArrowUpDown, UserPlus } from 'lucide-react'
import { medicalRecords, projects } from '../data/mockData'
import { useState } from 'react'
import type { RecordStatus } from '../types'

const statusColors: Record<RecordStatus, string> = {
  pending: 'bg-gray-100 text-gray-600',
  assigned: 'bg-blue-50 text-kdj-blue',
  in_review: 'bg-amber-50 text-kdj-amber',
  overread: 'bg-purple-50 text-kdj-purple',
  completed: 'bg-green-50 text-kdj-green',
  flagged: 'bg-red-50 text-kdj-red',
}

export default function RecordQueue() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<RecordStatus | 'all'>('all')
  const [projectFilter, setProjectFilter] = useState<string>('all')

  const filtered = medicalRecords.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (projectFilter !== 'all' && r.projectId !== projectFilter) return false
    if (search && !r.memberName.toLowerCase().includes(search.toLowerCase()) && !r.memberId.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const statusSummary = medicalRecords.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-kdj-text flex items-center gap-2">
            <FileText size={24} className="text-kdj-amber" /> Medical Record Queue
          </h1>
          <p className="text-sm text-kdj-muted mt-1">Intake, assignment, and review tracking</p>
        </div>
        <button className="flex items-center gap-2 bg-kdj-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-kdj-blue-light transition-colors">
          <UserPlus size={16} /> Assign Records
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-6 gap-3">
        {(['pending', 'assigned', 'in_review', 'overread', 'completed', 'flagged'] as RecordStatus[]).map(s => (
          <button key={s} onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
            className={`glass-card p-3 text-center transition-all ${statusFilter === s ? 'ring-2 ring-kdj-blue' : ''}`}>
            <div className="text-xl font-bold text-kdj-text">{statusSummary[s] || 0}</div>
            <div className="text-[10px] text-kdj-muted capitalize">{s.replace('_', ' ')}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-kdj-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by member name or ID..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-kdj-border rounded-lg focus:outline-none focus:ring-2 focus:ring-kdj-blue/20" />
        </div>
        <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-kdj-border rounded-lg text-kdj-text focus:outline-none focus:ring-2 focus:ring-kdj-blue/20">
          <option value="all">All Projects</option>
          {projects.filter(p => p.status === 'active').map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Records Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-kdj-surface border-b border-kdj-border">
              {['Member', 'Member ID', 'Project', 'Measure', 'Facility', 'Reviewer', 'DOS', 'Status'].map(h => (
                <th key={h} className="text-left py-3 px-4 font-medium text-kdj-muted">
                  <button className="flex items-center gap-1 hover:text-kdj-text">
                    {h} <ArrowUpDown size={10} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 30).map(r => (
              <tr key={r.id} className="border-b border-kdj-border/50 hover:bg-kdj-surface/50 transition-colors">
                <td className="py-2.5 px-4 font-medium text-kdj-text">{r.memberName}</td>
                <td className="py-2.5 px-4 text-kdj-muted font-mono">{r.memberId}</td>
                <td className="py-2.5 px-4 text-kdj-muted">{projects.find(p => p.id === r.projectId)?.name.split(' - ')[1] || r.projectId}</td>
                <td className="py-2.5 px-4"><span className="badge bg-kdj-blue/10 text-kdj-blue">{r.measureCode}</span></td>
                <td className="py-2.5 px-4 text-kdj-muted truncate max-w-[150px]">{r.facility}</td>
                <td className="py-2.5 px-4 text-kdj-muted">{r.assignedToName?.split(',')[0] || '—'}</td>
                <td className="py-2.5 px-4 text-kdj-muted">{r.dosFrom}</td>
                <td className="py-2.5 px-4"><span className={`badge text-[10px] ${statusColors[r.status]}`}>{r.status.replace('_', ' ')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-kdj-surface border-t border-kdj-border text-xs text-kdj-muted">
          Showing {Math.min(30, filtered.length)} of {filtered.length} records
        </div>
      </div>
    </motion.div>
  )
}
