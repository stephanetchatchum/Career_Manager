import { useState } from 'react'

export default function Settings({ apiKeys, onSave, onSwitchPerson, onExport, onImport, syncStatus, syncError }) {
  const [form, setForm] = useState({ ...apiKeys })
  const [saved, setSaved] = useState(false)
  const [show, setShow] = useState({})
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))
  const handleSave = () => { onSave(form); setSaved(true); setTimeout(() => setSaved(false), 2500) }
  const syncColor = { idle:'text-gray-400', syncing:'text-blue-500', synced:'text-green-500', error:'text-red-500' }
  const syncText = { idle:'', syncing:'↻ Syncing...', synced:'✓ Synced', error:'✗ Sync failed' }

  return (
    <div className="space-y-4 max-w-xl">
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Cross-device sync</h3>
          {syncText[syncStatus] && <span className={`text-xs font-medium ${syncColor[syncStatus]}`}>{syncText[syncStatus]}</span>}
        </div>
        {syncStatus === 'error' && syncError && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-700 dark:text-red-400">
            <strong>Error:</strong> {syncError}
          </div>
        )}
        <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-3 text-sm text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900 space-y-1">
          <p className="font-semibold">Setup — 2 minutes, one time:</p>
          <ol className="list-decimal pl-4 space-y-1 text-xs">
            <li>Go to <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" className="underline font-medium">github.com/settings/tokens/new</a></li>
            <li>Select <strong>classic token</strong> (not fine-grained)</li>
            <li>Name: "career-manager" — Expiration: No expiration</li>
            <li>Check only the <strong>gist</strong> checkbox</li>
            <li>Click Generate token — copy it immediately</li>
            <li>Paste below and click Save &amp; connect</li>
          </ol>
          <p className="text-xs pt-1">On any new device: add the same token in Settings — your data loads automatically.</p>
        </div>
        <div>
          <label className="label">GitHub Personal Access Token (classic only)</label>
          <div className="flex gap-2">
            <input className="input flex-1" type={show.gh ? 'text' : 'password'} value={form.githubToken || ''} onChange={set('githubToken')} placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" />
            <button className="btn btn-sm" onClick={() => setShow(p => ({...p, gh: !p.gh}))}>{show.gh ? 'Hide' : 'Show'}</button>
          </div>
          {form.gistId && <p className="text-xs text-green-500 mt-1">✓ Connected — Gist ID: {form.gistId.slice(0,12)}...</p>}
        </div>
        <div>
          <label className="label">Gist ID (optional — paste from another device to connect)</label>
          <input className="input" value={form.gistId || ''} onChange={set('gistId')} placeholder="Leave empty to auto-detect" />
          <p className="text-xs text-gray-400 mt-1">If auto-detect fails, copy the Gist ID from your other device and paste it here</p>
        </div>
        <button onClick={handleSave} className="btn btn-primary">{saved ? '✓ Saved & connecting' : 'Save & connect'}</button>
      </div>

      <div className="card space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">AI API Keys</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Stored locally only — sent directly to Groq/Anthropic, nowhere else.</p>
        <div>
          <label className="label">Groq API Key — free, quick questions</label>
          <div className="flex gap-2">
            <input className="input flex-1" type={show.groq ? 'text' : 'password'} value={form.groq || ''} onChange={set('groq')} placeholder="gsk_..." />
            <button className="btn btn-sm" onClick={() => setShow(p => ({...p, groq: !p.groq}))}>{show.groq ? 'Hide' : 'Show'}</button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Free at <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.groq.com</a></p>
        </div>
        <div>
          <label className="label">Claude API Key — cover letters & deep analysis</label>
          <div className="flex gap-2">
            <input className="input flex-1" type={show.claude ? 'text' : 'password'} value={form.claude || ''} onChange={set('claude')} placeholder="sk-ant-..." />
            <button className="btn btn-sm" onClick={() => setShow(p => ({...p, claude: !p.claude}))}>{show.claude ? 'Hide' : 'Show'}</button>
          </div>
          <p className="text-xs text-gray-400 mt-1">At <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.anthropic.com</a></p>
        </div>
        <button onClick={handleSave} className="btn btn-primary">{saved ? '✓ Saved' : 'Save keys'}</button>
      </div>

      <div className="card space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Manual backup</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Download all data as JSON, or restore from a backup file.</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={onExport} className="btn btn-sm">⬇ Export data</button>
          <label className="btn btn-sm cursor-pointer">⬆ Import data<input type="file" accept=".json" onChange={onImport} className="hidden" /></label>
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Reset</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Clear all data and start fresh as a different person.</p>
        <button onClick={onSwitchPerson} className="btn btn-sm btn-danger">⇄ Switch to new person</button>
      </div>

      <div className="card space-y-2">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">About</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Career Manager — built by Stephane Tchatchum</p>
        <div className="flex gap-2 pt-1">
          <a href="https://github.com/stephanetchatchum" target="_blank" rel="noopener noreferrer" className="btn btn-sm">GitHub ↗</a>
          <a href="https://talentscreen-gpvs.onrender.com" target="_blank" rel="noopener noreferrer" className="btn btn-sm">TalentScreen ↗</a>
        </div>
      </div>
    </div>
  )
}
