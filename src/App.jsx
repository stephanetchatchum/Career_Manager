import { useState, useEffect } from 'react'
import Profile from './components/Profile'
import Opportunities from './components/Opportunities'
import Learning from './components/Learning'
import Chat from './components/Chat'
import Settings from './components/Settings'

const STEPHANE = {
  name: 'Tchatchum Chassem Stephane',
  email: 'stephanetchatchum@gmail.com',
  role: 'Software Engineer Intern at Irembo (April–July 2026)',
  education: 'BSc Software Engineering, African Leadership University, Kigali (Year 1)',
  skills: 'Python, Django, Flask, Git, Linux, Groq API, SQL, C#, HTML/CSS — learning: React, JavaScript, C++',
  projects: 'TalentScreen — AI resume screener used by Irembo HR — talentscreen-gpvs.onrender.com\nAfriLang — African language learning platform — afrilang.onrender.com\nIkimApp — Ikimina savings group CLI (Python, MySQL)\nSave Wakanda — Unity game (Global Game Jam 2026)',
  goals: 'Science/space internship by September 2026. Master\'s in ML or space engineering by 2028. Long-term: African technological independence — software first, then hardware and space systems.',
  targets: 'CERN Short Term Internship (paid, open year-round), CNES France, Airbus Defence & Space, ESA, Polytechnique Montréal (Dr. Foundjem), Thales Alenia Space',
}

const DEFAULT_LEARNING = {
  streak: 0, project: 13,
  today: { neetcode: false, khan: false, reading: false },
  lastChecked: '', lastStreak: '', todaySetting: 'normal'
}

const TABS = [
  { id: 'opportunities', label: 'Opportunities', icon: '🎯' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: 'chat', label: 'AI Chat', icon: '🤖' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function App() {
  const [tab, setTab] = useState('opportunities')
  const [profile, setProfile] = useState(STEPHANE)
  const [opps, setOpps] = useState([])
  const [learning, setLearning] = useState(DEFAULT_LEARNING)
  const [apiKeys, setApiKeys] = useState({ groq: '', claude: '' })
  const [chatInit, setChatInit] = useState(null)
  const [isDefaultUser, setIsDefaultUser] = useState(true)

  useEffect(() => {
    try {
      const p = localStorage.getItem('cm_profile')
      if (p) { setProfile(JSON.parse(p)); setIsDefaultUser(false) }
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
    setIsDefaultUser(false)
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

  const switchToNewPerson = () => {
    if (!confirm('Start fresh with a blank profile? Your current data will be cleared.')) return
    localStorage.clear()
    setProfile({ name: '', email: '', role: '', education: '', skills: '', projects: '', goals: '', targets: '' })
    setOpps([])
    setLearning(DEFAULT_LEARNING)
    setApiKeys({ groq: '', claude: '' })
    setIsDefaultUser(false)
    setTab('profile')
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

  const renderContent = () => {
    switch (tab) {
      case 'profile': return <Profile profile={profile} onSave={saveProfile} />
      case 'opportunities': return <Opportunities opps={opps} onSave={saveOpp} onDelete={deleteOpp} onAnalyze={handleAnalyze} onCoverLetter={handleCoverLetter} />
      case 'learning': return <Learning learning={learning} onSave={saveLearning} onAskTip={handleAskTip} />
      case 'chat': return <Chat profile={profile} opps={opps} learning={learning} apiKeys={apiKeys} initMessage={chatInit} onInitDone={() => setChatInit(null)} />
      case 'settings': return <Settings apiKeys={apiKeys} onSave={saveKeys} onSwitchPerson={switchToNewPerson} />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen fixed left-0 top-0 bottom-0 p-5">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🚀</span>
            <span className="font-semibold text-gray-900 text-lg">Career Manager</span>
          </div>
          <p className="text-xs text-gray-400 pl-9">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
        </div>

        {/* User card */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-semibold text-sm mb-2">
            {profile.name ? profile.name.split(' ').map(w => w[0]).slice(0,2).join('') : '?'}
          </div>
          <p className="font-medium text-sm text-gray-900 leading-tight">{profile.name || 'Set your name'}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-tight">{profile.role ? profile.role.split(' ').slice(0,4).join(' ')+'...' : 'Add your role'}</p>
          <button
            onClick={switchToNewPerson}
            className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
          >
            <span>⇄</span> New person
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`nav-item relative ${tab === t.id ? 'active' : ''}`}
            >
              <span className="text-lg">{t.icon}</span>
              <span>{t.label}</span>
              {t.id === 'opportunities' && urgentOpps > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{urgentOpps}</span>
              )}
              {t.id === 'learning' && doneToday < 3 && (
                <span className="ml-auto text-xs text-gray-400">{doneToday}/3</span>
              )}
              {t.id === 'learning' && doneToday === 3 && (
                <span className="ml-auto text-green-500 text-xs">✓</span>
              )}
            </button>
          ))}
        </nav>

        {/* Streak at bottom */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>🔥 Streak</span>
            <span className="font-semibold text-gray-900">{learning.streak || 0} days</span>
          </div>
          <div className="mt-2 text-xs text-gray-400">Project #{learning.project || 1} / 300</div>
          <div className="mt-1.5 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gray-900 h-full rounded-full" style={{ width: `${Math.min(100, ((learning.project || 1) / 300) * 100).toFixed(1)}%` }} />
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
        {/* Desktop topbar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {TABS.find(t => t.id === tab)?.icon} {TABS.find(t => t.id === tab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {urgentOpps > 0 && (
              <button onClick={() => setTab('opportunities')} className="flex items-center gap-1.5 bg-red-50 text-red-600 text-sm px-3 py-1.5 rounded-xl border border-red-200">
                ⚠ {urgentOpps} deadline{urgentOpps > 1 ? 's' : ''} soon
              </button>
            )}
            {doneToday === 3 && (
              <span className="flex items-center gap-1.5 bg-green-50 text-green-600 text-sm px-3 py-1.5 rounded-xl border border-green-200">
                ✓ Floor done
              </span>
            )}
            <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
              {apiKeys.claude ? '⚡ Claude + ' : ''}{apiKeys.groq ? '⚡ Groq' : !apiKeys.claude ? '⚠ Add API key' : ''}
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 pt-6 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚀</span>
              <span className="font-semibold text-lg">
                {profile.name ? `Hey, ${profile.name.split(' ')[0]}` : 'Career Manager'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 pl-8">{new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
          </div>
          <div className="flex gap-2">
            {urgentOpps > 0 && (
              <button onClick={() => setTab('opportunities')} className="bg-red-100 text-red-600 text-xs px-2.5 py-1.5 rounded-xl font-medium">
                ⚠ {urgentOpps}
              </button>
            )}
            <button onClick={switchToNewPerson} className="bg-gray-100 text-gray-500 text-xs px-2.5 py-1.5 rounded-xl">
              ⇄ Switch
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="px-4 lg:px-8 py-4 lg:py-6 max-w-3xl lg:max-w-none">
          {renderContent()}
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors relative ${
              tab === t.id ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <span className={`text-xl ${tab === t.id ? 'scale-110' : ''} transition-transform`}>{t.icon}</span>
            <span className="text-[10px] font-medium">{t.label}</span>
            {t.id === 'opportunities' && urgentOpps > 0 && (
              <span className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
