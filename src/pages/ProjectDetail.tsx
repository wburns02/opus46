import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Users, FileText, Target, Calendar, AlertTriangle } from 'lucide-react'
import { projects, medicalRecords, contractors } from '../data/mockData'
import type { RecordStatus } from '../types'

const recordStatusColors: Record<RecordStatus, string> = {
  pending: 'bg-gray-100 text-gray-600',
  assigned: 'bg-blue-50 text-kdj-blue',
  in_review: 'bg-amber-50 text-kdj-amber',
  overread: 'bg-purple-50 text-kdj-purple',
  completed: 'bg-green-50 text-kdj-green',
  flagged: 'bg-red-50 text-kdj-red',
}

export default function ProjectDetail() {
  const { id } = useParams()
  const project = projects.find(p => p.id === id)
  if (!project) return <div className="text-center py-20 text-kdj-muted">Project not found</div>

  const records = medicalRecords.filter(r => r.projectId === id).slice(0, 20)
  const assigned = contractors.filter(c => project.assignedContractors.includes(c.id))
  const pct = Math.round((project.completedRecords / project.totalRecords) * 100)

  const statusCounts = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Link to="/projects" className="flex items-center gap-2 text-sm text-kdj-muted hover:text-kdj-text transition-colors">
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-kdj-text">{project.name}</h1>
          <p className="text-sm text-kdj-muted mt-1">{project.clientName} &middot; {project.season}</p>
        </div>
        <span className={`badge ${project.status === 'active' ? 'bg-teal-50 text-kdj-teal' : 'bg-gray-100 text-gray-600'}`}>
          {project.status}
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { icon: FileText, label: 'Total Records', value: project.totalRecords.toLocaleString(), color: 'text-kdj-blue' },
          { icon: Target, label: 'Completed', value: project.completedRecords.toLocaleString(), color: 'text-kdj-green' },
          { icon: AlertTriangle, label: 'Flagged', value: project.flaggedRecords, color: 'text-kdj-red' },
          { icon: Target, label: 'Accuracy', value: `${project.accuracy}%`, color: 'text-kdj-teal' },
          { icon: Calendar, label: 'Deadline', value: new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: 'text-kdj-amber' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4">
            <s.icon size={16} className={`${s.color} mb-2`} />
            <div className="text-xl font-bold text-kdj-text">{s.value}</div>
            <div className="text-[10px] text-kdj-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="glass-card p-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-kdj-text">Overall Progress</span>
          <span className="text-kdj-muted">{pct}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
            className="h-full bg-kdj-teal rounded-full" />
        </div>
        <div className="flex gap-4 mt-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span className={`badge text-[10px] ${recordStatusColors[status as RecordStatus] || 'bg-gray-100 text-gray-600'}`}>
                {status.replace('_', ' ')}
              </span>
              <span className="text-xs text-kdj-muted">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Records Table */}
        <div className="glass-card p-5 col-span-2">
          <h2 className="text-sm font-semibold text-kdj-text mb-4 flex items-center gap-2">
            <FileText size={14} /> Records ({records.length} shown)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-kdj-muted border-b border-kdj-border">
                  <th className="text-left py-2 pr-3 font-medium">Member</th>
                  <th className="text-left py-2 pr-3 font-medium">Measure</th>
                  <th className="text-left py-2 pr-3 font-medium">Reviewer</th>
                  <th className="text-left py-2 pr-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id} className="border-b border-kdj-border/50 hover:bg-kdj-surface/50">
                    <td className="py-2 pr-3">
                      <div className="font-medium text-kdj-text">{r.memberName}</div>
                      <div className="text-kdj-muted">{r.memberId}</div>
                    </td>
                    <td className="py-2 pr-3 text-kdj-text">{r.measureCode}</td>
                    <td className="py-2 pr-3 text-kdj-muted">{r.assignedToName || '—'}</td>
                    <td className="py-2 pr-3">
                      <span className={`badge text-[10px] ${recordStatusColors[r.status]}`}>
                        {r.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assigned Contractors */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-kdj-text mb-4 flex items-center gap-2">
            <Users size={14} /> Assigned Contractors ({assigned.length})
          </h2>
          <div className="space-y-3">
            {assigned.length === 0 ? (
              <div className="text-xs text-kdj-muted text-center py-6">No contractors assigned yet</div>
            ) : assigned.map(c => (
              <Link key={c.id} to={`/contractors/${c.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-kdj-surface transition-colors">
                <div className="w-8 h-8 rounded-full bg-kdj-teal/10 text-kdj-teal flex items-center justify-center text-xs font-bold">
                  {c.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-kdj-text truncate">{c.name}</div>
                  <div className="text-[10px] text-kdj-muted">{c.accuracyRate}% accuracy &middot; {c.avgRecordsPerDay}/day</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Measures */}
          <h2 className="text-sm font-semibold text-kdj-text mt-6 mb-3">Measures</h2>
          <div className="flex flex-wrap gap-1.5">
            {project.measures.map(m => (
              <span key={m} className="badge bg-kdj-blue/10 text-kdj-blue">{m}</span>
            ))}
          </div>

          {/* Notes */}
          {project.notes && (
            <>
              <h2 className="text-sm font-semibold text-kdj-text mt-6 mb-2">Notes</h2>
              <p className="text-xs text-kdj-muted leading-relaxed">{project.notes}</p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
