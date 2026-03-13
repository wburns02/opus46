import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, Award, Calendar, BarChart3 } from 'lucide-react'
import { contractors, projects, medicalRecords } from '../data/mockData'

export default function ContractorDetail() {
  const { id } = useParams()
  const contractor = contractors.find(c => c.id === id)
  if (!contractor) return <div className="text-center py-20 text-kdj-muted">Contractor not found</div>

  const assignedProjects = projects.filter(p => p.assignedContractors.includes(contractor.id))
  const recentRecords = medicalRecords.filter(r => r.assignedTo === contractor.id).slice(0, 10)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Link to="/contractors" className="flex items-center gap-2 text-sm text-kdj-muted hover:text-kdj-text transition-colors">
        <ArrowLeft size={16} /> Back to Contractors
      </Link>

      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-kdj-teal/10 text-kdj-teal flex items-center justify-center text-lg font-bold">
            {contractor.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-kdj-text">{contractor.name}</h1>
              <span className={`badge ${contractor.status === 'assigned' ? 'bg-blue-50 text-kdj-blue' : contractor.status === 'available' ? 'bg-green-50 text-kdj-green' : 'bg-amber-50 text-kdj-amber'}`}>
                {contractor.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-kdj-muted mt-2">
              <span className="flex items-center gap-1"><Mail size={12} /> {contractor.email}</span>
              <span className="flex items-center gap-1"><Phone size={12} /> {contractor.phone}</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> {contractor.state}</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> Hired {new Date(contractor.hireDate).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {contractor.specialties.map(s => (
                <span key={s} className="badge bg-kdj-blue/10 text-kdj-blue">{s}</span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-kdj-teal">{contractor.accuracyRate}%</div>
            <div className="text-xs text-kdj-muted">Accuracy Rate</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Records/Day', value: contractor.avgRecordsPerDay },
          { label: 'Total Reviewed', value: contractor.totalRecordsReviewed.toLocaleString() },
          { label: 'Active Projects', value: contractor.activeProjects },
          { label: 'Hourly Rate', value: `$${contractor.hourlyRate}` },
          { label: 'Last Active', value: new Date(contractor.lastActiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <div className="text-xl font-bold text-kdj-text">{s.value}</div>
            <div className="text-[10px] text-kdj-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Certifications */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-kdj-text mb-4 flex items-center gap-2">
            <Award size={14} /> Certifications
          </h2>
          <div className="space-y-3">
            {contractor.certifications.map((cert, i) => (
              <div key={i} className={`p-3 rounded-lg border ${
                cert.status === 'expiring_soon' ? 'bg-amber-50 border-amber-100' :
                cert.status === 'expired' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
              }`}>
                <div className="text-xs font-medium text-kdj-text">{cert.name}</div>
                <div className="text-[10px] text-kdj-muted mt-0.5">{cert.issuer}</div>
                <div className={`text-[10px] mt-1 font-medium ${
                  cert.status === 'expiring_soon' ? 'text-kdj-amber' :
                  cert.status === 'expired' ? 'text-kdj-red' : 'text-kdj-green'
                }`}>
                  {cert.status === 'expired' ? 'Expired' : `Expires ${new Date(cert.expiresAt).toLocaleDateString()}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Projects */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-kdj-text mb-4 flex items-center gap-2">
            <BarChart3 size={14} /> Assigned Projects
          </h2>
          {assignedProjects.length === 0 ? (
            <div className="text-xs text-kdj-muted text-center py-6">No active projects</div>
          ) : (
            <div className="space-y-3">
              {assignedProjects.map(p => (
                <Link key={p.id} to={`/projects/${p.id}`} className="block p-3 rounded-lg hover:bg-kdj-surface transition-colors">
                  <div className="text-xs font-medium text-kdj-text">{p.name}</div>
                  <div className="text-[10px] text-kdj-muted mt-0.5">{p.type.toUpperCase()} &middot; Due {new Date(p.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-kdj-teal rounded-full" style={{ width: `${Math.round((p.completedRecords / p.totalRecords) * 100)}%` }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Records */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-kdj-text mb-4">Recent Records</h2>
          <div className="space-y-2">
            {recentRecords.map(r => (
              <div key={r.id} className="flex items-center gap-2 py-1.5 border-b border-kdj-border/50 last:border-0">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  r.status === 'completed' ? 'bg-kdj-green' :
                  r.status === 'flagged' ? 'bg-kdj-red' : 'bg-kdj-amber'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-medium text-kdj-text truncate">{r.memberName}</div>
                  <div className="text-[9px] text-kdj-muted">{r.measureCode}</div>
                </div>
                <span className="text-[10px] text-kdj-muted capitalize">{r.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
