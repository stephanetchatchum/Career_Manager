import { useState } from 'react'

export default function Settings({ apiKeys, onSave, onSwitchPerson }) {
  const [form, setForm] = useState({ ...apiKeys })
  const [saved, setSaved] = useState(false)
  const [show, setShow] = useState({ groq: false, claude: false })

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSave = () => {
    onSave(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <div className="card space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">API Keys</h3>
        <p className="text-sm text-gray-500">Stored in your browser only — never sent anywhere except directly to Groq/Anthropic. Each person using this app needs their own keys.</p>
        <div className="space-y-4">
          <div>
            <label className="label">Groq API Key (free — quick tasks)</label>
            <div className="flex gap-2">
              <input className="input flex-1" type={show.groq ? 'text' : 'password'} value={form.groq || ''} onChange={set('groq')} placeholder="gsk_..." />
              <button className="btn btn-sm" onClick={() => setShow(p => ({ ...p, groq: !p.groq }))}>{show.groq ? 'Hide' : 'Show'}</button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Get free key at <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.groq.com</a></p>
          </div>
          <div>
            <label className="label">Claude API Key (Anthropic — cover letters, deep analysis)</label>
            <div className="flex gap-2">
              <input className="input flex-1" type={show.claude ? 'text' : 'password'} value={form.claude || ''} onChange={set('claude')} placeholder="sk-ant-..." />
              <button className="btn btn-sm" onClick={() => setShow(p => ({ ...p, claude: !p.claude }))}>{show.claude ? 'Hide' : 'Show'}</button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Get key at <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.anthropic.com</a></p>
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700 border border-blue-100">
          <strong>AI routing:</strong> Groq handles quick questions and tips (fast + free). Claude handles cover letters, CV tailoring, and deep opportunity analysis (smarter). If only one key is set, that one handles everything.
        </div>
        <button onClick={handleSave} className="btn btn-primary">{saved ? '✓ Saved' : 'Save keys'}</button>
      </div>

      <div className="card space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Profile</h3>
        <p className="text-sm text-gray-500">Want to use this as a different person? Clear all data and start with a blank profile.</p>
        <button onClick={onSwitchPerson} className="btn btn-danger btn-sm">⇄ Switch to new person</button>
      </div>

      <div className="card space-y-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">About</h3>
        <p className="text-sm text-gray-500">Career Manager — built by Stephane Tchatchum</p>
        <div className="flex gap-2 pt-1">
          <a href="https://github.com/stephanetchatchum" target="_blank" rel="noopener noreferrer" className="btn btn-sm">GitHub ↗</a>
          <a href="https://talentscreen-gpvs.onrender.com" target="_blank" rel="noopener noreferrer" className="btn btn-sm">TalentScreen ↗</a>
        </div>
      </div>
    </div>
  )
}
