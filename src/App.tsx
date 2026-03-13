import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
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
      </Routes>
    </BrowserRouter>
  )
}
