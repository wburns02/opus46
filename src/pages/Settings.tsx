import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Shield, Bell, Database, Lock } from 'lucide-react'
import { useState } from 'react'

export default function Settings() {
  const [ipWhitelist] = useState([
    { ip: '73.162.44.102', label: 'Patricia Williams — Home Office', added: '2026-01-05' },
    { ip: '107.55.128.91', label: 'Maria Gonzalez — Home Office', added: '2026-01-15' },
    { ip: '67.10.234.18', label: 'Sharon Davis — Home Office', added: '2018-08-01' },
    { ip: '98.174.22.56', label: 'KDJ Office — Admin', added: '2017-01-01' },
    { ip: '12.55.200.44', label: 'BCBSTX — Client Portal', added: '2025-06-15' },
    { ip: '45.78.120.33', label: 'Karen White — Home Office', added: '2020-09-15' },
  ])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-kdj-text flex items-center gap-2">
          <SettingsIcon size={24} className="text-kdj-muted" /> Settings
        </h1>
        <p className="text-sm text-kdj-muted mt-1">Platform configuration, security, and access controls</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* IP Whitelist */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-kdj-text mb-1 flex items-center gap-2">
            <Shield size={14} className="text-kdj-teal" /> IP Whitelist
          </h2>
          <p className="text-[10px] text-kdj-muted mb-4">Only whitelisted IPs can access PHI and medical records</p>
          <div className="space-y-2">
            {ipWhitelist.map((entry, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 bg-kdj-surface rounded-lg">
                <Lock size={12} className="text-kdj-green shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-kdj-text">{entry.ip}</div>
                  <div className="text-[10px] text-kdj-muted">{entry.label}</div>
                </div>
                <div className="text-[10px] text-kdj-muted">{new Date(entry.added).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full text-xs text-kdj-blue hover:underline text-center py-2">
            + Add IP Address
          </button>
        </div>

        {/* SOC 2 Configuration */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-kdj-text mb-1 flex items-center gap-2">
            <Shield size={14} className="text-kdj-green" /> SOC 2 Configuration
          </h2>
          <p className="text-[10px] text-kdj-muted mb-4">Security controls for SOC 2 Type II compliance</p>
          <div className="space-y-3">
            {[
              { label: 'PHI Access Logging', desc: 'Log all access to protected health information', enabled: true },
              { label: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity', enabled: true },
              { label: 'MFA Required', desc: 'Multi-factor authentication for all users', enabled: true },
              { label: 'Data Export Approval', desc: 'Admin approval required for PHI exports', enabled: false },
              { label: 'Auto-Purge PHI', desc: 'Purge medical records 30 days post-project', enabled: true },
              { label: 'Encrypted at Rest', desc: 'AES-256 encryption for stored PHI', enabled: true },
            ].map((setting, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-kdj-surface rounded-lg">
                <div>
                  <div className="text-xs font-medium text-kdj-text">{setting.label}</div>
                  <div className="text-[10px] text-kdj-muted">{setting.desc}</div>
                </div>
                <div className={`w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${setting.enabled ? 'bg-kdj-green' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${setting.enabled ? 'translate-x-5' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-kdj-text mb-1 flex items-center gap-2">
            <Bell size={14} className="text-kdj-amber" /> Notifications
          </h2>
          <p className="text-[10px] text-kdj-muted mb-4">Alert preferences for project managers</p>
          <div className="space-y-3">
            {[
              { label: 'Credential Expiration (30 days)', enabled: true },
              { label: 'Project Deadline (7 days)', enabled: true },
              { label: 'Failed Login Attempts', enabled: true },
              { label: 'Overdue Invoices', enabled: true },
              { label: 'Quality Score Below 95%', enabled: false },
              { label: 'Daily Activity Summary', enabled: true },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <span className="text-xs text-kdj-text">{n.label}</span>
                <div className={`w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${n.enabled ? 'bg-kdj-blue' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${n.enabled ? 'translate-x-5' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-kdj-text mb-1 flex items-center gap-2">
            <Database size={14} className="text-kdj-purple" /> System Information
          </h2>
          <p className="text-[10px] text-kdj-muted mb-4">HARTS platform details</p>
          <div className="space-y-2">
            {[
              { label: 'Platform', value: 'HARTS v3.2' },
              { label: 'SOC 2 Certification', value: 'Type II — Valid through Dec 2026' },
              { label: 'HIPAA Status', value: 'Compliant' },
              { label: 'Database', value: 'Encrypted (AES-256)' },
              { label: 'Last Security Audit', value: 'January 15, 2026' },
              { label: 'Uptime (30 days)', value: '99.97%' },
              { label: 'Organization', value: 'KDJ Consultants, Inc.' },
              { label: 'Location', value: 'Colleyville, Texas 76034' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-kdj-border/50 last:border-0">
                <span className="text-xs text-kdj-muted">{item.label}</span>
                <span className="text-xs font-medium text-kdj-text">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
