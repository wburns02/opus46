import { motion } from 'framer-motion'
import { ShieldCheck, Target, TrendingUp, AlertCircle, CheckCircle2, BarChart3 } from 'lucide-react'
import { contractors, medicalRecords, projects } from '../data/mockData'

export default function Quality() {
  const overreadRecords = medicalRecords.filter(r => r.overreadVerdict)
  const agreeCount = overreadRecords.filter(r => r.overreadVerdict === 'agree').length
  const disagreeCount = overreadRecords.filter(r => r.overreadVerdict === 'disagree').length
  const partialCount = overreadRecords.filter(r => r.overreadVerdict === 'partial').length
  const irrRate = overreadRecords.length > 0 ? Math.round((agreeCount / overreadRecords.length) * 100) : 0

  const activeContractors = contractors.filter(c => c.status === 'assigned')
  const avgAccuracy = activeContractors.length > 0
    ? (activeContractors.reduce((sum, c) => sum + c.accuracyRate, 0) / activeContractors.length).toFixed(1)
    : '0'

  const flaggedRecords = medicalRecords.filter(r => r.status === 'flagged')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-kdj-text flex items-center gap-2">
          <ShieldCheck size={24} className="text-kdj-teal" /> Quality Dashboard
        </h1>
        <p className="text-sm text-kdj-muted mt-1">Overread results, accuracy metrics, and inter-rater reliability</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Target, label: 'Inter-Rater Reliability', value: `${irrRate}%`, sub: `${overreadRecords.length} overread`, color: irrRate >= 95 ? 'text-kdj-green' : 'text-kdj-amber' },
          { icon: TrendingUp, label: 'Avg Accuracy Rate', value: `${avgAccuracy}%`, sub: `${activeContractors.length} active reviewers`, color: 'text-kdj-teal' },
          { icon: CheckCircle2, label: 'Overread Agreement', value: `${agreeCount}/${overreadRecords.length}`, sub: `${partialCount} partial, ${disagreeCount} disagree`, color: 'text-kdj-blue' },
          { icon: AlertCircle, label: 'Flagged Records', value: flaggedRecords.length, sub: 'Requiring attention', color: flaggedRecords.length > 10 ? 'text-kdj-red' : 'text-kdj-amber' },
        ].map(s => (
          <div key={s.label} className="glass-card p-5">
            <s.icon size={18} className={`${s.color} mb-2`} />
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-kdj-muted mt-0.5">{s.label}</div>
            <div className="text-[10px] text-kdj-muted/70 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Contractor Accuracy Rankings */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-kdj-text mb-4 flex items-center gap-2">
            <BarChart3 size={14} /> Reviewer Accuracy Rankings
          </h2>
          <div className="space-y-3">
            {[...activeContractors].sort((a, b) => b.accuracyRate - a.accuracyRate).map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-500'
                }`}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-kdj-text truncate">{c.name}</div>
                  <div className="text-[10px] text-kdj-muted">{c.totalRecordsReviewed.toLocaleString()} records reviewed</div>
                </div>
                <div className="w-24">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-kdj-teal rounded-full" style={{ width: `${c.accuracyRate}%` }} />
                  </div>
                </div>
                <div className="text-sm font-bold text-kdj-text w-14 text-right">{c.accuracyRate}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Quality */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-kdj-text mb-4 flex items-center gap-2">
            <ShieldCheck size={14} /> Quality by Project
          </h2>
          <div className="space-y-4">
            {projects.filter(p => p.status === 'active' && p.accuracy > 0).map(p => (
              <div key={p.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-kdj-text">{p.name}</span>
                  <span className={`font-bold ${p.accuracy >= 97 ? 'text-kdj-green' : p.accuracy >= 95 ? 'text-kdj-amber' : 'text-kdj-red'}`}>
                    {p.accuracy}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.accuracy >= 97 ? 'bg-kdj-green' : p.accuracy >= 95 ? 'bg-kdj-amber' : 'bg-kdj-red'}`}
                    style={{ width: `${p.accuracy}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-kdj-muted mt-1">
                  <span>{p.flaggedRecords} flagged</span>
                  <span>{p.completedRecords.toLocaleString()} reviewed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flagged Records */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-kdj-text mb-4 flex items-center gap-2">
          <AlertCircle size={14} className="text-kdj-red" /> Flagged Records Requiring Attention
        </h2>
        {flaggedRecords.length === 0 ? (
          <div className="text-xs text-kdj-muted text-center py-6">No flagged records</div>
        ) : (
          <div className="space-y-2">
            {flaggedRecords.map(r => (
              <div key={r.id} className="flex items-center gap-4 p-3 rounded-lg bg-red-50/50 border border-red-100">
                <div className="flex-1">
                  <div className="text-xs font-medium text-kdj-text">{r.memberName} ({r.memberId})</div>
                  <div className="text-[10px] text-kdj-muted">{r.measureCode} &middot; {r.facility}</div>
                </div>
                <div className="text-[10px] text-kdj-red">
                  {r.annotations.join(', ')}
                </div>
                <div className="text-[10px] text-kdj-muted">{r.assignedToName?.split(',')[0]}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
