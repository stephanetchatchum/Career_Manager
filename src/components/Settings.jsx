import { useState } from 'react'
import { encodeSyncData, getQRCodeUrl } from '../utils/sync'

export default function Settings({ apiKeys, onSave, onSwitchPerson, onExport, onImport, profile, opps, learning, programme }) {
  const [form, setForm] = useState({ ...apiKeys })
  const [saved, setSaved] = useState(false)
  const [show, setShow] = useState({})
  const [qrVisible, setQrVisible] = useState(false)
  const [qrUrl, setQrUrl] = useState('')

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSaveKeys = () => {
    onSave(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleShowQR = () => {
    const syncData = encodeSyncData(profile, opps, learning, programme)
    setQrUrl(getQRCodeUrl(syncData))
    setQrVisible(true)
  }

  return (
    <div className="space-y-4 max-w-xl">

      {/* QR SYNC */}
      <div className="card space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Cross-device sync</h3>

        <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-3 text-sm text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
          <p className="font-semibold mb-1">How it works:</p>
          <ol className="list-decimal pl-4 space-y-1 text-xs">
            <li>Click <strong>Show sync QR</strong> below</li>
            <li>Scan the QR code with your phone camera</li>
            <li>The app opens on your phone with all your data loaded</li>
            <li>Done — no accounts, no tokens needed</li>
          </ol>
          <p className="text-xs mt-2 opacity-70">Note: your document context is not included in the QR sync (it's pre-loaded). Everything else syncs — opportunities, learning, programme, profile.</p>
        </div>

        <button onClick={handleShowQR} className="btn btn-primary w-full justify-center">
          📱 Show sync QR code
        </button>

        {qrVisible && (
          <div className="text-center space-y-3">
            <div className="inline-block bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
              <img src={qrUrl} alt="Sync QR code" width={260} height={260} className="block" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Scan this with your phone camera to load your data</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  const syncData = encodeSyncData(profile, opps, learning, programme)
                  const url = `${window.location.origin}${window.location.pathname}?sync=${encodeURIComponent(syncData)}`
                  navigator.clipboard.writeText(url).then(() => alert('Link copied — paste it in your phone browser'))
                }}
                className="btn btn-sm"
              >
                📋 Copy link instead
              </button>
              <button onClick={() => setQrVisible(false)} className="btn btn-sm">Close</button>
            </div>
          </div>
        )}
      </div>

      {/* AI KEYS */}
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

        <button onClick={handleSaveKeys} className="btn btn-primary">{saved ? '✓ Saved' : 'Save keys'}</button>
      </div>

      {/* BACKUP */}
      <div className="card space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Manual backup</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Download all data as JSON, or restore from a backup file.</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={onExport} className="btn btn-sm">⬇ Export data</button>
          <label className="btn btn-sm cursor-pointer">
            ⬆ Import data
            <input type="file" accept=".json" onChange={onImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* RESET */}
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
