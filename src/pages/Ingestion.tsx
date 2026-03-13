import { motion, AnimatePresence } from 'framer-motion'
import {
  ScanLine, Upload, FileText, CheckCircle2, XCircle, AlertTriangle,
  Clock, Eye, ChevronRight, ArrowLeft, ThumbsUp, ThumbsDown, Edit3,
  Loader2, FileCheck, Sparkles, BarChart3
} from 'lucide-react'
import { useState, useCallback, useRef } from 'react'
import { ocrBatches, ocrExtractedRecords, projects } from '../data/mockData'
import type { OcrBatch, OcrExtractedRecord, OcrBatchStatus } from '../types'

const statusConfig: Record<OcrBatchStatus, { label: string; color: string; icon: typeof Clock }> = {
  uploading: { label: 'Uploading', color: 'text-kdj-blue bg-kdj-blue/10', icon: Upload },
  processing: { label: 'OCR Processing', color: 'text-kdj-purple bg-kdj-purple/10', icon: Loader2 },
  ready_for_review: { label: 'Ready for Review', color: 'text-kdj-amber bg-amber-50', icon: Eye },
  in_review: { label: 'In Review', color: 'text-kdj-blue bg-kdj-blue/10', icon: Eye },
  approved: { label: 'Approved', color: 'text-kdj-green bg-green-50', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'text-kdj-red bg-red-50', icon: XCircle },
  partial: { label: 'Partially Approved', color: 'text-kdj-amber bg-amber-50', icon: AlertTriangle },
}

const confidenceColor = (c: string) =>
  c === 'high' ? 'text-kdj-green bg-green-50' : c === 'medium' ? 'text-kdj-amber bg-amber-50' : 'text-kdj-red bg-red-50'

export default function Ingestion() {
  const [selectedBatch, setSelectedBatch] = useState<OcrBatch | null>(null)
  const [reviewRecord, setReviewRecord] = useState<OcrExtractedRecord | null>(null)
  const [records, setRecords] = useState(ocrExtractedRecords)
  const [batches, setBatches] = useState(ocrBatches)
  const [dragOver, setDragOver] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending_review' | 'approved' | 'rejected' | 'corrected'>('all')
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback((files: File[]) => {
    const pdfFiles = files.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
    if (pdfFiles.length === 0) return

    pdfFiles.forEach((file, idx) => {
      const batchId = `ocr-${Date.now()}-${idx}`
      const newBatch: OcrBatch = {
        id: batchId,
        fileName: file.name,
        fileSize: file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(0)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedBy: 'Kim Johnson',
        uploadedAt: new Date().toISOString(),
        projectId: 'p1',
        projectName: 'HEDIS 2026 - BCBSTX',
        status: 'uploading',
        totalPages: Math.max(1, Math.floor(file.size / 5000) || Math.floor(Math.random() * 40) + 5),
        recordsExtracted: 0,
        recordsApproved: 0,
        recordsRejected: 0,
        processingTime: null,
        errorMessage: null,
      }
      setBatches(prev => [newBatch, ...prev])

      // Uploading → Processing after 1s
      setTimeout(() => {
        setBatches(prev => prev.map(b =>
          b.id === batchId ? { ...b, status: 'processing' as const } : b
        ))
      }, 1000)

      // Processing → Ready for Review after 3-6s
      const processingTime = 3000 + Math.random() * 3000
      setTimeout(() => {
        const extracted = Math.floor(Math.random() * 30) + 10
        setBatches(prev => prev.map(b =>
          b.id === batchId ? {
            ...b,
            status: 'ready_for_review' as const,
            recordsExtracted: extracted,
            processingTime: `${Math.floor(Math.random() * 4) + 1}m ${Math.floor(Math.random() * 59)}s`,
          } : b
        ))
      }, 1000 + processingTime)
    })
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    processFiles(Array.from(e.dataTransfer.files))
  }, [processFiles])

  const approveRecord = (rec: OcrExtractedRecord) => {
    setRecords(prev => prev.map(r => r.id === rec.id ? { ...r, status: 'approved' as const, reviewedBy: 'Kim Johnson', reviewedAt: new Date().toISOString() } : r))
    // Move to next pending record
    const pending = records.filter(r => r.status === 'pending_review' && r.id !== rec.id)
    setReviewRecord(pending[0] || null)
  }

  const rejectRecord = (rec: OcrExtractedRecord) => {
    setRecords(prev => prev.map(r => r.id === rec.id ? { ...r, status: 'rejected' as const, reviewedBy: 'Kim Johnson', reviewedAt: new Date().toISOString() } : r))
    const pending = records.filter(r => r.status === 'pending_review' && r.id !== rec.id)
    setReviewRecord(pending[0] || null)
  }

  const startEdit = (field: string, value: string) => {
    setEditingField(field)
    setEditValue(value)
  }

  const saveEdit = (rec: OcrExtractedRecord, field: string) => {
    setRecords(prev => prev.map(r => r.id === rec.id ? {
      ...r,
      status: 'corrected' as const,
      corrections: { ...r.corrections, [field]: editValue },
      extractedData: { ...r.extractedData, [field]: editValue },
    } : r))
    setEditingField(null)
    setReviewRecord(prev => prev ? {
      ...prev,
      extractedData: { ...prev.extractedData, [field]: editValue },
      corrections: { ...prev.corrections, [field]: editValue },
    } : null)
  }

  const batchRecords = selectedBatch ? records.filter(r => r.batchId === selectedBatch.id) : []
  const filteredRecords = filter === 'all' ? batchRecords : batchRecords.filter(r => r.status === filter)

  const pipelineStats = {
    totalBatches: batches.length,
    processing: batches.filter(b => b.status === 'processing').length,
    awaitingReview: batches.filter(b => b.status === 'ready_for_review' || b.status === 'in_review').length,
    totalExtracted: batches.reduce((sum, b) => sum + b.recordsExtracted, 0),
    totalApproved: batches.reduce((sum, b) => sum + b.recordsApproved, 0),
  }

  // ── Review mode ─────────────────────────────────────────────
  if (reviewRecord) {
    const d = reviewRecord.extractedData
    const fields: { key: keyof typeof d; label: string }[] = [
      { key: 'memberName', label: 'Member Name' },
      { key: 'memberId', label: 'Member ID' },
      { key: 'dob', label: 'Date of Birth' },
      { key: 'facility', label: 'Facility' },
      { key: 'measureCode', label: 'Measure Code' },
      { key: 'measureName', label: 'Measure Name' },
      { key: 'dosFrom', label: 'DOS From' },
      { key: 'dosTo', label: 'DOS To' },
      { key: 'diagnosis', label: 'Diagnosis' },
      { key: 'provider', label: 'Provider' },
      { key: 'notes', label: 'Notes' },
    ]

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setReviewRecord(null)} className="text-kdj-muted hover:text-kdj-text transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-kdj-text">Review Extracted Record</h1>
            <p className="text-xs text-kdj-muted">
              {reviewRecord.id} · Pages {reviewRecord.pageRange} ·
              <span className={`ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${confidenceColor(reviewRecord.confidence)}`}>
                {reviewRecord.confidenceScore}% confidence
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Left — PDF Preview (simulated) */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-semibold text-kdj-text mb-3 flex items-center gap-2">
              <FileText size={14} className="text-kdj-muted" /> Source PDF — Pages {reviewRecord.pageRange}
            </h3>
            <div className="bg-gray-50 rounded-lg border border-kdj-border p-6 min-h-[500px] flex flex-col items-center justify-center">
              <div className="w-full max-w-sm space-y-4 text-left">
                <div className="border-b border-gray-200 pb-3">
                  <div className="text-[10px] text-kdj-muted uppercase tracking-wider">Medical Record</div>
                  <div className="text-sm font-bold text-kdj-text mt-1">{d.facility || 'Unknown Facility'}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] text-kdj-muted">Patient</div>
                    <div className="text-xs font-medium">{d.memberName || '—'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-kdj-muted">DOB</div>
                    <div className="text-xs font-medium">{d.dob || '—'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-kdj-muted">Member ID</div>
                    <div className="text-xs font-medium font-mono">{d.memberId || '—'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-kdj-muted">Provider</div>
                    <div className="text-xs font-medium">{d.provider || '—'}</div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="text-[10px] text-kdj-muted">Diagnosis</div>
                  <div className="text-xs mt-1">{d.diagnosis || '—'}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-3">
                  <div>
                    <div className="text-[10px] text-kdj-muted">Service Date From</div>
                    <div className="text-xs font-medium">{d.dosFrom || '—'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-kdj-muted">Service Date To</div>
                    <div className="text-xs font-medium">{d.dosTo || '—'}</div>
                  </div>
                </div>
                {reviewRecord.flags.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded p-2 mt-2">
                    {reviewRecord.flags.map((f, i) => (
                      <div key={i} className="text-[10px] text-amber-700 flex items-center gap-1">
                        <AlertTriangle size={10} /> {f}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right — Extracted data with edit */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-semibold text-kdj-text mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-kdj-purple" /> OCR Extracted Data
              {Object.keys(reviewRecord.corrections).length > 0 && (
                <span className="text-[10px] bg-kdj-blue/10 text-kdj-blue px-1.5 py-0.5 rounded">
                  {Object.keys(reviewRecord.corrections).length} corrected
                </span>
              )}
            </h3>
            <div className="space-y-2">
              {fields.map(({ key, label }) => {
                const val = d[key] || ''
                const isCorrected = key in reviewRecord.corrections
                const isEditing = editingField === key

                return (
                  <div key={key} className={`flex items-center gap-2 p-2.5 rounded-lg ${isCorrected ? 'bg-blue-50 border border-blue-100' : 'bg-kdj-surface'}`}>
                    <div className="w-28 shrink-0">
                      <div className="text-[10px] text-kdj-muted">{label}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex gap-1">
                          <input
                            autoFocus
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && saveEdit(reviewRecord, key)}
                            className="flex-1 px-2 py-1 text-xs border border-kdj-blue rounded focus:outline-none focus:ring-1 focus:ring-kdj-blue"
                          />
                          <button onClick={() => saveEdit(reviewRecord, key)} className="text-xs text-kdj-blue hover:underline">Save</button>
                          <button onClick={() => setEditingField(null)} className="text-xs text-kdj-muted hover:underline">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${val ? 'text-kdj-text' : 'text-kdj-red italic'}`}>
                            {val || 'Not detected'}
                          </span>
                          {isCorrected && <span className="text-[9px] text-kdj-blue">(corrected)</span>}
                        </div>
                      )}
                    </div>
                    {!isEditing && (
                      <button onClick={() => startEdit(key, val)} className="text-kdj-muted hover:text-kdj-blue transition-colors">
                        <Edit3 size={12} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-5 pt-4 border-t border-kdj-border/50">
              <button
                onClick={() => approveRecord(reviewRecord)}
                className="flex-1 flex items-center justify-center gap-2 bg-kdj-green text-white py-2.5 rounded-lg text-sm font-medium hover:bg-kdj-green/90 transition-colors"
              >
                <ThumbsUp size={16} /> Approve & Add to Queue
              </button>
              <button
                onClick={() => rejectRecord(reviewRecord)}
                className="flex-1 flex items-center justify-center gap-2 bg-kdj-red text-white py-2.5 rounded-lg text-sm font-medium hover:bg-kdj-red/90 transition-colors"
              >
                <ThumbsDown size={16} /> Reject
              </button>
            </div>

            <p className="text-[10px] text-kdj-muted text-center mt-2">
              Approved records will be added to the Record Queue for assignment
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  // ── Batch detail view ───────────────────────────────────────
  if (selectedBatch) {
    const stats = {
      pending: batchRecords.filter(r => r.status === 'pending_review').length,
      approved: batchRecords.filter(r => r.status === 'approved' || r.status === 'corrected').length,
      rejected: batchRecords.filter(r => r.status === 'rejected').length,
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedBatch(null); setFilter('all') }} className="text-kdj-muted hover:text-kdj-text transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-kdj-text flex items-center gap-2">
              <FileText size={18} className="text-kdj-muted" /> {selectedBatch.fileName}
            </h1>
            <p className="text-xs text-kdj-muted">{selectedBatch.projectName} · {selectedBatch.totalPages} pages · {selectedBatch.recordsExtracted} records extracted</p>
          </div>
          {stats.pending > 0 && (
            <button
              onClick={() => { setFilter('pending_review'); setReviewRecord(batchRecords.find(r => r.status === 'pending_review') || null) }}
              className="flex items-center gap-2 bg-kdj-navy text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-kdj-slate transition-colors"
            >
              <Eye size={14} /> Start Review ({stats.pending} remaining)
            </button>
          )}
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-kdj-amber">{stats.pending}</div>
            <div className="text-xs text-kdj-muted mt-1">Pending Review</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-kdj-green">{stats.approved}</div>
            <div className="text-xs text-kdj-muted mt-1">Approved</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-kdj-red">{stats.rejected}</div>
            <div className="text-xs text-kdj-muted mt-1">Rejected</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(['all', 'pending_review', 'approved', 'corrected', 'rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-kdj-navy text-white' : 'bg-kdj-surface text-kdj-muted hover:bg-gray-100'}`}
            >
              {f === 'all' ? 'All' : f === 'pending_review' ? 'Pending' : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-1 text-[10px] opacity-70">
                ({f === 'all' ? batchRecords.length : batchRecords.filter(r => r.status === f).length})
              </span>
            </button>
          ))}
        </div>

        {/* Records table */}
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-kdj-border/50">
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-kdj-muted uppercase">Pages</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-kdj-muted uppercase">Member</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-kdj-muted uppercase">Measure</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-kdj-muted uppercase">Facility</th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold text-kdj-muted uppercase">Confidence</th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold text-kdj-muted uppercase">Status</th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold text-kdj-muted uppercase">Flags</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(rec => (
                <tr key={rec.id} className="border-b border-kdj-border/30 hover:bg-kdj-surface/50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-kdj-text">{rec.pageRange}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-kdj-text">{rec.extractedData.memberName || '—'}</div>
                    <div className="text-[10px] text-kdj-muted font-mono">{rec.extractedData.memberId || 'ID not detected'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-kdj-text">{rec.extractedData.measureCode}</div>
                    <div className="text-[10px] text-kdj-muted">{rec.extractedData.measureName}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-kdj-muted">{rec.extractedData.facility || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium ${confidenceColor(rec.confidence)}`}>
                      {rec.confidenceScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium ${
                      rec.status === 'approved' || rec.status === 'corrected' ? 'text-kdj-green bg-green-50' :
                      rec.status === 'rejected' ? 'text-kdj-red bg-red-50' :
                      'text-kdj-amber bg-amber-50'
                    }`}>
                      {rec.status === 'pending_review' ? 'Pending' : rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {rec.flags.length > 0 && (
                      <span className="text-kdj-amber" title={rec.flags.join(', ')}>
                        <AlertTriangle size={14} />
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setReviewRecord(rec)}
                      className="text-xs text-kdj-blue hover:underline flex items-center gap-1"
                    >
                      Review <ChevronRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    )
  }

  // ── Main ingestion dashboard ────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-kdj-text flex items-center gap-2">
          <ScanLine size={24} className="text-kdj-purple" /> OCR Ingestion
        </h1>
        <p className="text-sm text-kdj-muted mt-1">Upload PDFs → Auto-extract records → Review & approve → Add to queue</p>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Total Batches', value: pipelineStats.totalBatches, icon: FileText, color: 'bg-kdj-blue/10 text-kdj-blue' },
          { label: 'Processing', value: pipelineStats.processing, icon: Loader2, color: 'bg-kdj-purple/10 text-kdj-purple' },
          { label: 'Awaiting Review', value: pipelineStats.awaitingReview, icon: Eye, color: 'bg-amber-50 text-kdj-amber' },
          { label: 'Records Extracted', value: pipelineStats.totalExtracted, icon: Sparkles, color: 'bg-teal-50 text-kdj-teal' },
          { label: 'Records Approved', value: pipelineStats.totalApproved, icon: FileCheck, color: 'bg-green-50 text-kdj-green' },
        ].map(s => (
          <div key={s.label} className="glass-card p-5">
            <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon size={18} />
            </div>
            <div className="text-2xl font-bold text-kdj-text">{s.value}</div>
            <div className="text-xs text-kdj-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Upload Zone */}
        <div className="col-span-1">
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`glass-card p-8 border-2 border-dashed transition-colors text-center cursor-pointer ${
              dragOver ? 'border-kdj-blue bg-kdj-blue/5' : 'border-kdj-border hover:border-kdj-blue/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              className="hidden"
              onChange={e => { if (e.target.files) { processFiles(Array.from(e.target.files)); e.target.value = '' } }}
            />
            <Upload size={40} className={`mx-auto mb-4 ${dragOver ? 'text-kdj-blue' : 'text-kdj-muted'}`} />
            <h3 className="text-sm font-semibold text-kdj-text">Drop PDF Files Here</h3>
            <p className="text-xs text-kdj-muted mt-2">
              Drop medical record PDFs to start OCR extraction.
              Records will be automatically parsed and queued for review.
            </p>
            <button
              onClick={e => { e.stopPropagation(); fileInputRef.current?.click() }}
              className="mt-4 inline-flex items-center gap-2 bg-kdj-blue text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-kdj-blue/90 transition-colors"
            >
              <Upload size={14} /> Select Files
            </button>
            <div className="mt-4 flex items-center justify-center gap-2">
              <label className="flex items-center gap-2">
                <span className="text-[10px] text-kdj-muted">Project:</span>
                <select className="px-2 py-1 text-xs border border-kdj-border rounded text-kdj-text focus:outline-none focus:ring-1 focus:ring-kdj-blue/30">
                  {projects.filter(p => p.status === 'active').map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <p className="text-[10px] text-kdj-muted mt-3">Supports PDF files up to 50MB. HIPAA-compliant processing.</p>
          </div>

          {/* OCR Pipeline Visual */}
          <div className="glass-card p-5 mt-4">
            <h3 className="text-xs font-semibold text-kdj-text mb-4 flex items-center gap-2">
              <BarChart3 size={14} className="text-kdj-purple" /> Pipeline Flow
            </h3>
            <div className="space-y-3">
              {[
                { step: '1', label: 'Upload PDF', desc: 'Drag & drop or select files', icon: Upload, color: 'bg-kdj-blue' },
                { step: '2', label: 'OCR Processing', desc: 'AI extracts member data, measures, dates', icon: ScanLine, color: 'bg-kdj-purple' },
                { step: '3', label: 'Nurse Review', desc: 'Side-by-side PDF vs. extracted data', icon: Eye, color: 'bg-kdj-amber' },
                { step: '4', label: 'Approve / Correct', desc: 'Verify or fix OCR results', icon: Edit3, color: 'bg-kdj-teal' },
                { step: '5', label: 'Add to Queue', desc: 'Approved records enter Record Queue', icon: CheckCircle2, color: 'bg-kdj-green' },
              ].map((s, i) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full ${s.color} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                    {s.step}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-kdj-text">{s.label}</div>
                    <div className="text-[10px] text-kdj-muted">{s.desc}</div>
                  </div>
                  {i < 4 && <ChevronRight size={12} className="text-kdj-muted shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Batch Queue */}
        <div className="col-span-2 glass-card p-5">
          <h2 className="text-sm font-semibold text-kdj-text mb-4">Ingestion Queue</h2>
          <div className="space-y-2">
            <AnimatePresence>
              {batches.map((batch, i) => {
                const sc = statusConfig[batch.status]
                const StatusIcon = sc.icon
                return (
                  <motion.div
                    key={batch.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => (batch.status !== 'uploading' && batch.status !== 'processing') && setSelectedBatch(batch)}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                      batch.status === 'uploading' || batch.status === 'processing'
                        ? 'bg-kdj-surface'
                        : 'hover:bg-kdj-surface cursor-pointer'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg ${sc.color} flex items-center justify-center shrink-0`}>
                      <StatusIcon size={18} className={batch.status === 'processing' ? 'animate-spin' : ''} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-kdj-text truncate">{batch.fileName}</div>
                      <div className="text-[10px] text-kdj-muted">
                        {batch.projectName} · {batch.fileSize} · {batch.totalPages} pages
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium ${sc.color}`}>
                        {sc.label}
                      </span>
                      {batch.recordsExtracted > 0 && (
                        <div className="text-[10px] text-kdj-muted mt-1">
                          {batch.recordsExtracted} records
                          {batch.recordsApproved > 0 && <span className="text-kdj-green"> · {batch.recordsApproved} approved</span>}
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-kdj-muted shrink-0 w-16 text-right">
                      {new Date(batch.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    {batch.status !== 'uploading' && batch.status !== 'processing' && (
                      <ChevronRight size={14} className="text-kdj-muted shrink-0" />
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
