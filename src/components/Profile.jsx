import { useState } from 'react'

export default function Profile({ profile, onSave }) {
  const [form, setForm] = useState({ ...profile })
  const [saved, setSaved] = useState(false)
  const [docTab, setDocTab] = useState('paste')

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSave = () => {
    onSave(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const reader = new FileReader()
      reader.onload = () => {
        setForm(prev => ({
          ...prev,
          docContext: (prev.docContext || '') + `\n\n[Uploaded: ${file.name} — paste key sections below or use the text above]\n`
        }))
      }
      reader.readAsArrayBuffer(file)
    } else {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setForm(prev => ({
          ...prev,
          docContext: (prev.docContext || '') + `\n\n${ev.target.result}`
        }))
      }
      reader.readAsText(file)
    }
  }

  const isComplete = form.name && form.skills && form.goals

  return (
    <div className="space-y-4 max-w-2xl">
      {isComplete && (
        <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm px-4 py-2.5 rounded-xl border border-green-200">
          <span>✓</span>
          <span>Profile complete — AI uses your details in every response</span>
        </div>
      )}

      <div className="card space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Personal information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label">Full name *</label>
            <input className="input" value={form.name || ''} onChange={set('name')} placeholder="Stephane Tchatchum" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={form.email || ''} onChange={set('email')} placeholder="your@email.com" />
          </div>
          <div>
            <label className="label">Current role</label>
            <input className="input" value={form.role || ''} onChange={set('role')} placeholder="Software Engineer Intern at Irembo" />
          </div>
          <div>
            <label className="label">Education</label>
            <input className="input" value={form.education || ''} onChange={set('education')} placeholder="BSc Software Engineering, ALU" />
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Skills & projects</h3>
        <div>
          <label className="label">Technical skills *</label>
          <textarea className="input min-h-[70px]" value={form.skills || ''} onChange={set('skills')}
            placeholder="Python, Django, Flask, Git, Linux, Groq API, SQL, C#..." />
        </div>
        <div>
          <label className="label">Deployed projects (name — description — URL)</label>
          <textarea className="input min-h-[90px]" value={form.projects || ''} onChange={set('projects')}
            placeholder="TalentScreen — AI resume screener — talentscreen-gpvs.onrender.com&#10;AfriLang — African language learning — afrilang.onrender.com" />
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Goals & targets</h3>
        <div>
          <label className="label">Career goals *</label>
          <textarea className="input min-h-[70px]" value={form.goals || ''} onChange={set('goals')}
            placeholder="Science/space internship by Sept 2026. Master's in ML or space engineering by 2028..." />
        </div>
        <div>
          <label className="label">Target organisations</label>
          <textarea className="input min-h-[70px]" value={form.targets || ''} onChange={set('targets')}
            placeholder="CERN Short Term Internship, CNES, Airbus Defence, ESA, Polytechnique Montreal..." />
        </div>
      </div>

      <div className="card space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Programme & document context</h3>
          <p className="text-xs text-gray-400 mt-1">Paste key sections from your 3-year plan, internship strategy, or daily programme. The AI uses this when writing cover letters and giving career advice.</p>
        </div>

        <div className="flex gap-2 border-b border-gray-100 pb-3">
          <button
            onClick={() => setDocTab('paste')}
            className={`btn btn-sm ${docTab === 'paste' ? 'btn-primary' : ''}`}
          >
            Paste text
          </button>
          <button
            onClick={() => setDocTab('upload')}
            className={`btn btn-sm ${docTab === 'upload' ? 'btn-primary' : ''}`}
          >
            Upload file
          </button>
        </div>

        {docTab === 'paste' && (
          <div>
            <label className="label">Key content from your plan (paste anything relevant)</label>
            <textarea
              className="input min-h-[180px] font-mono text-xs"
              value={form.docContext || ''}
              onChange={set('docContext')}
              placeholder={`Paste key sections here. For example:\n\n--- FROM THE STEPHANE PROGRAMME V3 ---\nYear 1 targets: CERN application (June), exoplanet detector (August), orbit predictor (August)...\n\n--- INTERNSHIP STRATEGY ---\nTier 1: CERN (paid 1587 CHF/month, open year-round)...\n\n--- DAILY PROGRAMME ---\nNon-negotiables: 1 NeetCode, 1 Khan Academy, 5 pages...`}
            />
            <p className="text-xs text-gray-400 mt-1">{(form.docContext || '').length} characters — AI will use this as background context</p>
          </div>
        )}

        {docTab === 'upload' && (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm text-gray-500 mb-3">Upload a text file (.txt) to add to your context.<br/>For PDF/DOCX, copy-paste the key sections instead.</p>
            <input
              type="file"
              accept=".txt,.md"
              onChange={handleFileUpload}
              className="hidden"
              id="doc-upload"
            />
            <label htmlFor="doc-upload" className="btn btn-sm cursor-pointer">
              Choose file
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn btn-primary">
          {saved ? '✓ Saved' : '↑ Save profile'}
        </button>
      </div>
    </div>
  )
}
