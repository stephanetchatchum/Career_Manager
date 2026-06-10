import { useState } from 'react'

export default function Profile({ profile, onSave }) {
  const [form, setForm] = useState({ ...profile })
  const [saved, setSaved] = useState(false)

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSave = () => {
    onSave(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const isComplete = form.name && form.skills && form.goals

  return (
    <div className="space-y-4">
      {isComplete && (
        <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg border border-green-200">
          <span>✓</span>
          <span>Profile set — AI chat will use your details automatically</span>
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
            <label className="label">Current role / status</label>
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
          <textarea className="input min-h-[80px]" value={form.skills || ''} onChange={set('skills')}
            placeholder="Python, Django, Flask, Git, Linux, Groq API, SQL, C#, React..." />
        </div>
        <div>
          <label className="label">Deployed projects (name — description — URL)</label>
          <textarea className="input min-h-[100px]" value={form.projects || ''} onChange={set('projects')}
            placeholder="TalentScreen — AI resume screener — talentscreen-gpvs.onrender.com&#10;AfriLang — African language learning — afrilang.onrender.com" />
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Goals & targets</h3>
        <div>
          <label className="label">Career goals *</label>
          <textarea className="input min-h-[80px]" value={form.goals || ''} onChange={set('goals')}
            placeholder="Science/space internship by Sept 2026. Master's in ML or space engineering by 2028. Long-term: African technological independence." />
        </div>
        <div>
          <label className="label">Target organisations / internships</label>
          <textarea className="input min-h-[80px]" value={form.targets || ''} onChange={set('targets')}
            placeholder="CERN Short Term Internship, CNES, Airbus Defence, ESA, Polytechnique Montreal (Dr. Foundjem)..." />
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn btn-primary">
          {saved ? '✓ Saved' : '↑ Save profile'}
        </button>
      </div>
    </div>
  )
}
