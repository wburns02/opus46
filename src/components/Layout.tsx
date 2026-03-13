import { NavLink, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, FolderKanban, FileText, Users, Building2,
  ShieldCheck, Receipt, BarChart3, ScrollText, GraduationCap,
  Settings, Bell, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/records', icon: FileText, label: 'Record Queue' },
  { to: '/quality', icon: ShieldCheck, label: 'Quality' },
  { to: '/contractors', icon: Users, label: 'Contractors' },
  { to: '/clients', icon: Building2, label: 'Clients' },
  { to: '/compliance', icon: ShieldCheck, label: 'Compliance' },
  { to: '/billing', icon: Receipt, label: 'Billing' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/audit', icon: ScrollText, label: 'Audit Log' },
  { to: '/training', icon: GraduationCap, label: 'Training' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-kdj-surface">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col bg-kdj-navy text-white shrink-0 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-kdj-teal flex items-center justify-center font-bold text-sm shrink-0">
            KDJ
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
              <div className="text-sm font-semibold whitespace-nowrap">KDJ Consultants</div>
              <div className="text-[10px] text-white/50 whitespace-nowrap">HARTS Platform</div>
            </motion.div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-white/10 text-kdj-teal-light border-r-2 border-kdj-teal-light'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center py-3 border-t border-white/10 text-white/40 hover:text-white/70 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* User */}
        <div className="px-5 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-kdj-purple flex items-center justify-center text-xs font-bold shrink-0">KJ</div>
            {!collapsed && (
              <div className="overflow-hidden">
                <div className="text-xs font-medium whitespace-nowrap">Kim Johnson</div>
                <div className="text-[10px] text-white/40 whitespace-nowrap">Project Manager</div>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-kdj-border px-8 py-3 flex items-center justify-between">
          <div className="text-xs text-kdj-muted">
            HEDIS Season 2026 &middot; <span className="text-kdj-teal font-medium">4 Active Projects</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-kdj-muted hover:text-kdj-text transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-kdj-red rounded-full text-[9px] text-white flex items-center justify-center font-bold">3</span>
            </button>
            <div className="text-xs text-kdj-muted">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
