import { useState, useEffect } from 'react'

const CHECKS = [
  { id: 'neetcode', label: '1 NeetCode problem', desc: 'Algorithms — read the pattern in the book if stuck', icon: '🧠' },
  { id: 'khan', label: '1 Khan Academy lesson', desc: '20 minutes minimum — math progression', icon: '📐' },
  { id: 'reading', label: '5 pages of a technical book', desc: 'Physics, Maths, or CS Book before sleep', icon: '📖' },
]

export default function Learning({ learning, onSave, onAskTip }) {
  const [data, setData] = useState(learning)

  useEffect(() => {
    // Reset checks if it's a new day
    const today = new Date().toDateString()
    if (data.lastChecked !== today) {
      const prev = data.today || {}
      const allDone = Object.values(prev).every(Boolean) && Object.keys(prev).length === 3
      let streak = data.streak || 0
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      if (!allDone && data.lastChecked && data.lastChecked !== today) {
        if (data.lastChecked === yesterday) {
          // streak stays — don't break for missed non-negotiables (handled separately)
        } else {
          streak = 0
        }
      }
      const newData = { ...data, today: { neetcode: false, khan: false, reading: false }, lastChecked: today, streak }
      setData(newData)
      onSave(newData)
    }
  }, [])

  const toggle = (id) => {
    const today = new Date().toDateString()
    const newToday = { ...data.today, [id]: !data.today[id] }
    const allDone = Object.values(newToday).every(Boolean)
    let streak = data.streak || 0
    let lastStreak = data.lastStreak
    if (allDone && data.lastStreak !== today) {
      streak = streak + 1
      lastStreak = today
    }
    const newData = { ...data, today: newToday, streak, lastStreak, lastChecked: today }
    setData(newData)
    onSave(newData)
  }

  const updateProject = (e) => {
    const n = parseInt(e.target.value)
    if (n >= 1 && n <= 300) {
      const newData = { ...data, project: n }
      setData(newData)
      onSave(newData)
    }
  }

  const doneCount = Object.values(data.today || {}).filter(Boolean).length
  const allDone = doneCount === 3
  const progress = Math.min(100, (((data.project || 1) - 1) / 300) * 100)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-semibold">{data.streak || 0}</div>
          <div className="text-xs text-gray-500 mt-0.5">Day streak</div>
        </div>
        <div className={`rounded-xl p-3 text-center ${allDone ? 'bg-green-50' : 'bg-gray-50'}`}>
          <div className={`text-2xl font-semibold ${allDone ? 'text-green-600' : ''}`}>{doneCount}/3</div>
          <div className={`text-xs mt-0.5 ${allDone ? 'text-green-500' : 'text-gray-500'}`}>Today</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-semibold">#{data.project || 1}</div>
          <div className="text-xs text-gray-500 mt-0.5">of 300</div>
        </div>
      </div>

      {allDone && (
        <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg border border-green-200">
          <span>🎯</span>
          <span>Floor complete — you won today. Streak: {data.streak} days</span>
        </div>
      )}

      <div className="card space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Daily non-negotiables</h3>
        {CHECKS.map(c => {
          const done = data.today?.[c.id] || false
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                done ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                done ? 'bg-gray-900 border-gray-900' : 'border-gray-300'
              }`}>
                {done && <span className="text-white text-xs">✓</span>}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${done ? 'line-through text-gray-400' : ''}`}>{c.icon} {c.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
              </div>
            </button>
          )
        })}
      </div>

      <div className="card space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">300-curriculum progress</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Current project:</span>
          <input
            type="number"
            min="1"
            max="300"
            value={data.project || 1}
            onChange={updateProject}
            className="input w-20 text-center"
          />
          <span className="text-sm text-gray-400">of 300</span>
        </div>
        <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gray-900 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress.toFixed(1)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>{data.project || 1} done</span>
          <span>{300 - (data.project || 1)} remaining</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">AI learning assistant</h3>
        <div className="flex flex-wrap gap-2">
          {[
            'What should I focus on this evening based on my progress?',
            'Give me a NeetCode tip for today',
            'Am I on pace to finish 300 projects in a year?',
          ].map(q => (
            <button key={q} onClick={() => onAskTip(q)} className="btn btn-sm text-left">
              {q} ↗
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Weekly settings</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 shrink-0">Today's setting:</span>
          <select
            className="input"
            value={data.todaySetting || 'normal'}
            onChange={(e) => {
              const newData = { ...data, todaySetting: e.target.value }
              setData(newData)
              onSave(newData)
            }}
          >
            <option value="minimum">Minimum (~45 min) — heavy day</option>
            <option value="normal">Normal (~2 hours) — default</option>
            <option value="strong">Strong (~3 hours+) — good energy</option>
          </select>
        </div>
      </div>
    </div>
  )
}
