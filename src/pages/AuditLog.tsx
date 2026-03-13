import { motion } from 'framer-motion'
import { ScrollText, Search, Shield, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { auditEntries } from '../data/mockData'
import { useState } from 'react'
import type { AuditAction } from '../types'

const actionColors: Record<AuditAction, string> = {
  view_phi: 'bg-amber-50 text-kdj-amber',
  export_data: 'bg-purple-50 text-kdj-purple',
  login: 'bg-green-50 text-kdj-green',
  logout: 'bg-gray-100 text-gray-500',
  record_update: 'bg-blue-50 text-kdj-blue',
  project_access: 'bg-teal-50 text-kdj-teal',
  report_generated: 'bg-purple-50 text-kdj-purple',
}

const actionLabels: Record<AuditAction, string> = {
  view_phi: 'PHI Access',
  export_data: 'Data Export',
  login: 'Login',
  logout: 'Logout',
  record_update: 'Record Update',
  project_access: 'Project Access',
  report_generated: 'Report Generated',
}

export default function AuditLog() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState<AuditAction | 'all'>('all')

  const filtered = auditEntries.filter(e => {
    if (actionFilter !== 'all' && e.action !== actionFilter) return false
    if (search && !e.userName.toLowerCase().includes(search.toLowerCase()) && !e.details.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const failedLogins = auditEntries.filter(e => e.action === 'login' && !e.success).length
  const phiAccesses = auditEntries.filter(e => e.action === 'view_phi').length
  const exports = auditEntries.filter(e => e.action === 'export_data').length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-kdj-text flex items-center gap-2">
          <ScrollText size={24} className="text-kdj-navy" /> Audit Log
        </h1>
        <p className="text-sm text-kdj-muted mt-1">PHI access tracking, security events, and SOC 2 evidence</p>
      </div>

      {/* Security Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Shield, label: 'Total Events', value: auditEntries.length, color: 'bg-kdj-blue/10 text-kdj-blue' },
          { icon: AlertTriangle, label: 'PHI Accesses', value: phiAccesses, color: 'bg-amber-50 text-kdj-amber' },
          { icon: XCircle, label: 'Failed Logins', value: failedLogins, color: failedLogins > 0 ? 'bg-red-50 text-kdj-red' : 'bg-gray-50 text-gray-400' },
          { icon: ScrollText, label: 'Data Exports', value: exports, color: 'bg-purple-50 text-kdj-purple' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <s.icon size={16} className={`mx-auto mb-2 ${s.color.split(' ')[1]}`} />
            <div className="text-xl font-bold text-kdj-text">{s.value}</div>
            <div className="text-[10px] text-kdj-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-kdj-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by user or details..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-kdj-border rounded-lg focus:outline-none focus:ring-2 focus:ring-kdj-blue/20" />
        </div>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value as AuditAction | 'all')}
          className="px-3 py-2 text-sm border border-kdj-border rounded-lg text-kdj-text focus:outline-none">
          <option value="all">All Actions</option>
          {Object.entries(actionLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Log Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-kdj-surface border-b border-kdj-border">
              {['Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP Address', 'Status'].map(h => (
                <th key={h} className="text-left py-3 px-4 font-medium text-kdj-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} className={`border-b border-kdj-border/50 hover:bg-kdj-surface/50 transition-colors ${!e.success ? 'bg-red-50/30' : ''}`}>
                <td className="py-2.5 px-4 text-kdj-muted font-mono whitespace-nowrap">
                  {new Date(e.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="py-2.5 px-4 font-medium text-kdj-text">{e.userName}</td>
                <td className="py-2.5 px-4">
                  <span className={`badge text-[10px] ${actionColors[e.action]}`}>
                    {actionLabels[e.action]}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-kdj-muted">{e.resource}</td>
                <td className="py-2.5 px-4 text-kdj-muted truncate max-w-[250px]">{e.details}</td>
                <td className="py-2.5 px-4 font-mono text-kdj-muted">{e.ipAddress}</td>
                <td className="py-2.5 px-4">
                  {e.success ? (
                    <CheckCircle2 size={14} className="text-kdj-green" />
                  ) : (
                    <XCircle size={14} className="text-kdj-red" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-kdj-surface border-t border-kdj-border text-xs text-kdj-muted flex items-center justify-between">
          <span>Showing {filtered.length} of {auditEntries.length} events</span>
          <button className="text-kdj-blue hover:underline">Export for SOC 2 Audit</button>
        </div>
      </div>
    </motion.div>
  )
}
