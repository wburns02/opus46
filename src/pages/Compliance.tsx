import { motion } from 'framer-motion'
import { ShieldCheck, Target, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { complianceItems } from '../data/mockData'

const statusIcons = {
  met: { icon: CheckCircle2, color: 'text-kdj-green', bg: 'bg-green-50 border-green-100' },
  on_track: { icon: Target, color: 'text-kdj-blue', bg: 'bg-blue-50 border-blue-100' },
  at_risk: { icon: AlertTriangle, color: 'text-kdj-amber', bg: 'bg-amber-50 border-amber-100' },
  below_target: { icon: XCircle, color: 'text-kdj-red', bg: 'bg-red-50 border-red-100' },
}

export default function Compliance() {
  const met = complianceItems.filter(c => c.status === 'met').length
  const atRisk = complianceItems.filter(c => c.status === 'at_risk').length
  const belowTarget = complianceItems.filter(c => c.status === 'below_target').length

  const byType = ['hedis', 'pqrs', 'gpro'].map(type => ({
    type: type.toUpperCase(),
    items: complianceItems.filter(c => c.measureType === type),
  })).filter(g => g.items.length > 0)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-kdj-text flex items-center gap-2">
          <ShieldCheck size={24} className="text-kdj-green" /> Compliance Center
        </h1>
        <p className="text-sm text-kdj-muted mt-1">HEDIS, PQRS, and GPRO measure tracking</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Measures', value: complianceItems.length, color: 'text-kdj-blue' },
          { label: 'Meeting Target', value: met, color: 'text-kdj-green' },
          { label: 'At Risk', value: atRisk, color: 'text-kdj-amber' },
          { label: 'Below Target', value: belowTarget, color: 'text-kdj-red' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-kdj-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* By Measure Type */}
      {byType.map(group => (
        <div key={group.type} className="glass-card p-5">
          <h2 className="text-sm font-semibold text-kdj-text mb-4">{group.type} Measures</h2>
          <div className="space-y-4">
            {group.items.map(item => {
              const { icon: Icon, color, bg } = statusIcons[item.status]
              return (
                <div key={item.id} className={`p-4 rounded-lg border ${bg}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="badge bg-white/80 text-kdj-text font-mono">{item.measureCode}</span>
                        <span className="text-sm font-medium text-kdj-text">{item.measureName}</span>
                      </div>
                      <div className="text-xs text-kdj-muted mt-1">{item.projectName}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon size={14} className={color} />
                      <span className={`text-xs font-medium ${color}`}>{item.status.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] text-kdj-muted mb-1">
                        <span>Rate: {item.rate}%</span>
                        <span>Target: {item.target}%</span>
                      </div>
                      <div className="h-2 bg-white/60 rounded-full overflow-hidden relative">
                        <div className={`h-full rounded-full ${item.rate >= item.target ? 'bg-kdj-green' : item.rate >= item.target - 5 ? 'bg-kdj-amber' : 'bg-kdj-red'}`}
                          style={{ width: `${Math.min(item.rate, 100)}%` }} />
                        <div className="absolute top-0 bottom-0 w-0.5 bg-kdj-text/40"
                          style={{ left: `${item.target}%` }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-kdj-text">{item.numerator}/{item.denominator}</div>
                      <div className="text-[10px] text-kdj-muted">Numerator/Denominator</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-kdj-muted mt-2">
                    Deadline: {new Date(item.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </motion.div>
  )
}
