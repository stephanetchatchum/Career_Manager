import { useState, useEffect } from 'react'
import Profile from './components/Profile'
import Opportunities from './components/Opportunities'
import Learning from './components/Learning'
import Chat from './components/Chat'
import Settings from './components/Settings'

const TABS = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'opportunities', label: 'Opportunities', icon: '🎯' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: 'chat', label: 'AI Chat', icon: '🤖' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

const defaultProfile = { name: '', email: '', role: '', education: '', skills: '', projects: '', goals: '', targets: '' }
const defaultLearning = { streak: 0, project: 1, today: { neetcode: false, khan: false, reading: false }, lastChecked: '', lastStreak: '', todaySetting: 'normal' }
const defaultKeys = { groq: '', claude: '' }

export default function App() {
  const [tab, setTab] = useState('profile')
  const [profile, setProfile] = useState(defaultProfile)
  const [opps, setOpps] = useState([])
  const [learning, setLearning] = useState(defaultLearning)
  const [apiKeys, setApiKeys] = useState(defaultKeys)
  const [chatInit, setChatInit] = useState(null)

  useEffect(() => {
    try {
      const p = localStorage.getItem('cm_profile')
      if (p) setProfile(JSON.parse(p))
      const o = localStorage.getItem('cm_opps')
      if (o) setOpps(JSON.parse(o))
      const l = localStorage.getItem('cm_learning')
      if (l) setLearning(JSON.parse(l))
      const k = localStorage.getItem('cm_keys')
      if (k) setApiKeys(JSON.parse(k))
    } catch (e) {}
  }, [])

  const saveProfile = (data) => {
    setProfile(data)
    localStorage.setItem('cm_profile', JSON.stringify(data))
  }

  const saveOpp = (opp) => {
    const next = opps.find(o => o.id === opp.id)
      ? opps.map(o => o.id === opp.id ? opp : o)
      : [...opps, opp]
    setOpps(next)
    localStorage.setItem('cm_opps', JSON.stringify(next))
  }

  const deleteOpp = (id) => {
    const next = opps.filter(o => o.id !== id)
    setOpps(next)
    localStorage.setItem('cm_opps', JSON.stringify(next))
  }

  const saveLearning = (data) => {
    setLearning(data)
    localStorage.setItem('cm_learning', JSON.stringify(data))
  }

  const saveKeys = (data) => {
    setApiKeys(data)
    localStorage.setItem('cm_keys', JSON.stringify(data))
  }

  const handleAnalyze = (opp) => {
    setChatInit(`Analyze this opportunity for me — am I a good fit, what are my chances, and what should I emphasize? ${opp.role} at ${opp.company}${opp.notes ? '. Details: ' + opp.notes : ''}`)
    setTab('chat')
  }

  const handleCoverLetter = (opp) => {
    setChatInit(`Write a tailored cover letter / application email for: ${opp.role} at ${opp.company}. ${opp.notes ? 'Role details: ' + opp.notes : ''} Make it genuine and specific — not generic.`)
    setTab('chat')
  }

  const handleAskTip = (text) => {
    setChatInit(text)
    setTab('chat')
  }

  const doneToday = Object.values(learning.today || {}).filter(Boolean).length
  const urgentOpps = opps.filter(o => {
    if (!o.deadline || o.status === 'rejected') return false
    const days = Math.round((new Date(o.deadline) - new Date()) / 86400000)
    return days >= 0 && days <= 7
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 pb-24 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">
              {profile.name ? `Hey, ${profile.name.split(' ')[0]} 👋` : 'Career Manager 🚀'}
            </h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            {urgentOpps > 0 && (
              <button onClick={() => setTab('opportunities')} className="bg-red-100 text-red-600 px-2.5 py-1 rounded-full font-medium">
                ⚠ {urgentOpps} urgent
              </button>
            )}
            {doneToday === 3 && (
              <span className="bg-green-100 text-green-600 px-2.5 py-1 rounded-full font-medium">
                ✓ Floor done
              </span>
            )}
            {doneToday < 3 && (
              <button onClick={() => setTab('learning')} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {doneToday}/3 today
              </button>
            )}
          </div>
        </div>

        <div>
          {tab === 'profile' && <Profile profile={profile} onSave={saveProfile} />}
          {tab === 'opportunities' && (
            <Opportunities
              opps={opps}
              onSave={saveOpp}
              onDelete={deleteOpp}
              onAnalyze={handleAnalyze}
              onCoverLetter={handleCoverLetter}
            />
          )}
          {tab === 'learning' && (
            <Learning
              learning={learning}
              onSave={saveLearning}
              onAskTip={handleAskTip}
            />
          )}
          {tab === 'chat' && (
            <Chat
              profile={profile}
              opps={opps}
              learning={learning}
              apiKeys={apiKeys}
              initMessage={chatInit}
              onInitDone={() => setChatInit(null)}
            />
          )}
          {tab === 'settings' && <Settings apiKeys={apiKeys} onSave={saveKeys} />}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom">
        <div className="max-w-2xl mx-auto flex">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 text-xs transition-colors ${
                tab === t.id ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              <span className="hidden sm:block">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
