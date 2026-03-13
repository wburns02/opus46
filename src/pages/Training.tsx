import { motion } from 'framer-motion'
import { GraduationCap, Users, CheckCircle2, Clock, AlertTriangle, BarChart3 } from 'lucide-react'
import { trainingModules, contractors } from '../data/mockData'

export default function Training() {
  const totalModules = trainingModules.length
  const avgCompletion = Math.round(trainingModules.reduce((s, m) => s + m.completionRate, 0) / totalModules)
  const belowThreshold = trainingModules.filter(m => m.completionRate < 70).length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-kdj-text flex items-center gap-2">
          <GraduationCap size={24} className="text-kdj-blue" /> Training Center
        </h1>
        <p className="text-sm text-kdj-muted mt-1">Contractor training, certifications, and compliance requirements</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: GraduationCap, label: 'Training Modules', value: totalModules, color: 'bg-kdj-blue/10 text-kdj-blue' },
          { icon: BarChart3, label: 'Avg Completion', value: `${avgCompletion}%`, color: 'bg-teal-50 text-kdj-teal' },
          { icon: AlertTriangle, label: 'Below 70%', value: belowThreshold, color: belowThreshold > 0 ? 'bg-amber-50 text-kdj-amber' : 'bg-green-50 text-kdj-green' },
          { icon: Users, label: 'Total Contractors', value: contractors.length, color: 'bg-purple-50 text-kdj-purple' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <s.icon size={16} className={`mx-auto mb-2 ${s.color.split(' ')[1]}`} />
            <div className="text-xl font-bold text-kdj-text">{s.value}</div>
            <div className="text-[10px] text-kdj-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {trainingModules.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="glass-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-kdj-text">{m.name}</h3>
                  <span className="badge bg-kdj-surface text-kdj-muted text-[10px]">{m.category}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-kdj-muted mt-1">
                  <span className="flex items-center gap-1"><Clock size={10} /> {m.duration}</span>
                  <span>Required for: {m.requiredFor.map(t => t.toUpperCase()).join(', ')}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${m.completionRate >= 80 ? 'text-kdj-green' : m.completionRate >= 60 ? 'text-kdj-amber' : 'text-kdj-red'}`}>
                  {m.completionRate.toFixed(0)}%
                </div>
                <div className="text-[10px] text-kdj-muted">{m.completedBy.length}/{m.totalAssigned} completed</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
              <motion.div initial={{ width: 0 }} animate={{ width: `${m.completionRate}%` }} transition={{ duration: 0.6, delay: i * 0.04 }}
                className={`h-full rounded-full ${m.completionRate >= 80 ? 'bg-kdj-green' : m.completionRate >= 60 ? 'bg-kdj-amber' : 'bg-kdj-red'}`} />
            </div>

            {/* Completed by */}
            <div className="grid grid-cols-4 gap-2">
              {m.completedBy.map(c => (
                <div key={c.contractorId} className="flex items-center gap-2 p-2 bg-green-50/50 rounded-md">
                  <CheckCircle2 size={12} className="text-kdj-green shrink-0" />
                  <div>
                    <div className="text-[10px] font-medium text-kdj-text">{c.contractorName}</div>
                    <div className="text-[9px] text-kdj-muted">Score: {c.score}% &middot; {new Date(c.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                </div>
              ))}
              {Array.from({ length: m.totalAssigned - m.completedBy.length }).map((_, j) => (
                <div key={`pending-${j}`} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                  <Clock size={12} className="text-gray-300 shrink-0" />
                  <div className="text-[10px] text-gray-400">Not completed</div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
