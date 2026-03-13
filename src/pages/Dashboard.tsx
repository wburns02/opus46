import { motion } from 'framer-motion'
import {
  FolderKanban, FileText, Users, Target, TrendingUp,
  Clock, AlertTriangle, CheckCircle2, ArrowRight
} from 'lucide-react'
import { dashboardStats, projects, contractors } from '../data/mockData'
import { Link } from 'react-router-dom'

const stats = [
  { label: 'Active Projects', value: dashboardStats.activeProjects, icon: FolderKanban, color: 'bg-kdj-blue/10 text-kdj-blue' },
  { label: 'Pending Records', value: dashboardStats.pendingRecords.toLocaleString(), icon: FileText, color: 'bg-amber-50 text-kdj-amber' },
  { label: 'Active Contractors', value: dashboardStats.activeContractors, icon: Users, color: 'bg-teal-50 text-kdj-teal' },
  { label: 'Avg Accuracy', value: `${dashboardStats.avgAccuracy}%`, icon: Target, color: 'bg-green-50 text-kdj-green' },
  { label: 'Records This Week', value: dashboardStats.recordsThisWeek, icon: TrendingUp, color: 'bg-purple-50 text-kdj-purple' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

export default function Dashboard() {
  const expiringCerts = contractors.flatMap(c =>
    c.certifications.filter(cert => cert.status === 'expiring_soon').map(cert => ({ ...cert, contractorName: c.name }))
  )

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-kdj-text">Dashboard</h1>
        <p className="text-sm text-kdj-muted mt-1">KDJ Consultants — HARTS Overview</p>
      </div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-5 gap-4">
        {stats.map(s => (
          <div key={s.label} className="glass-card p-5">
            <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon size={18} />
            </div>
            <div className="text-2xl font-bold text-kdj-text">{s.value}</div>
            <div className="text-xs text-kdj-muted mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {/* Active Projects */}
        <motion.div variants={item} className="glass-card p-5 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-kdj-text">Active Projects</h2>
            <Link to="/projects" className="text-xs text-kdj-blue hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {projects.filter(p => p.status === 'active').map(p => {
              const pct = Math.round((p.completedRecords / p.totalRecords) * 100)
              return (
                <Link key={p.id} to={`/projects/${p.id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-kdj-surface transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-kdj-text truncate">{p.name}</div>
                    <div className="text-xs text-kdj-muted">{p.clientName} &middot; {p.type.toUpperCase()}</div>
                  </div>
                  <div className="w-32">
                    <div className="flex justify-between text-[10px] text-kdj-muted mb-1">
                      <span>{p.completedRecords.toLocaleString()} / {p.totalRecords.toLocaleString()}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-kdj-teal rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="text-xs text-kdj-muted whitespace-nowrap">
                    Due {new Date(p.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </Link>
              )
            })}
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div variants={item} className="glass-card p-5">
          <h2 className="text-sm font-semibold text-kdj-text mb-4 flex items-center gap-2">
            <Clock size={14} className="text-kdj-amber" /> Upcoming Deadlines
          </h2>
          <div className="space-y-3">
            {dashboardStats.upcomingDeadlines.map(d => (
              <div key={d.project} className="flex items-center gap-3 p-2">
                <div className={`w-2 h-2 rounded-full shrink-0 ${d.daysLeft < 60 ? 'bg-kdj-amber' : 'bg-kdj-green'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-kdj-text truncate">{d.project}</div>
                  <div className="text-[10px] text-kdj-muted">{new Date(d.deadline).toLocaleDateString()}</div>
                </div>
                <div className={`text-xs font-bold ${d.daysLeft < 60 ? 'text-kdj-amber' : 'text-kdj-muted'}`}>
                  {d.daysLeft}d
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div variants={item} className="glass-card p-5 col-span-2">
          <h2 className="text-sm font-semibold text-kdj-text mb-4">Recent Activity</h2>
          <div className="space-y-2">
            {dashboardStats.recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-kdj-border/50 last:border-0">
                <CheckCircle2 size={14} className="text-kdj-teal mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-kdj-text">{a.action}</div>
                  <div className="text-[10px] text-kdj-muted">{a.detail}</div>
                </div>
                <div className="text-[10px] text-kdj-muted whitespace-nowrap">{a.time}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Credential Alerts */}
        <motion.div variants={item} className="glass-card p-5">
          <h2 className="text-sm font-semibold text-kdj-text mb-4 flex items-center gap-2">
            <AlertTriangle size={14} className="text-kdj-amber" /> Credential Alerts
          </h2>
          {expiringCerts.length === 0 ? (
            <div className="text-xs text-kdj-muted text-center py-6">All credentials current</div>
          ) : (
            <div className="space-y-3">
              {expiringCerts.map((cert, i) => (
                <div key={i} className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="text-xs font-medium text-amber-800">{cert.contractorName}</div>
                  <div className="text-[10px] text-amber-600 mt-0.5">{cert.name}</div>
                  <div className="text-[10px] text-amber-500 mt-0.5">
                    Expires {new Date(cert.expiresAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
