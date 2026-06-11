import { useState, useEffect, useCallback } from 'react'
import Profile from './components/Profile'
import Opportunities from './components/Opportunities'
import Learning from './components/Learning'
import Chat from './components/Chat'
import Settings from './components/Settings'
import Programme from './components/Programme'
import { saveToGist, loadFromGist, findExistingGist, exportData, importData } from './utils/sync'

const STEPHANE = {
  name: 'Tchatchum Chassem Stephane',
  email: 'stephanetchatchum@gmail.com',
  role: 'Software Engineer Intern at Irembo (April–July 2026)',
  education: 'BSc Software Engineering, African Leadership University, Kigali (Year 1)',
  skills: 'Python, Django, Flask, Git, Linux, Groq API, SQL, C#, HTML/CSS — learning: React, JavaScript, C++',
  projects: 'TalentScreen — AI resume screener used by Irembo HR — talentscreen-gpvs.onrender.com\nAfriLang — African language learning platform — afrilang.onrender.com\nIkimApp — Ikimina savings group CLI (Python, MySQL)\nSave Wakanda — Unity game (Global Game Jam 2026)',
  goals: "Science/space internship by September 2026. Master's in ML or space engineering by 2028. Long-term: African technological independence — software first, then hardware and space systems.",
  targets: 'CERN Short Term Internship (paid, open year-round), CERN Technical Student Programme (deadline June 30), CNES France, Airbus Defence & Space, ESA, Polytechnique Montréal (Dr. Foundjem), Thales Alenia Space',
  docContext: `--- THE STEPHANE PROGRAMME V3 (3-YEAR ROADMAP) ---
Year 1 (2025-2026) — Foundation:
- Irembo internship (April–July 2026): built TalentScreen AI resume screener (Django, Groq API, deployed)
- August 2026 sprint: deploy AfriSpace, build Exoplanet Detection Tool (NASA Kepler data, ML), build Satellite Orbit Predictor (TLE data, physics)
- Apply to CERN (urgent), CNES, Airbus, ESA by end of June 2026
- Daily: 1 NeetCode, 1 Khan Academy lesson, 5 pages technical book
- Khan Academy sequence: Algebra → Trig → Precalc → Calc → Linear Algebra
- 300-project curriculum (on project 13)

Year 2 (2026-2027) — Depth:
- New skills: C/C++, PyTorch, Docker, Linear Algebra, Differential Equations
- Projects: African Language NLP Tool, Earth Observation Dashboard, Physics Simulation, Arduino hardware project
- Fellowships: African Union Digital Fellowship, Google DeepMind Africa
- NASA Space Apps Challenge October 2026
- Launch ALU Science Club

Year 3 (2027-2028) — Convergence:
- Choose specialisation: Space Systems / AI for Science / Scientific Computing / Hardware
- Build African-focused capstone project (real data, published, open source)
- Master's applications: Polytechnique Montréal, AIMS, UCT, KTH, TU Delft

Non-negotiables every day:
1. 1 NeetCode problem (algorithms)
2. 1 Khan Academy lesson (math, 20 min minimum)
3. 5 pages of a technical book (Physics, Maths, or CS Book)

--- INTERNSHIP STRATEGY ---
Tier 1 (apply now):
- CERN Short Term Internship: paid 1587 CHF/month, open year-round, undergrads OK, no country restriction
- CERN Technical Student Programme: paid 3486 CHF/month, deadline June 30 2026
- Polytechnique Montréal (Dr. Foundjem): email this week
- CNES: cnes.fr/fr/carrieres — apply June 2026
- Airbus Defence & Space: airbus.com/en/careers — apply June 2026
- ESA: apply June 2026

Tier 2 (African hubs): Andela, Flutterwave, Kenya Space, Ghana tech
Tier 3 (stretch): Planet Labs, ICEYE, Rocket Lab`
}

const DEFAULT_LEARNING = {
  streak: 0, project: 13,
  today: { neetcode: false, khan: false, reading: false },
  lastChecked: '', lastStreak: '', todaySetting: 'normal'
}

const TABS = [
  { id: 'opportunities', label: 'Opportunities', icon: '🎯' },
  { id: 'programme', label: 'Programme', icon: '🗺' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: 'chat', label: 'AI Chat', icon: '🤖' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

function getAllData(profile, opps, learning, programme, apiKeys) {
  return { profile, opps, learning, programme, apiKeys, version: 1 }
}

export default function App() {
  const [tab, setTab] = useState('opportunities')
  const [profile, setProfile] = useState(STEPHANE)
  const [opps, setOpps] = useState([])
  const [learning, setLearning] = useState(DEFAULT_LEARNING)
  const [programme, setProgramme] = useState({})
  const [apiKeys, setApiKeys] = useState({ groq: '', claude: '', githubToken: '', gistId: '' })
  const [chatInit, setChatInit] = useState(null)
  const [syncStatus, setSyncStatus] = useState('idle')

  useEffect(() => {
    try {
      const p = localStorage.getItem('cm_profile')
      if (p) setProfile(JSON.parse(p))
      const o = localStorage.getItem('cm_opps')
      if (o) setOpps(JSON.parse(o))
      const l = localStorage.getItem('cm_learning')
      if (l) setLearning(JSON.parse(l))
      const pg = localStorage.getItem('cm_programme')
      if (pg) setProgramme(JSON.parse(pg))
      const k = localStorage.getItem('cm_keys')
      if (k) {
        const keys = JSON.parse(k)
        setApiKeys(keys)
        if (keys.githubToken && keys.gistId) {
          autoLoadFromGist(keys.githubToken, keys.gistId)
        }
      }
    } catch (e) {}
  }, [])

  const autoLoadFromGist = async (token, gistId) => {
    try {
      setSyncStatus('syncing')
      const data = await loadFromGist(token, gistId)
      if (data.profile) { setProfile(data.profile); localStorage.setItem('cm_profile', JSON.stringify(data.profile)) }
      if (data.opps) { setOpps(data.opps); localStorage.setItem('cm_opps', JSON.stringify(data.opps)) }
      if (data.learning) { setLearning(data.learning); localStorage.setItem('cm_learning', JSON.stringify(data.learning)) }
      if (data.programme) { setProgramme(data.programme); localStorage.setItem('cm_programme', JSON.stringify(data.programme)) }
      setSyncStatus('synced')
      setTimeout(() => setSyncStatus('idle'), 3000)
    } catch (e) {
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }

  const syncToGist = useCallback(async (data) => {
    if (!apiKeys.githubToken) return
    try {
      setSyncStatus('syncing')
      const gistId = await saveToGist(data, apiKeys.githubToken, apiKeys.gistId || null)
      if (!apiKeys.gistId) {
        const newKeys = { ...apiKeys, gistId }
        setApiKeys(newKeys)
        localStorage.setItem('cm_keys', JSON.stringify(newKeys))
      }
      setSyncStatus('synced')
      setTimeout(() => setSyncStatus('idle'), 2000)
    } catch (e) {
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }, [apiKeys])

  const saveAndSync = useCallback((newProfile, newOpps, newLearning, newProgramme) => {
    const data = getAllData(newProfile, newOpps, newLearning, newProgramme, apiKeys)
    syncToGist(data)
  }, [apiKeys, syncToGist])

  const saveProfile = (data) => {
    setProfile(data)
    localStorage.setItem('cm_profile', JSON.stringify(data))
    saveAndSync(data, opps, learning, programme)
  }

  const saveOpp = (opp) => {
    const next = opps.find(o => o.id === opp.id)
      ? opps.map(o => o.id === opp.id ? opp : o)
      : [...opps, opp]
    setOpps(next)
    localStorage.setItem('cm_opps', JSON.stringify(next))
    saveAndSync(profile, next, learning, programme)
  }

  const deleteOpp = (id) => {
    const next = opps.filter(o => o.id !== id)
    setOpps(next)
    localStorage.setItem('cm_opps', JSON.stringify(next))
    saveAndSync(profile, next, learning, programme)
  }

  const saveLearning = (data) => {
    setLearning(data)
    localStorage.setItem('cm_learning', JSON.stringify(data))
    saveAndSync(profile, opps, data, programme)
  }

  const saveProgramme = (data) => {
    setProgramme(data)
    localStorage.setItem('cm_programme', JSON.stringify(data))
    saveAndSync(profile, opps, learning, data)
  }

  const saveKeys = async (data) => {
    setApiKeys(data)
    localStorage.setItem('cm_keys', JSON.stringify(data))
    if (data.githubToken && !data.gistId) {
      try {
        setSyncStatus('syncing')
        const existingId = await findExistingGist(data.githubToken)
        if (existingId) {
          const newKeys = { ...data, gistId: existingId }
          setApiKeys(newKeys)
          localStorage.setItem('cm_keys', JSON.stringify(newKeys))
          await autoLoadFromGist(data.githubToken, existingId)
        } else {
          const allData = getAllData(profile, opps, learning, programme, data)
          const gistId = await saveToGist(allData, data.githubToken, null)
          const newKeys = { ...data, gistId }
          setApiKeys(newKeys)
          localStorage.setItem('cm_keys', JSON.stringify(newKeys))
          setSyncStatus('synced')
          setTimeout(() => setSyncStatus('idle'), 2000)
        }
      } catch (e) {
        setSyncStatus('error')
        setTimeout(() => setSyncStatus('idle'), 3000)
      }
    }
  }

  const handleExport = () => exportData(getAllData(profile, opps, learning, programme, {}))

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const data = await importData(file)
      if (data.profile) { setProfile(data.profile); localStorage.setItem('cm_profile', JSON.stringify(data.profile)) }
      if (data.opps) { setOpps(data.opps); localStorage.setItem('cm_opps', JSON.stringify(data.opps)) }
      if (data.learning) { setLearning(data.learning); localStorage.setItem('cm_learning', JSON.stringify(data.learning)) }
      if (data.programme) { setProgramme(data.programme); localStorage.setItem('cm_programme', JSON.stringify(data.programme)) }
      alert('Data imported successfully!')
    } catch (e) {
      alert('Import failed: ' + e.message)
    }
  }

  const switchToNewPerson = () => {
    if (!confirm('Start fresh with a blank profile? This clears all local data.')) return
    localStorage.clear()
    setProfile({ name: '', email: '', role: '', education: '', skills: '', projects: '', goals: '', targets: '', docContext: '' })
    setOpps([])
    setLearning(DEFAULT_LEARNING)
    setProgramme({})
    setApiKeys({ groq: '', claude: '', githubToken: '', gistId: '' })
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

  const handleAskTip = (text) => { setChatInit(text); setTab('chat') }

  const doneToday = Object.values(learning.today || {}).filter(Boolean).length
  const urgentOpps = opps.filter(o => {
    if (!o.deadline || o.status === 'rejected') return false
    const days = Math.round((new Date(o.deadline) - new Date()) / 86400000)
    return days >= 0 && days <= 7
  }).length

  const syncIndicator = {
    idle: null,
    syncing: { text: '↻ Syncing', color: 'text-blue-500' },
    synced: { text: '✓ Synced', color: 'text-green-500' },
    error: { text: '✗ Sync failed', color: 'text-red-500' },
  }[syncStatus]

  const renderContent = () => {
    switch (tab) {
      case 'profile': return <Profile profile={profile} onSave={saveProfile} />
      case 'opportunities': return <Opportunities opps={opps} onSave={saveOpp} onDelete={deleteOpp} onAnalyze={handleAnalyze} onCoverLetter={handleCoverLetter} />
      case 'learning': return <Learning learning={learning} onSave={saveLearning} onAskTip={handleAskTip} />
      case 'programme': return <Programme progress={programme} onSave={saveProgramme} />
      case 'chat': return <Chat profile={profile} opps={opps} learning={learning} programme={programme} apiKeys={apiKeys} initMessage={chatInit} onInitDone={() => setChatInit(null)} />
      case 'settings': return (
        <Settings
          apiKeys={apiKeys}
          onSave={saveKeys}
          onSwitchPerson={switchToNewPerson}
          onExport={handleExport}
          onImport={handleImport}
          syncStatus={syncStatus}
        />
      )
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen fixed left-0 top-0 bottom-0 p-5">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🚀</span>
            <span className="font-semibold text-gray-900 text-lg">Career Manager</span>
          </div>
          <p className="text-xs text-gray-400 pl-9">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-semibold text-sm mb-2">
            {profile.name ? profile.name.split(' ').map(w => w[0]).slice(0,2).join('') : '?'}
          </div>
          <p className="font-medium text-sm text-gray-900 leading-tight">{profile.name || 'Set your name'}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-tight truncate">{profile.role || 'Add your role'}</p>
          <div className="flex items-center justify-between mt-3">
            <button onClick={switchToNewPerson} className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
              ⇄ New person
            </button>
            {syncIndicator && <span className={`text-xs ${syncIndicator.color}`}>{syncIndicator.text}</span>}
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`nav-item relative ${tab === t.id ? 'active' : ''}`}>
              <span className="text-lg">{t.icon}</span>
              <span>{t.label}</span>
              {t.id === 'opportunities' && urgentOpps > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{urgentOpps}</span>
              )}
              {t.id === 'learning' && (
                <span className={`ml-auto text-xs ${doneToday === 3 ? 'text-green-500' : 'text-gray-400'}`}>
                  {doneToday === 3 ? '✓' : `${doneToday}/3`}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>🔥 Streak</span>
            <span className="font-semibold text-gray-900">{learning.streak || 0} days</span>
          </div>
          <div className="text-xs text-gray-400">Project #{learning.project || 1} / 300</div>
          <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gray-900 h-full rounded-full" style={{ width: `${Math.min(100, ((learning.project || 1) / 300) * 100).toFixed(1)}%` }} />
          </div>
          {!apiKeys.githubToken && (
            <button onClick={() => setTab('settings')} className="w-full text-xs text-orange-500 bg-orange-50 rounded-lg px-2 py-1.5 mt-1 hover:bg-orange-100 transition-colors">
              ⚠ Enable cross-device sync
            </button>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
        <div className="hidden lg:flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900">
            {TABS.find(t => t.id === tab)?.icon} {TABS.find(t => t.id === tab)?.label}
          </h1>
          <div className="flex items-center gap-3">
            {syncIndicator && <span className={`text-sm ${syncIndicator.color}`}>{syncIndicator.text}</span>}
            {urgentOpps > 0 && (
              <button onClick={() => setTab('opportunities')} className="flex items-center gap-1.5 bg-red-50 text-red-600 text-sm px-3 py-1.5 rounded-xl border border-red-200">
                ⚠ {urgentOpps} deadline{urgentOpps > 1 ? 's' : ''} soon
              </button>
            )}
            {doneToday === 3 && (
              <span className="flex items-center gap-1.5 bg-green-50 text-green-600 text-sm px-3 py-1.5 rounded-xl border border-green-200">✓ Floor done</span>
            )}
          </div>
        </div>

        {/* MOBILE HEADER */}
        <div className="lg:hidden flex items-center justify-between px-4 pt-6 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚀</span>
              <span className="font-semibold text-lg">{profile.name ? `Hey, ${profile.name.split(' ')[0]}` : 'Career Manager'}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 pl-8">{new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
          </div>
          <div className="flex gap-2">
            {syncIndicator && <span className={`text-xs ${syncIndicator.color}`}>{syncIndicator.text}</span>}
            {urgentOpps > 0 && (
              <button onClick={() => setTab('opportunities')} className="bg-red-100 text-red-600 text-xs px-2.5 py-1.5 rounded-xl font-medium">⚠ {urgentOpps}</button>
            )}
          </div>
        </div>

        <div className="px-4 lg:px-8 py-4 lg:py-6">
          {renderContent()}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors relative ${tab === t.id ? 'text-gray-900' : 'text-gray-400'}`}>
            <span className={`text-xl ${tab === t.id ? 'scale-110' : ''} transition-transform`}>{t.icon}</span>
            <span className="text-[9px] font-medium">{t.label}</span>
            {t.id === 'opportunities' && urgentOpps > 0 && (
              <span className="absolute top-1.5 right-1/4 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
