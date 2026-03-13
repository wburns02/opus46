import type {
  Project, MedicalRecord, Contractor, Client, ComplianceItem,
  Invoice, AuditEntry, TrainingModule, DashboardStats
} from '../types'

// ── Clients ──────────────────────────────────────────────────────
export const clients: Client[] = [
  {
    id: 'c1', name: 'Texas Health Presbyterian', type: 'hospital',
    contactName: 'Dr. Sarah Chen', contactEmail: 'schen@txhealth.org', contactPhone: '(214) 555-0142',
    address: '8200 Walnut Hill Ln, Dallas, TX 75231',
    activeProjects: 2, totalProjects: 8, totalSpend: 284500, since: '2019-03-15',
    notes: 'Long-standing HEDIS client. Prefers RNs with ICU background.'
  },
  {
    id: 'c2', name: 'Blue Cross Blue Shield of Texas', type: 'health_plan',
    contactName: 'Mark Rodriguez', contactEmail: 'mrodriguez@bcbstx.com', contactPhone: '(972) 555-0198',
    address: '1001 E Lookout Dr, Richardson, TX 75082',
    activeProjects: 3, totalProjects: 12, totalSpend: 521000, since: '2017-06-01',
    notes: 'Largest client. HEDIS season is critical — no deadline misses tolerated.'
  },
  {
    id: 'c3', name: 'North Texas Cardiology Associates', type: 'physician_group',
    contactName: 'Dr. James Whitfield', contactEmail: 'jwhitfield@ntxcardio.com', contactPhone: '(817) 555-0267',
    address: '900 8th Ave, Fort Worth, TX 76104',
    activeProjects: 1, totalProjects: 4, totalSpend: 87200, since: '2021-01-10',
    notes: 'PQRS focus. Needs abstraction for 12-physician group practice.'
  },
  {
    id: 'c4', name: 'Baylor Scott & White Health', type: 'hospital',
    contactName: 'Linda Park', contactEmail: 'lpark@bswhealth.com', contactPhone: '(254) 555-0334',
    address: '2401 S 31st St, Temple, TX 76508',
    activeProjects: 1, totalProjects: 6, totalSpend: 198700, since: '2020-05-20',
    notes: 'Multi-facility system. Abstraction across 4 hospitals.'
  },
  {
    id: 'c5', name: 'Aetna Texas Division', type: 'health_plan',
    contactName: 'Rachel Kim', contactEmail: 'rkim@aetna.com', contactPhone: '(860) 555-0411',
    address: '151 Farmington Ave, Hartford, CT 06156',
    activeProjects: 1, totalProjects: 3, totalSpend: 142300, since: '2022-09-01',
    notes: 'GPRO and HEDIS hybrid projects. Strict PHI handling requirements.'
  },
]

// ── Contractors ──────────────────────────────────────────────────
export const contractors: Contractor[] = [
  {
    id: 'r1', name: 'Patricia Williams, RN', email: 'pwilliams@kdjcontract.com', phone: '(214) 555-1001',
    state: 'TX', status: 'assigned', specialties: ['HEDIS', 'Diabetes', 'Cardiovascular'],
    certifications: [
      { name: 'RN License - Texas', issuer: 'TX BON', expiresAt: '2027-08-15', status: 'active' },
      { name: 'HEDIS Abstraction Certified', issuer: 'NCQA', expiresAt: '2026-12-31', status: 'active' },
    ],
    hireDate: '2019-04-01', activeProjects: 2, totalRecordsReviewed: 14820,
    accuracyRate: 97.3, avgRecordsPerDay: 28, hourlyRate: 42, lastActiveDate: '2026-03-13',
  },
  {
    id: 'r2', name: 'Maria Gonzalez, RN', email: 'mgonzalez@kdjcontract.com', phone: '(972) 555-1002',
    state: 'TX', status: 'assigned', specialties: ['HEDIS', 'Pediatrics', 'Preventive Care'],
    certifications: [
      { name: 'RN License - Texas', issuer: 'TX BON', expiresAt: '2027-03-20', status: 'active' },
      { name: 'HEDIS Abstraction Certified', issuer: 'NCQA', expiresAt: '2026-06-30', status: 'expiring_soon' },
    ],
    hireDate: '2020-01-15', activeProjects: 1, totalRecordsReviewed: 11240,
    accuracyRate: 98.1, avgRecordsPerDay: 32, hourlyRate: 45, lastActiveDate: '2026-03-13',
  },
  {
    id: 'r3', name: 'Sharon Davis, RN', email: 'sdavis@kdjcontract.com', phone: '(817) 555-1003',
    state: 'TX', status: 'assigned', specialties: ['PQRS', 'GPRO', 'Cardiology'],
    certifications: [
      { name: 'RN License - Texas', issuer: 'TX BON', expiresAt: '2026-11-30', status: 'active' },
      { name: 'CPHQ', issuer: 'NAHQ', expiresAt: '2027-04-15', status: 'active' },
    ],
    hireDate: '2018-07-10', activeProjects: 2, totalRecordsReviewed: 18950,
    accuracyRate: 96.8, avgRecordsPerDay: 24, hourlyRate: 48, lastActiveDate: '2026-03-12',
  },
  {
    id: 'r4', name: 'Jennifer Thompson, RN', email: 'jthompson@kdjcontract.com', phone: '(469) 555-1004',
    state: 'TX', status: 'available', specialties: ['HEDIS', 'Behavioral Health', 'Immunizations'],
    certifications: [
      { name: 'RN License - Texas', issuer: 'TX BON', expiresAt: '2027-06-01', status: 'active' },
      { name: 'HEDIS Abstraction Certified', issuer: 'NCQA', expiresAt: '2026-12-31', status: 'active' },
    ],
    hireDate: '2021-03-22', activeProjects: 0, totalRecordsReviewed: 7630,
    accuracyRate: 95.9, avgRecordsPerDay: 26, hourlyRate: 40, lastActiveDate: '2026-03-08',
  },
  {
    id: 'r5', name: 'Barbara Johnson, RN', email: 'bjohnson@kdjcontract.com', phone: '(682) 555-1005',
    state: 'TX', status: 'assigned', specialties: ['HEDIS', 'Oncology', 'Women\'s Health'],
    certifications: [
      { name: 'RN License - Texas', issuer: 'TX BON', expiresAt: '2026-04-30', status: 'expiring_soon' },
      { name: 'HEDIS Abstraction Certified', issuer: 'NCQA', expiresAt: '2027-06-30', status: 'active' },
    ],
    hireDate: '2017-11-01', activeProjects: 1, totalRecordsReviewed: 22340,
    accuracyRate: 98.7, avgRecordsPerDay: 30, hourlyRate: 50, lastActiveDate: '2026-03-13',
  },
  {
    id: 'r6', name: 'Linda Martinez, RN', email: 'lmartinez@kdjcontract.com', phone: '(214) 555-1006',
    state: 'TX', status: 'on_leave', specialties: ['HEDIS', 'Diabetes', 'Preventive Care'],
    certifications: [
      { name: 'RN License - Texas', issuer: 'TX BON', expiresAt: '2027-09-15', status: 'active' },
    ],
    hireDate: '2022-06-15', activeProjects: 0, totalRecordsReviewed: 4210,
    accuracyRate: 96.2, avgRecordsPerDay: 22, hourlyRate: 38, lastActiveDate: '2026-02-28',
  },
  {
    id: 'r7', name: 'Karen White, RN', email: 'kwhite@kdjcontract.com', phone: '(903) 555-1007',
    state: 'TX', status: 'assigned', specialties: ['GPRO', 'Primary Care', 'Geriatrics'],
    certifications: [
      { name: 'RN License - Texas', issuer: 'TX BON', expiresAt: '2027-01-31', status: 'active' },
      { name: 'CPHQ', issuer: 'NAHQ', expiresAt: '2026-08-15', status: 'active' },
    ],
    hireDate: '2020-09-01', activeProjects: 1, totalRecordsReviewed: 9870,
    accuracyRate: 97.5, avgRecordsPerDay: 27, hourlyRate: 44, lastActiveDate: '2026-03-13',
  },
  {
    id: 'r8', name: 'Nancy Brown, RN', email: 'nbrown@kdjcontract.com', phone: '(512) 555-1008',
    state: 'TX', status: 'available', specialties: ['HEDIS', 'Respiratory', 'ED'],
    certifications: [
      { name: 'RN License - Texas', issuer: 'TX BON', expiresAt: '2027-05-15', status: 'active' },
      { name: 'HEDIS Abstraction Certified', issuer: 'NCQA', expiresAt: '2026-12-31', status: 'active' },
    ],
    hireDate: '2023-01-10', activeProjects: 0, totalRecordsReviewed: 3450,
    accuracyRate: 95.4, avgRecordsPerDay: 20, hourlyRate: 38, lastActiveDate: '2026-03-05',
  },
]

// ── Projects ─────────────────────────────────────────────────────
export const projects: Project[] = [
  {
    id: 'p1', name: 'HEDIS 2026 - BCBSTX', type: 'hedis', clientId: 'c2', clientName: 'Blue Cross Blue Shield of Texas',
    status: 'active', season: 'HEDIS 2026', totalRecords: 4200, completedRecords: 2814, flaggedRecords: 47,
    accuracy: 97.2, startDate: '2026-01-15', deadline: '2026-05-15',
    assignedContractors: ['r1', 'r2', 'r5'], measures: ['CBP', 'CDC-HbA1c', 'BCS', 'COL', 'CIS'],
    notes: 'Primary HEDIS season project. 3 RNs assigned, on track for deadline.'
  },
  {
    id: 'p2', name: 'HEDIS 2026 - TX Health Presby', type: 'hedis', clientId: 'c1', clientName: 'Texas Health Presbyterian',
    status: 'active', season: 'HEDIS 2026', totalRecords: 1850, completedRecords: 923, flaggedRecords: 18,
    accuracy: 96.8, startDate: '2026-02-01', deadline: '2026-06-01',
    assignedContractors: ['r1', 'r3'], measures: ['CBP', 'CDC-HbA1c', 'PPC', 'W30'],
    notes: 'Second HEDIS project for TX Health. Includes prenatal care measures.'
  },
  {
    id: 'p3', name: 'PQRS 2026 - NTX Cardiology', type: 'pqrs', clientId: 'c3', clientName: 'North Texas Cardiology Associates',
    status: 'active', season: 'PQRS 2026', totalRecords: 620, completedRecords: 410, flaggedRecords: 8,
    accuracy: 97.8, startDate: '2026-01-20', deadline: '2026-04-30',
    assignedContractors: ['r3'], measures: ['PQRS-236', 'PQRS-317', 'PQRS-226'],
    notes: 'Cardiology-specific PQRS measures. Sharon Davis lead reviewer.'
  },
  {
    id: 'p4', name: 'GPRO 2026 - Aetna TX', type: 'gpro', clientId: 'c5', clientName: 'Aetna Texas Division',
    status: 'active', season: 'GPRO 2026', totalRecords: 980, completedRecords: 312, flaggedRecords: 14,
    accuracy: 96.5, startDate: '2026-02-15', deadline: '2026-06-30',
    assignedContractors: ['r7'], measures: ['PREV-5', 'PREV-7', 'PREV-10', 'CARE-2'],
    notes: 'New GPRO engagement. Strict PHI handling per client requirements.'
  },
  {
    id: 'p5', name: 'HEDIS 2026 - BSW Health', type: 'hedis', clientId: 'c4', clientName: 'Baylor Scott & White Health',
    status: 'planning', season: 'HEDIS 2026', totalRecords: 3100, completedRecords: 0, flaggedRecords: 0,
    accuracy: 0, startDate: '2026-04-01', deadline: '2026-07-31',
    assignedContractors: [], measures: ['CBP', 'BCS', 'CCS', 'CDC-Eye'],
    notes: 'Planning phase. Multi-facility abstraction across 4 BSW hospitals.'
  },
  {
    id: 'p6', name: 'HEDIS 2025 - BCBSTX (Archived)', type: 'hedis', clientId: 'c2', clientName: 'Blue Cross Blue Shield of Texas',
    status: 'completed', season: 'HEDIS 2025', totalRecords: 3800, completedRecords: 3800, flaggedRecords: 32,
    accuracy: 97.6, startDate: '2025-01-10', deadline: '2025-05-15',
    assignedContractors: ['r1', 'r2', 'r3', 'r5'], measures: ['CBP', 'CDC-HbA1c', 'BCS', 'COL'],
    notes: 'Completed on time. 97.6% accuracy — client highly satisfied.'
  },
]

// ── Medical Records ──────────────────────────────────────────────
const hedis_measures = ['CBP', 'CDC-HbA1c', 'BCS', 'COL', 'CIS', 'PPC', 'W30']
const facilities = ['TX Health Presby - Dallas', 'TX Health Presby - Plano', 'BSW Temple', 'BSW Dallas', 'Methodist Dallas']
const names = ['James Miller', 'Maria Santos', 'Robert Chen', 'Angela Davis', 'Thomas Wilson', 'Lisa Nguyen', 'David Kim', 'Patricia Brown', 'Michael Garcia', 'Susan Lee', 'Christopher Jones', 'Amanda White', 'Daniel Martinez', 'Rebecca Taylor', 'Matthew Anderson']

export const medicalRecords: MedicalRecord[] = Array.from({ length: 60 }, (_, i) => {
  const statuses: MedicalRecord['status'][] = ['completed', 'completed', 'completed', 'in_review', 'in_review', 'assigned', 'pending', 'overread', 'flagged', 'completed']
  const s = statuses[i % statuses.length]
  const assignees = ['r1', 'r2', 'r3', 'r5', 'r7']
  const assigneeNames = ['Patricia Williams, RN', 'Maria Gonzalez, RN', 'Sharon Davis, RN', 'Barbara Johnson, RN', 'Karen White, RN']
  const aIdx = i % assignees.length
  return {
    id: `rec-${1000 + i}`,
    projectId: ['p1', 'p1', 'p2', 'p3', 'p4'][i % 5],
    memberId: `MBR-${200000 + i}`,
    memberName: names[i % names.length],
    measureCode: hedis_measures[i % hedis_measures.length],
    measureName: ['Controlling Blood Pressure', 'Diabetes HbA1c Control', 'Breast Cancer Screening', 'Colorectal Cancer Screening', 'Childhood Immunization', 'Prenatal/Postpartum Care', 'Well-Child Visits'][i % 7],
    status: s,
    assignedTo: s !== 'pending' ? assignees[aIdx] : null,
    assignedToName: s !== 'pending' ? assigneeNames[aIdx] : null,
    receivedDate: `2026-0${1 + (i % 3)}-${String(5 + (i % 20)).padStart(2, '0')}`,
    reviewedDate: ['completed', 'overread', 'flagged'].includes(s) ? `2026-03-${String(1 + (i % 12)).padStart(2, '0')}` : null,
    overreadDate: s === 'overread' ? `2026-03-${String(8 + (i % 5)).padStart(2, '0')}` : null,
    overreadBy: s === 'overread' ? 'r3' : null,
    overreadVerdict: s === 'overread' ? (['agree', 'agree', 'partial'] as const)[i % 3] : null,
    annotations: s === 'flagged' ? ['Missing lab result', 'Date discrepancy noted'] : [],
    facility: facilities[i % facilities.length],
    dosFrom: `2025-${String(1 + (i % 12)).padStart(2, '0')}-01`,
    dosTo: `2025-${String(1 + (i % 12)).padStart(2, '0')}-28`,
  }
})

// ── Compliance ───────────────────────────────────────────────────
export const complianceItems: ComplianceItem[] = [
  { id: 'cm1', measureType: 'hedis', measureCode: 'CBP', measureName: 'Controlling Blood Pressure', projectId: 'p1', projectName: 'HEDIS 2026 - BCBSTX', numerator: 412, denominator: 520, rate: 79.2, target: 75, status: 'met', deadline: '2026-05-15' },
  { id: 'cm2', measureType: 'hedis', measureCode: 'CDC-HbA1c', measureName: 'Diabetes HbA1c Control', projectId: 'p1', projectName: 'HEDIS 2026 - BCBSTX', numerator: 380, denominator: 510, rate: 74.5, target: 78, status: 'at_risk', deadline: '2026-05-15' },
  { id: 'cm3', measureType: 'hedis', measureCode: 'BCS', measureName: 'Breast Cancer Screening', projectId: 'p1', projectName: 'HEDIS 2026 - BCBSTX', numerator: 620, denominator: 780, rate: 79.5, target: 76, status: 'met', deadline: '2026-05-15' },
  { id: 'cm4', measureType: 'hedis', measureCode: 'COL', measureName: 'Colorectal Cancer Screening', projectId: 'p1', projectName: 'HEDIS 2026 - BCBSTX', numerator: 340, denominator: 490, rate: 69.4, target: 72, status: 'below_target', deadline: '2026-05-15' },
  { id: 'cm5', measureType: 'hedis', measureCode: 'CIS', measureName: 'Childhood Immunization Status', projectId: 'p1', projectName: 'HEDIS 2026 - BCBSTX', numerator: 290, denominator: 360, rate: 80.6, target: 78, status: 'met', deadline: '2026-05-15' },
  { id: 'cm6', measureType: 'pqrs', measureCode: 'PQRS-236', measureName: 'Ischemic Vascular Disease - Statin Therapy', projectId: 'p3', projectName: 'PQRS 2026 - NTX Cardiology', numerator: 185, denominator: 210, rate: 88.1, target: 85, status: 'met', deadline: '2026-04-30' },
  { id: 'cm7', measureType: 'pqrs', measureCode: 'PQRS-317', measureName: 'Heart Failure - Beta-Blocker Therapy', projectId: 'p3', projectName: 'PQRS 2026 - NTX Cardiology', numerator: 142, denominator: 180, rate: 78.9, target: 80, status: 'at_risk', deadline: '2026-04-30' },
  { id: 'cm8', measureType: 'gpro', measureCode: 'PREV-5', measureName: 'Colorectal Cancer Screening', projectId: 'p4', projectName: 'GPRO 2026 - Aetna TX', numerator: 78, denominator: 120, rate: 65.0, target: 70, status: 'below_target', deadline: '2026-06-30' },
  { id: 'cm9', measureType: 'gpro', measureCode: 'PREV-7', measureName: 'Breast Cancer Screening', projectId: 'p4', projectName: 'GPRO 2026 - Aetna TX', numerator: 95, denominator: 115, rate: 82.6, target: 76, status: 'on_track', deadline: '2026-06-30' },
]

// ── Invoices ─────────────────────────────────────────────────────
export const invoices: Invoice[] = [
  {
    id: 'inv-001', clientId: 'c2', clientName: 'Blue Cross Blue Shield of Texas', projectId: 'p1', projectName: 'HEDIS 2026 - BCBSTX',
    amount: 28450, status: 'paid', issuedDate: '2026-02-01', dueDate: '2026-03-01', paidDate: '2026-02-25',
    hours: 620, recordsCompleted: 1400,
    lineItems: [
      { description: 'Medical Record Review - HEDIS (1,400 records)', quantity: 1400, rate: 18, total: 25200 },
      { description: 'Overread QA Review', quantity: 140, rate: 22, total: 3080 },
      { description: 'Project Management', quantity: 1, rate: 170, total: 170 },
    ]
  },
  {
    id: 'inv-002', clientId: 'c2', clientName: 'Blue Cross Blue Shield of Texas', projectId: 'p1', projectName: 'HEDIS 2026 - BCBSTX',
    amount: 25380, status: 'sent', issuedDate: '2026-03-01', dueDate: '2026-04-01', paidDate: null,
    hours: 540, recordsCompleted: 1414,
    lineItems: [
      { description: 'Medical Record Review - HEDIS (1,414 records)', quantity: 1414, rate: 18, total: 25452 },
      { description: 'Project Management', quantity: 1, rate: -72, total: -72 },
    ]
  },
  {
    id: 'inv-003', clientId: 'c1', clientName: 'Texas Health Presbyterian', projectId: 'p2', projectName: 'HEDIS 2026 - TX Health Presby',
    amount: 18630, status: 'paid', issuedDate: '2026-03-01', dueDate: '2026-04-01', paidDate: '2026-03-10',
    hours: 380, recordsCompleted: 923,
    lineItems: [
      { description: 'Medical Record Review - HEDIS (923 records)', quantity: 923, rate: 18, total: 16614 },
      { description: 'Overread QA Review', quantity: 92, rate: 22, total: 2024 },
      { description: 'Fax/Records Retrieval', quantity: 1, rate: -8, total: -8 },
    ]
  },
  {
    id: 'inv-004', clientId: 'c3', clientName: 'North Texas Cardiology Associates', projectId: 'p3', projectName: 'PQRS 2026 - NTX Cardiology',
    amount: 9840, status: 'overdue', issuedDate: '2026-02-15', dueDate: '2026-03-05', paidDate: null,
    hours: 164, recordsCompleted: 410,
    lineItems: [
      { description: 'Medical Record Review - PQRS (410 records)', quantity: 410, rate: 22, total: 9020 },
      { description: 'Project Management', quantity: 1, rate: 820, total: 820 },
    ]
  },
  {
    id: 'inv-005', clientId: 'c5', clientName: 'Aetna Texas Division', projectId: 'p4', projectName: 'GPRO 2026 - Aetna TX',
    amount: 7488, status: 'draft', issuedDate: '2026-03-13', dueDate: '2026-04-13', paidDate: null,
    hours: 156, recordsCompleted: 312,
    lineItems: [
      { description: 'Medical Record Review - GPRO (312 records)', quantity: 312, rate: 24, total: 7488 },
    ]
  },
]

// ── Audit Log ────────────────────────────────────────────────────
export const auditEntries: AuditEntry[] = [
  { id: 'a1', timestamp: '2026-03-13T09:42:00Z', userId: 'r1', userName: 'Patricia Williams, RN', action: 'view_phi', resource: 'Record rec-1004', details: 'Viewed member MBR-200004 medical record', ipAddress: '73.162.44.102', success: true },
  { id: 'a2', timestamp: '2026-03-13T09:38:00Z', userId: 'admin1', userName: 'Kim Johnson (Admin)', action: 'report_generated', resource: 'Project Status Report', details: 'Generated Project Status report for HEDIS 2026 - BCBSTX', ipAddress: '98.174.22.56', success: true },
  { id: 'a3', timestamp: '2026-03-13T09:30:00Z', userId: 'r2', userName: 'Maria Gonzalez, RN', action: 'record_update', resource: 'Record rec-1012', details: 'Completed review, marked as compliant', ipAddress: '107.55.128.91', success: true },
  { id: 'a4', timestamp: '2026-03-13T09:15:00Z', userId: 'r5', userName: 'Barbara Johnson, RN', action: 'view_phi', resource: 'Record rec-1028', details: 'Viewed member MBR-200028 medical record', ipAddress: '73.162.44.102', success: true },
  { id: 'a5', timestamp: '2026-03-13T09:10:00Z', userId: 'r3', userName: 'Sharon Davis, RN', action: 'record_update', resource: 'Record rec-1018', details: 'Flagged for overread — date discrepancy', ipAddress: '67.10.234.18', success: true },
  { id: 'a6', timestamp: '2026-03-13T08:55:00Z', userId: 'admin1', userName: 'Kim Johnson (Admin)', action: 'export_data', resource: 'Compliance Report', details: 'Exported HEDIS measure rates to CSV', ipAddress: '98.174.22.56', success: true },
  { id: 'a7', timestamp: '2026-03-13T08:45:00Z', userId: 'ext-c2', userName: 'Mark Rodriguez (BCBSTX)', action: 'project_access', resource: 'Project p1', details: 'Client accessed project dashboard', ipAddress: '12.55.200.44', success: true },
  { id: 'a8', timestamp: '2026-03-13T08:30:00Z', userId: 'r7', userName: 'Karen White, RN', action: 'login', resource: 'HARTS Portal', details: 'Successful login', ipAddress: '45.78.120.33', success: true },
  { id: 'a9', timestamp: '2026-03-13T08:28:00Z', userId: 'unknown', userName: 'Unknown', action: 'login', resource: 'HARTS Portal', details: 'Failed login attempt — invalid credentials', ipAddress: '192.168.1.100', success: false },
  { id: 'a10', timestamp: '2026-03-13T08:00:00Z', userId: 'admin1', userName: 'Kim Johnson (Admin)', action: 'login', resource: 'HARTS Portal', details: 'Successful login', ipAddress: '98.174.22.56', success: true },
  { id: 'a11', timestamp: '2026-03-12T17:30:00Z', userId: 'r1', userName: 'Patricia Williams, RN', action: 'logout', resource: 'HARTS Portal', details: 'Session ended', ipAddress: '73.162.44.102', success: true },
  { id: 'a12', timestamp: '2026-03-12T16:45:00Z', userId: 'r2', userName: 'Maria Gonzalez, RN', action: 'view_phi', resource: 'Batch Export', details: 'Accessed 25 member records for batch review', ipAddress: '107.55.128.91', success: true },
]

// ── Training Modules ─────────────────────────────────────────────
export const trainingModules: TrainingModule[] = [
  {
    id: 't1', name: 'HEDIS 2026 Measure Updates', category: 'HEDIS',
    requiredFor: ['hedis'], duration: '4 hours',
    completedBy: [
      { contractorId: 'r1', contractorName: 'Patricia Williams', completedDate: '2026-01-10', score: 96 },
      { contractorId: 'r2', contractorName: 'Maria Gonzalez', completedDate: '2026-01-12', score: 98 },
      { contractorId: 'r5', contractorName: 'Barbara Johnson', completedDate: '2026-01-11', score: 94 },
      { contractorId: 'r4', contractorName: 'Jennifer Thompson', completedDate: '2026-01-14', score: 92 },
    ],
    totalAssigned: 6, completionRate: 66.7,
  },
  {
    id: 't2', name: 'HIPAA Privacy & Security Annual', category: 'Compliance',
    requiredFor: ['hedis', 'pqrs', 'gpro', 'custom'], duration: '2 hours',
    completedBy: [
      { contractorId: 'r1', contractorName: 'Patricia Williams', completedDate: '2026-01-05', score: 100 },
      { contractorId: 'r2', contractorName: 'Maria Gonzalez', completedDate: '2026-01-05', score: 100 },
      { contractorId: 'r3', contractorName: 'Sharon Davis', completedDate: '2026-01-06', score: 98 },
      { contractorId: 'r4', contractorName: 'Jennifer Thompson', completedDate: '2026-01-05', score: 100 },
      { contractorId: 'r5', contractorName: 'Barbara Johnson', completedDate: '2026-01-07', score: 96 },
      { contractorId: 'r7', contractorName: 'Karen White', completedDate: '2026-01-06', score: 100 },
      { contractorId: 'r8', contractorName: 'Nancy Brown', completedDate: '2026-01-08', score: 94 },
    ],
    totalAssigned: 8, completionRate: 87.5,
  },
  {
    id: 't3', name: 'PQRS/GPRO Reporting Requirements', category: 'Quality Reporting',
    requiredFor: ['pqrs', 'gpro'], duration: '3 hours',
    completedBy: [
      { contractorId: 'r3', contractorName: 'Sharon Davis', completedDate: '2026-01-15', score: 97 },
      { contractorId: 'r7', contractorName: 'Karen White', completedDate: '2026-01-16', score: 95 },
    ],
    totalAssigned: 3, completionRate: 66.7,
  },
  {
    id: 't4', name: 'Inter-Rater Reliability Workshop', category: 'Quality',
    requiredFor: ['hedis', 'pqrs', 'gpro'], duration: '2 hours',
    completedBy: [
      { contractorId: 'r1', contractorName: 'Patricia Williams', completedDate: '2026-02-01', score: 98 },
      { contractorId: 'r3', contractorName: 'Sharon Davis', completedDate: '2026-02-02', score: 96 },
      { contractorId: 'r5', contractorName: 'Barbara Johnson', completedDate: '2026-02-01', score: 99 },
    ],
    totalAssigned: 8, completionRate: 37.5,
  },
  {
    id: 't5', name: 'HARTS Platform Training', category: 'Technology',
    requiredFor: ['hedis', 'pqrs', 'gpro', 'custom'], duration: '1.5 hours',
    completedBy: [
      { contractorId: 'r1', contractorName: 'Patricia Williams', completedDate: '2026-01-03', score: 100 },
      { contractorId: 'r2', contractorName: 'Maria Gonzalez', completedDate: '2026-01-03', score: 100 },
      { contractorId: 'r3', contractorName: 'Sharon Davis', completedDate: '2026-01-03', score: 100 },
      { contractorId: 'r5', contractorName: 'Barbara Johnson', completedDate: '2026-01-04', score: 98 },
      { contractorId: 'r7', contractorName: 'Karen White', completedDate: '2026-01-04', score: 100 },
      { contractorId: 'r8', contractorName: 'Nancy Brown', completedDate: '2026-01-05', score: 95 },
    ],
    totalAssigned: 8, completionRate: 75,
  },
  {
    id: 't6', name: 'SOC 2 Compliance Awareness', category: 'Security',
    requiredFor: ['hedis', 'pqrs', 'gpro', 'custom'], duration: '1 hour',
    completedBy: [
      { contractorId: 'r1', contractorName: 'Patricia Williams', completedDate: '2026-01-08', score: 100 },
      { contractorId: 'r2', contractorName: 'Maria Gonzalez', completedDate: '2026-01-08', score: 100 },
      { contractorId: 'r3', contractorName: 'Sharon Davis', completedDate: '2026-01-09', score: 100 },
      { contractorId: 'r5', contractorName: 'Barbara Johnson', completedDate: '2026-01-09', score: 98 },
      { contractorId: 'r7', contractorName: 'Karen White', completedDate: '2026-01-09', score: 100 },
    ],
    totalAssigned: 8, completionRate: 62.5,
  },
]

// ── Dashboard Stats ──────────────────────────────────────────────
export const dashboardStats: DashboardStats = {
  activeProjects: 4,
  pendingRecords: 847,
  activeContractors: 6,
  avgAccuracy: 97.1,
  recordsThisWeek: 342,
  upcomingDeadlines: [
    { project: 'PQRS 2026 - NTX Cardiology', deadline: '2026-04-30', daysLeft: 48 },
    { project: 'HEDIS 2026 - BCBSTX', deadline: '2026-05-15', daysLeft: 63 },
    { project: 'HEDIS 2026 - TX Health Presby', deadline: '2026-06-01', daysLeft: 80 },
    { project: 'GPRO 2026 - Aetna TX', deadline: '2026-06-30', daysLeft: 109 },
  ],
  recentActivity: [
    { action: 'Record Completed', detail: 'Patricia Williams completed CBP review for MBR-200042', time: '2 min ago' },
    { action: 'Overread Complete', detail: 'Sharon Davis overread 15 records — 14 agree, 1 partial', time: '18 min ago' },
    { action: 'Records Received', detail: '45 new records received for HEDIS 2026 - BCBSTX', time: '1 hr ago' },
    { action: 'Invoice Paid', detail: 'TX Health Presbyterian paid INV-003 ($18,630)', time: '3 hr ago' },
    { action: 'Training Completed', detail: 'Nancy Brown completed HARTS Platform Training (95%)', time: '5 hr ago' },
    { action: 'Client Access', detail: 'Mark Rodriguez (BCBSTX) viewed project dashboard', time: '6 hr ago' },
    { action: 'Credential Alert', detail: 'Barbara Johnson RN license expires in 48 days', time: '8 hr ago' },
    { action: 'Project Created', detail: 'HEDIS 2026 - BSW Health moved to planning phase', time: '1 day ago' },
  ],
}
