import { useState } from 'react'
import { daysUntil } from '../utils/ai'

const STATUS_COLORS = {
  todo: 'bg-gray-100 text-gray-600',
  applied: 'bg-blue-100 text-blue-700',
  interview: 'bg-yellow-100 text-yellow-700',
  offer: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
}

const STATUS_LABELS = {
  todo: 'Not applied',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
}

function DeadlineBadge({ deadline }) {
  if (!deadline) return null
  const days = daysUntil(deadline)
  if (days < 0) return <span className="text-xs text-gray-400">Passed</span>
  if (days === 0) return <span className="text-xs font-semibold text-red-600">Due today!</span>
  if (days <= 7) return <span className="text-xs font-medium text-red-600">⚠ {days}d left</span>
  if (days <= 14) return <span className="text-xs font-medium text-orange-500">{days}d left</span>
  return <span className="text-xs text-gray-400">{days}d left</span>
}

function OppModal({ opp, onClose, onSave, onDelete, onAnalyze, onCoverLetter }) {
  const [form, setForm] = useState({ ...opp })
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))
  const setCheck = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.checked }))

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{form.role || 'New Opportunity'}</h2>
            {form.company && <p className="text-sm text-gray-500">{form.company}{form.location ? ` · ${form.location}` : ''}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Role *</label>
            <input className="input" value={form.role || ''} onChange={set('role')} placeholder="Software Engineer Intern" />
          </div>
          <div>
            <label className="label">Organisation *</label>
            <input className="input" value={form.company || ''} onChange={set('company')} placeholder="CERN" />
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location || ''} onChange={set('location')} placeholder="Geneva, Switzerland" />
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.type || ''} onChange={set('type')}>
              <option value="">Select</option>
              <option>Internship</option>
              <option>Research</option>
              <option>Fellowship</option>
              <option>Full-time</option>
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status || 'todo'} onChange={set('status')}>
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Deadline</label>
            <input type="date" className="input" value={form.deadline || ''} onChange={set('deadline')} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.paid || false} onChange={setCheck('paid')} className="rounded" />
            <span>Paid internship</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.science || false} onChange={setCheck('science')} className="rounded" />
            <span>Science / space</span>
          </label>
        </div>

        <div>
          <label className="label">Notes / application link / requirements</label>
          <textarea className="input min-h-[80px]" value={form.notes || ''} onChange={set('notes')} placeholder="Add the job URL, key requirements, or contacts here..." />
        </div>

        <div className="border-t pt-3 flex items-center justify-between gap-2 flex-wrap">
          {opp.id && (
            <button onClick={() => onDelete(opp.id)} className="btn btn-sm btn-danger">🗑 Delete</button>
          )}
          <div className="flex gap-2 flex-wrap ml-auto">
            {opp.id && (
              <>
                <button onClick={() => { onAnalyze(form); onClose() }} className="btn btn-sm">🤖 Analyze ↗</button>
                <button onClick={() => { onCoverLetter(form); onClose() }} className="btn btn-sm">✉ Cover letter ↗</button>
              </>
            )}
            <button onClick={() => { onSave(form); onClose() }} className="btn btn-sm btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Opportunities({ opps, onSave, onDelete, onAnalyze, onCoverLetter }) {
  const [modal, setModal] = useState(null)

  const sorted = [...opps].sort((a, b) => {
    if (!a.deadline) return 1
    if (!b.deadline) return -1
    return new Date(a.deadline) - new Date(b.deadline)
  })

  const counts = opps.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {})

  const urgent = opps.filter(o => o.deadline && daysUntil(o.deadline) <= 7 && o.deadline && daysUntil(o.deadline) >= 0 && o.status !== 'rejected').length

  const newOpp = { role: '', company: '', location: '', type: '', status: 'todo', deadline: '', paid: false, science: false, notes: '' }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: opps.length },
          { label: 'In progress', value: (counts.applied || 0) + (counts.interview || 0) },
          { label: 'Due soon', value: urgent, urgent: urgent > 0 },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-3 text-center ${s.urgent ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-semibold ${s.urgent ? 'text-red-600' : ''}`}>{s.value}</div>
            <div className={`text-xs mt-0.5 ${s.urgent ? 'text-red-500' : 'text-gray-500'}`}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{sorted.length} opportunit{sorted.length === 1 ? 'y' : 'ies'}</p>
        <button onClick={() => setModal(newOpp)} className="btn btn-primary btn-sm">+ Add opportunity</button>
      </div>

      {sorted.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">
          <div className="text-4xl mb-2">📋</div>
          <p className="text-sm">No opportunities tracked yet.</p>
          <p className="text-sm">Start by adding CERN, CNES, or ESA above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map(o => {
            const days = o.deadline ? daysUntil(o.deadline) : null
            const isUrgent = days !== null && days <= 7 && days >= 0 && o.status !== 'rejected'
            return (
              <div
                key={o.id}
                onClick={() => setModal(o)}
                className={`card cursor-pointer hover:border-gray-300 transition-colors ${isUrgent ? 'border-l-4 border-l-red-400' : ''}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <p className="font-medium text-sm">{o.role}</p>
                    <p className="text-xs text-gray-500">{o.company}{o.location ? ` · ${o.location}` : ''}</p>
                  </div>
                  <span className={`badge ${STATUS_COLORS[o.status]} shrink-0`}>{STATUS_LABELS[o.status]}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  {o.deadline && <DeadlineBadge deadline={o.deadline} />}
                  {o.type && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{o.type}</span>}
                  {o.paid && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Paid</span>}
                  {o.science && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">🔭 Science</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal !== null && (
        <OppModal
          opp={modal}
          onClose={() => setModal(null)}
          onSave={(form) => {
            onSave({ ...form, id: form.id || 'opp_' + Date.now() })
            setModal(null)
          }}
          onDelete={(id) => { onDelete(id); setModal(null) }}
          onAnalyze={onAnalyze}
          onCoverLetter={onCoverLetter}
        />
      )}
    </div>
  )
}
