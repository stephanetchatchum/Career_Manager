import { useState } from 'react'

export default function Settings({ apiKeys, onSave, onSwitchPerson, onExport, onImport, syncStatus }) {
  const [form, setForm] = useState({ ...apiKeys })
  const [saved, setSaved] = useState(false)
  const [show, setShow] = useState({})

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSave = () => {
    onSave(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const syncColor = { idle: 'text-gray-400', syncing: 'text-blue-500', synced: 'text-green-500', error: 'text-red-500' }
  const syncText = { idle: 'Not syncing', syncing: 'Syncing...', synced: 'Synced ✓', error: 'Sync failed' }

  return (
    <div className="space-y-4 max-w-xl">

      {/* SYNC */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Cross-device sync</h3>
          <span className={`text-xs font-medium ${syncColor[syncStatus]}`}>{syncText[syncStatus]}</span>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700 border border-blue-100">
          <strong>How it works:</strong> Your data syncs to a private GitHub Gist. Add your token once — open the app on any device and your data loads automatically.
        </div>
        <div>
          <label className="label">GitHub Personal Access Token</label>
          <div className="flex gap-2">
            <input
              className="input flex-1"
              type={show.gh ? 'text' : 'password'}
              value={form.githubToken || ''}
              onChange={set('githubToken')}
              placeholder="ghp_..."
            />
            <button className="btn btn-sm" onClick={() => setShow(p => ({...p, gh: !p.gh}))}>{show.gh ? 'Hide' : 'Show'}</button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Get a token at <a href="https://github.com/settings/tokens/new?scopes=gist&description=career-manager" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">github.com/settings/tokens</a> — only needs <strong>gist</strong> scope
          </p>
        </div>
        {form.gistId && (
          <div className="text-xs text-gray-400">Gist ID: {form.gistId}</div>
        )}
        <button onClick={handleSave} className="btn btn-primary">
          {saved ? '✓ Saved & syncing' : 'Save & connect'}
        </button>
      </div>

      {/* AI KEYS */}
      <div className="card space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">AI API Keys</h3>
        <p className="text-sm text-gray-500">Stored in your browser only — never sent anywhere except directly to Groq/Anthropic APIs.</p>
        <div>
          <label className="label">Groq API Key — free, for quick questions</label>
          <div className="flex gap-2">
            <input className="input flex-1" type={show.groq ? 'text' : 'password'} value={form.groq || ''} onChange={set('groq')} placeholder="gsk_..." />
            <button className="btn btn-sm" onClick={() => setShow(p => ({...p, groq: !p.groq}))}>{show.groq ? 'Hide' : 'Show'}</button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Free key at <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.groq.com</a></p>
        </div>
        <div>
          <label className="label">Claude API Key — for cover letters & deep analysis</label>
          <div className="flex gap-2">
            <input className="input flex-1" type={show.claude ? 'text' : 'password'} value={form.claude || ''} onChange={set('claude')} placeholder="sk-ant-..." />
            <button className="btn btn-sm" onClick={() => setShow(p => ({...p, claude: !p.claude}))}>{show.claude ? 'Hide' : 'Show'}</button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Key at <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.anthropic.com</a></p>
        </div>
        <button onClick={handleSave} className="btn btn-primary">{saved ? '✓ Saved' : 'Save keys'}</button>
      </div>

      {/* BACKUP */}
      <div className="card space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Manual backup</h3>
        <p className="text-sm text-gray-500">Download all your data as JSON, or import from a backup file.</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={onExport} className="btn btn-sm">⬇ Export data</button>
          <label className="btn btn-sm cursor-pointer">
            ⬆ Import data
            <input type="file" accept=".json" onChange={onImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* DANGER */}
      <div className="card space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Profile</h3>
        <p className="text-sm text-gray-500">Clear all data and start fresh as a different person.</p>
        <button onClick={onSwitchPerson} className="btn btn-sm btn-danger">⇄ Switch to new person</button>
      </div>

      {/* ABOUT */}
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
