export type ProjectType = 'hedis' | 'pqrs' | 'gpro' | 'custom'
export type ProjectStatus = 'planning' | 'active' | 'in_review' | 'completed' | 'archived'
export type RecordStatus = 'pending' | 'assigned' | 'in_review' | 'overread' | 'completed' | 'flagged'
export type ContractorStatus = 'available' | 'assigned' | 'on_leave' | 'inactive'
export type ClientType = 'hospital' | 'physician_group' | 'health_plan'
export type OverreadVerdict = 'agree' | 'disagree' | 'partial'
export type ComplianceMeasure = 'hedis' | 'pqrs' | 'gpro'
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'
export type AuditAction = 'view_phi' | 'export_data' | 'login' | 'logout' | 'record_update' | 'project_access' | 'report_generated'
export type TrainingStatus = 'not_started' | 'in_progress' | 'completed' | 'expired'
export type Severity = 'info' | 'warning' | 'critical'

export interface Project {
  id: string
  name: string
  type: ProjectType
  clientId: string
  clientName: string
  status: ProjectStatus
  season: string // e.g. "HEDIS 2026"
  totalRecords: number
  completedRecords: number
  flaggedRecords: number
  accuracy: number // 0-100
  startDate: string
  deadline: string
  assignedContractors: string[]
  measures: string[]
  notes: string
}

export interface MedicalRecord {
  id: string
  projectId: string
  memberId: string
  memberName: string
  measureCode: string
  measureName: string
  status: RecordStatus
  assignedTo: string | null
  assignedToName: string | null
  receivedDate: string
  reviewedDate: string | null
  overreadDate: string | null
  overreadBy: string | null
  overreadVerdict: OverreadVerdict | null
  annotations: string[]
  facility: string
  dosFrom: string
  dosTo: string
}

export interface Contractor {
  id: string
  name: string
  email: string
  phone: string
  state: string
  status: ContractorStatus
  specialties: string[]
  certifications: Certification[]
  hireDate: string
  activeProjects: number
  totalRecordsReviewed: number
  accuracyRate: number
  avgRecordsPerDay: number
  hourlyRate: number
  lastActiveDate: string
}

export interface Certification {
  name: string
  issuer: string
  expiresAt: string
  status: 'active' | 'expiring_soon' | 'expired'
}

export interface Client {
  id: string
  name: string
  type: ClientType
  contactName: string
  contactEmail: string
  contactPhone: string
  address: string
  activeProjects: number
  totalProjects: number
  totalSpend: number
  since: string
  notes: string
}

export interface ComplianceItem {
  id: string
  measureType: ComplianceMeasure
  measureCode: string
  measureName: string
  projectId: string
  projectName: string
  numerator: number
  denominator: number
  rate: number
  target: number
  status: 'on_track' | 'at_risk' | 'below_target' | 'met'
  deadline: string
}

export interface Invoice {
  id: string
  clientId: string
  clientName: string
  projectId: string
  projectName: string
  amount: number
  status: InvoiceStatus
  issuedDate: string
  dueDate: string
  paidDate: string | null
  hours: number
  recordsCompleted: number
  lineItems: { description: string; quantity: number; rate: number; total: number }[]
}

export interface AuditEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: AuditAction
  resource: string
  details: string
  ipAddress: string
  success: boolean
}

export interface TrainingModule {
  id: string
  name: string
  category: string
  requiredFor: ProjectType[]
  duration: string
  completedBy: { contractorId: string; contractorName: string; completedDate: string; score: number }[]
  totalAssigned: number
  completionRate: number
}

export interface ReportType {
  id: string
  name: string
  description: string
  category: 'project' | 'nurse' | 'overread' | 'scheduling' | 'compliance' | 'member'
}

export interface DashboardStats {
  activeProjects: number
  pendingRecords: number
  activeContractors: number
  avgAccuracy: number
  recordsThisWeek: number
  upcomingDeadlines: { project: string; deadline: string; daysLeft: number }[]
  recentActivity: { action: string; detail: string; time: string }[]
}
