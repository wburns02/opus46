import { motion } from 'framer-motion'
import { Receipt, DollarSign, Clock, AlertCircle, CheckCircle2, FileText } from 'lucide-react'
import { invoices, clients } from '../data/mockData'
import type { InvoiceStatus } from '../types'

const statusColors: Record<InvoiceStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-50 text-kdj-blue',
  paid: 'bg-green-50 text-kdj-green',
  overdue: 'bg-red-50 text-kdj-red',
}

export default function Billing() {
  const totalOutstanding = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.amount, 0)
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-kdj-text flex items-center gap-2">
            <Receipt size={24} className="text-kdj-green" /> Billing & Invoicing
          </h1>
          <p className="text-sm text-kdj-muted mt-1">Project costs, contractor hours, and client invoices</p>
        </div>
        <button className="flex items-center gap-2 bg-kdj-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-kdj-blue-light transition-colors">
          <FileText size={16} /> Create Invoice
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: 'Total Billed', value: `$${((totalPaid + totalOutstanding) / 1000).toFixed(1)}K`, color: 'bg-kdj-blue/10 text-kdj-blue' },
          { icon: CheckCircle2, label: 'Paid', value: `$${(totalPaid / 1000).toFixed(1)}K`, color: 'bg-green-50 text-kdj-green' },
          { icon: Clock, label: 'Outstanding', value: `$${(totalOutstanding / 1000).toFixed(1)}K`, color: 'bg-blue-50 text-kdj-blue' },
          { icon: AlertCircle, label: 'Overdue', value: `$${(totalOverdue / 1000).toFixed(1)}K`, color: totalOverdue > 0 ? 'bg-red-50 text-kdj-red' : 'bg-gray-50 text-gray-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-5">
            <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon size={18} />
            </div>
            <div className="text-2xl font-bold text-kdj-text">{s.value}</div>
            <div className="text-xs text-kdj-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Invoice List */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-kdj-surface border-b border-kdj-border">
              {['Invoice', 'Client', 'Project', 'Records', 'Hours', 'Amount', 'Issued', 'Due', 'Status'].map(h => (
                <th key={h} className="text-left py-3 px-4 font-medium text-kdj-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} className="border-b border-kdj-border/50 hover:bg-kdj-surface/50 transition-colors">
                <td className="py-3 px-4 font-mono font-medium text-kdj-text">{inv.id.toUpperCase()}</td>
                <td className="py-3 px-4 text-kdj-text">{inv.clientName.split(' ').slice(0, 3).join(' ')}</td>
                <td className="py-3 px-4 text-kdj-muted">{inv.projectName.split(' - ')[0]}</td>
                <td className="py-3 px-4 text-kdj-text">{inv.recordsCompleted.toLocaleString()}</td>
                <td className="py-3 px-4 text-kdj-muted">{inv.hours}</td>
                <td className="py-3 px-4 font-bold text-kdj-text">${inv.amount.toLocaleString()}</td>
                <td className="py-3 px-4 text-kdj-muted">{new Date(inv.issuedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                <td className="py-3 px-4 text-kdj-muted">{new Date(inv.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                <td className="py-3 px-4"><span className={`badge ${statusColors[inv.status]}`}>{inv.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Revenue by Client */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-kdj-text mb-4">Revenue by Client</h2>
        <div className="space-y-3">
          {clients.sort((a, b) => b.totalSpend - a.totalSpend).map(c => {
            const maxSpend = clients[0].totalSpend
            return (
              <div key={c.id} className="flex items-center gap-4">
                <div className="w-48 text-xs font-medium text-kdj-text truncate">{c.name}</div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-50 rounded overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(c.totalSpend / maxSpend) * 100}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-kdj-teal/20 rounded flex items-center px-2">
                      <span className="text-[10px] font-medium text-kdj-teal">${(c.totalSpend / 1000).toFixed(0)}K</span>
                    </motion.div>
                  </div>
                </div>
                <div className="text-xs text-kdj-muted w-24 text-right">{c.totalProjects} projects</div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
