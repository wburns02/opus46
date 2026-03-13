import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useCallback } from 'react'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import RecordQueue from './pages/RecordQueue'
import Quality from './pages/Quality'
import Contractors from './pages/Contractors'
import ContractorDetail from './pages/ContractorDetail'
import Clients from './pages/Clients'
import Compliance from './pages/Compliance'
import Billing from './pages/Billing'
import Reports from './pages/Reports'
import AuditLog from './pages/AuditLog'
import Training from './pages/Training'
import Settings from './pages/Settings'
import Ingestion from './pages/Ingestion'
import { useAuthStore } from './stores/authStore'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkSession, refreshSession } = useAuthStore()

  // Check session expiry every 30s
  useEffect(() => {
    const interval = setInterval(() => { checkSession() }, 30_000)
    return () => clearInterval(interval)
  }, [checkSession])

  // Refresh session on user activity
  const handleActivity = useCallback(() => { refreshSession() }, [refreshSession])
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(e => window.addEventListener(e, handleActivity))
    return () => events.forEach(e => window.removeEventListener(e, handleActivity))
  }, [handleActivity])

  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AuthGuard><Layout /></AuthGuard>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/ingestion" element={<Ingestion />} />
          <Route path="/records" element={<RecordQueue />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/contractors" element={<Contractors />} />
          <Route path="/contractors/:id" element={<ContractorDetail />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/audit" element={<AuditLog />} />
          <Route path="/training" element={<Training />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
