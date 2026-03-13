import { motion } from 'framer-motion'
import { BarChart3, FileDown, Calendar, Users, ShieldCheck, ClipboardList } from 'lucide-react'
import { projects } from '../data/mockData'

const reportTypes = [
  {
    id: 'project-status', name: 'Project Status Report', icon: ClipboardList,
    description: 'Overall project progress, record completion rates, and timeline status.',
    category: 'project', color: 'bg-kdj-blue/10 text-kdj-blue',
  },
  {
    id: 'nurse-progress', name: 'Nurse Progress Report', icon: Users,
    description: 'Individual contractor productivity, accuracy metrics, and workload distribution.',
    category: 'nurse', color: 'bg-kdj-teal/10 text-kdj-teal',
  },
  {
    id: 'overread', name: 'Overread Report', icon: ShieldCheck,
    description: 'Quality assurance results — inter-rater reliability, agreement rates, flagged discrepancies.',
    category: 'overread', color: 'bg-kdj-purple/10 text-kdj-purple',
  },
  {
    id: 'scheduling', name: 'Scheduling Report', icon: Calendar,
    description: 'Contractor availability, assignment gaps, and deadline projections.',
    category: 'scheduling', color: 'bg-kdj-amber/10 text-kdj-amber',
  },
  {
    id: 'large-group', name: 'Large Group Report', icon: BarChart3,
    description: 'Multi-physician group practice performance across PQRS/GPRO measures.',
    category: 'compliance', color: 'bg-green-50 text-kdj-green',
  },
  {
    id: 'member-compliance', name: 'Member Compliance Report', icon: ShieldCheck,
    description: 'Per-member measure compliance status, gaps in care, and follow-up needs.',
    category: 'member', color: 'bg-red-50 text-kdj-red',
  },
]

export default function Reports() {
  const activeProjects = projects.filter(p => p.status === 'active')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-kdj-text flex items-center gap-2">
          <BarChart3 size={24} className="text-kdj-purple" /> Reports
        </h1>
        <p className="text-sm text-kdj-muted mt-1">Clarity standard reports — 6 report types</p>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-3 gap-4">
        {reportTypes.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-lg ${r.color} flex items-center justify-center mb-3`}>
              <r.icon size={20} />
            </div>
            <h3 className="text-sm font-semibold text-kdj-text">{r.name}</h3>
            <p className="text-xs text-kdj-muted mt-1 leading-relaxed">{r.description}</p>

            <div className="mt-4 pt-3 border-t border-kdj-border/50">
              <label className="text-[10px] text-kdj-muted block mb-1.5">Generate for project:</label>
              <select className="w-full px-2 py-1.5 text-xs border border-kdj-border rounded-md text-kdj-text focus:outline-none focus:ring-1 focus:ring-kdj-blue/30">
                <option value="">Select project...</option>
                {activeProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button className="w-full mt-2 flex items-center justify-center gap-1.5 bg-kdj-navy text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-kdj-slate transition-colors">
                <FileDown size={12} /> Generate Report
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-kdj-text mb-4">Recent Generated Reports</h2>
        <div className="space-y-2">
          {[
            { name: 'Project Status — HEDIS 2026 BCBSTX', date: '2026-03-13 09:38 AM', type: 'project-status', size: '2.4 MB' },
            { name: 'Nurse Progress — All Contractors', date: '2026-03-12 04:15 PM', type: 'nurse-progress', size: '1.8 MB' },
            { name: 'Overread — HEDIS 2026 BCBSTX (Feb)', date: '2026-03-01 10:00 AM', type: 'overread', size: '890 KB' },
            { name: 'Member Compliance — PQRS NTX Cardiology', date: '2026-02-28 02:30 PM', type: 'member-compliance', size: '1.2 MB' },
            { name: 'Project Status — GPRO 2026 Aetna', date: '2026-02-25 11:00 AM', type: 'project-status', size: '1.6 MB' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-kdj-surface transition-colors">
              <FileDown size={16} className="text-kdj-muted" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-kdj-text truncate">{r.name}</div>
                <div className="text-[10px] text-kdj-muted">{r.date}</div>
              </div>
              <span className="text-[10px] text-kdj-muted">{r.size}</span>
              <button className="text-xs text-kdj-blue hover:underline">Download</button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
