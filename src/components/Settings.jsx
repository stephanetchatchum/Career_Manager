import { useState } from 'react'

export default function Settings({ apiKeys, onSave }) {
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
    <div className="space-y-4">
      <div className="card space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">API Keys</h3>
        <p className="text-sm text-gray-500">
          Keys are stored in your browser only — never sent anywhere except directly to Groq/Anthropic APIs.
          Anyone using this app needs their own keys.
        </p>

        <div className="space-y-3">
          <div>
            <label className="label">Groq API Key (free — recommended for simple tasks)</label>
            <div className="flex gap-2">
              <input
                className="input flex-1"
                type={show.groq ? 'text' : 'password'}
                value={form.groq || ''}
                onChange={set('groq')}
                placeholder="gsk_..."
              />
              <button className="btn btn-sm" onClick={() => setShow(p => ({ ...p, groq: !p.groq }))}>
                {show.groq ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Get a free key at <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.groq.com</a>
            </p>
          </div>

          <div>
            <label className="label">Claude API Key (Anthropic — for complex tasks like cover letters)</label>
            <div className="flex gap-2">
              <input
                className="input flex-1"
                type={show.claude ? 'text' : 'password'}
                value={form.claude || ''}
                onChange={set('claude')}
                placeholder="sk-ant-..."
              />
              <button className="btn btn-sm" onClick={() => setShow(p => ({ ...p, claude: !p.claude }))}>
                {show.claude ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Get a key at <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.anthropic.com</a>
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
          <strong>Routing logic:</strong> Groq handles quick questions, deadline checks, and tips (fast + free).
          Claude handles cover letters, CV tailoring, and deep analysis (smarter). If only one key is set, that one handles everything.
        </div>

        <button onClick={handleSave} className="btn btn-primary">
          {saved ? '✓ Saved' : 'Save keys'}
        </button>
      </div>

      <div className="card space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">About</h3>
        <p className="text-sm text-gray-500">Career Manager — built by Stephane Tchatchum</p>
        <p className="text-sm text-gray-500">A personal tool for tracking internship opportunities, managing daily learning streaks, and getting AI-powered career help.</p>
        <div className="flex gap-2">
          <a href="https://github.com/stephanetchatchum" target="_blank" rel="noopener noreferrer" className="btn btn-sm">GitHub ↗</a>
        </div>
      </div>
    </div>
  )
}
