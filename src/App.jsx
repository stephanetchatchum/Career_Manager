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
  goals: "Science/space internship by September 2026. Master's in ML or space engineering by 2028. Long-term: African technological independence.",
  targets: 'CERN Short Term Internship (paid, open year-round), CERN Technical Student Programme (deadline June 30), CNES France, Airbus Defence & Space, ESA, Polytechnique Montréal (Dr. Foundjem)',
  docContext: `--- THE STEPHANE PROGRAMME V3 ---
Year 1 (2025-2026): Irembo internship (built TalentScreen AI tool, deployed). August 2026: deploy AfriSpace, build Exoplanet Detector (NASA Kepler ML), build Satellite Orbit Predictor.
Year 2 (2026-2027): C/C++, PyTorch, Docker, Linear Algebra. Projects: African Language NLP, Earth Observation Dashboard, hardware. NASA Space Apps October 2026. Launch ALU Science Club.
Year 3 (2027-2028): Choose specialisation. Build African capstone project. Apply to Master's: Polytechnique Montréal, AIMS, UCT, KTH, TU Delft.
Non-negotiables: 1 NeetCode/day, 1 Khan Academy/day, 5 pages technical book/night.
--- INTERNSHIP STRATEGY ---
Tier 1 (urgent June 2026): CERN Short Term (1587 CHF/month, open year-round), CERN Technical Student (3486 CHF/month, deadline June 30), Polytechnique Montréal email Dr. Foundjem, CNES, Airbus, ESA.`
}

const DEFAULT_LEARNING = {
  streak: 0, project: 13,
  today: { neetcode: false, khan: false, reading: false },
  lastChecked: '', lastStreak: '', todaySetting: 'normal'
}

const MAIN_TABS = [
  { id: 'opportunities', label: 'Opportunities', icon: '🎯' },
  { id: 'programme', label: 'Programme', icon: '🗺' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: 'chat', label: 'AI Chat', icon: '🤖' },
]

const BOTTOM_TABS = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

const ALL_TABS = [...MAIN_TABS, ...BOTTOM_TABS]

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
  const [syncError, setSyncError] = useState('')
  const [dark, setDark] = useState(false)

  // Dark mode
  useEffect(() => {
    const saved = localStorage.getItem('cm_dark')
    if (saved === 'true') { setDark(true); document.documentElement.classList.add('dark') }
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem('cm_dark', String(next))
    document.documentElement.classList.toggle('dark', next)
  }

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
        if (keys.githubToken && keys.gistId) autoLoadFromGist(keys.githubToken, keys.gistId)
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

  const syncToGist = useCallback(async (data, keys) => {
    if (!keys.githubToken) return
    try {
      setSyncStatus('syncing')
      const gistId = await saveToGist(data, keys.githubToken, keys.gistId || null)
      if (!keys.gistId) {
        const newKeys = { ...keys, gistId }
        setApiKeys(newKeys)
        localStorage.setItem('cm_keys', JSON.stringify(newKeys))
      }
      setSyncStatus('synced')
      setTimeout(() => setSyncStatus('idle'), 2000)
    } catch (e) {
      setSyncStatus('error')
      setSyncError(e.message)
      setTimeout(() => setSyncStatus('idle'), 4000)
    }
  }, [])

  const saveAndSync = (newProfile, newOpps, newLearning, newProgramme) => {
    // Always read latest keys from localStorage to avoid stale React state
    let keys = apiKeys
    try {
      const saved = localStorage.getItem('cm_keys')
      if (saved) keys = JSON.parse(saved)
    } catch (e) {}
    const data = getAllData(newProfile, newOpps, newLearning, newProgramme, keys)
    syncToGist(data, keys)
  }

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
          localStorage.setItem('cm_keys', JSON.stringify(newKeys)) // write before load
          await autoLoadFromGist(data.githubToken, existingId)
        } else {
          const tempKeys = { ...data }
          const allData = getAllData(profile, opps, learning, programme, tempKeys)
          const gistId = await saveToGist(allData, tempKeys.githubToken, null)
          const newKeys = { ...tempKeys, gistId }
          setApiKeys(newKeys)
          localStorage.setItem('cm_keys', JSON.stringify(newKeys)) // write before sync
          setSyncStatus('synced')
          setTimeout(() => setSyncStatus('idle'), 2000)
        }
      } catch (e) {
        setSyncStatus('error')
        setSyncError(e.message)
        setTimeout(() => setSyncStatus('idle'), 4000)
      }
    } else if (data.githubToken && data.gistId) {
      localStorage.setItem('cm_keys', JSON.stringify(data)) // ensure latest written
      saveAndSync(profile, opps, learning, programme)
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
    } catch (e) { alert('Import failed: ' + e.message) }
  }

  const switchToNewPerson = () => {
    if (!confirm('Start fresh with a blank profile? This clears all local data.')) return
    localStorage.clear()
    setProfile({ name:'',email:'',role:'',education:'',skills:'',projects:'',goals:'',targets:'',docContext:'' })
    setOpps([])
    setLearning(DEFAULT_LEARNING)
    setProgramme({})
    setApiKeys({ groq:'',claude:'',githubToken:'',gistId:'' })
    setTab('profile')
  }

  const handleAnalyze = (opp) => {
    setChatInit(`Analyze this opportunity for me — am I a good fit, what are my chances, and what should I emphasize? ${opp.role} at ${opp.company}${opp.notes ? '. Details: ' + opp.notes : ''}`)
    setTab('chat')
  }

  const handleCoverLetter = (opp) => {
    setChatInit(`Write a tailored cover letter / application email for: ${opp.role} at ${opp.company}. ${opp.notes ? 'Role details: ' + opp.notes : ''} Make it genuine and specific.`)
    setTab('chat')
  }

  const handleAskTip = (text) => { setChatInit(text); setTab('chat') }

  const doneToday = Object.values(learning.today || {}).filter(Boolean).length
  const urgentOpps = opps.filter(o => {
    if (!o.deadline || o.status === 'rejected') return false
    const days = Math.round((new Date(o.deadline) - new Date()) / 86400000)
    return days >= 0 && days <= 7
  }).length

  const syncColor = { idle:'text-gray-400 dark:text-gray-600', syncing:'text-blue-500', synced:'text-green-500', error:'text-red-500' }
  const syncText = { idle:'', syncing:'↻ Syncing...', synced:'✓ Synced', error:'✗ Sync failed' }

  const renderContent = () => {
    switch (tab) {
      case 'profile': return <Profile profile={profile} onSave={saveProfile} />
      case 'opportunities': return <Opportunities opps={opps} onSave={saveOpp} onDelete={deleteOpp} onAnalyze={handleAnalyze} onCoverLetter={handleCoverLetter} />
      case 'learning': return <Learning learning={learning} onSave={saveLearning} onAskTip={handleAskTip} />
      case 'programme': return <Programme progress={programme} onSave={saveProgramme} />
      case 'chat': return <Chat profile={profile} opps={opps} learning={learning} programme={programme} apiKeys={apiKeys} initMessage={chatInit} onInitDone={() => setChatInit(null)} />
      case 'settings': return <Settings apiKeys={apiKeys} onSave={saveKeys} onSwitchPerson={switchToNewPerson} onExport={handleExport} onImport={handleImport} syncStatus={syncStatus} syncError={syncError} />
      default: return null
    }
  }

  const NavItem = ({ t }) => (
    <button key={t.id} onClick={() => setTab(t.id)} className={`nav-item relative ${tab === t.id ? 'active' : ''}`}>
      <span className="text-lg">{t.icon}</span>
      <span>{t.label}</span>
      {t.id === 'opportunities' && urgentOpps > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{urgentOpps}</span>
      )}
      {t.id === 'learning' && (
        <span className={`ml-auto text-xs ${doneToday === 3 ? 'text-green-500' : 'text-gray-400 dark:text-gray-600'}`}>
          {doneToday === 3 ? '✓' : `${doneToday}/3`}
        </span>
      )}
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 min-h-screen fixed left-0 top-0 bottom-0">
        {/* Header */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <span className="font-semibold text-gray-900 dark:text-white text-lg">Career</span>
            </div>
            <button
              onClick={toggleDark}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle dark mode"
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600 pl-9">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
          </p>
        </div>

        {/* User card */}
        <div className="px-5 pb-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
            <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center font-semibold text-sm mb-2">
              {profile.name ? profile.name.split(' ').map(w => w[0]).slice(0,2).join('') : '?'}
            </div>
            <p className="font-medium text-sm text-gray-900 dark:text-white leading-tight">{profile.name || 'Set your name'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight truncate">{profile.role || 'Add your role'}</p>
            <div className="flex items-center justify-between mt-3">
              <button onClick={switchToNewPerson} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                ⇄ New person
              </button>
              {syncText[syncStatus] && (
                <span className={`text-xs ${syncColor[syncStatus]}`}>{syncText[syncStatus]}</span>
              )}
            </div>
          </div>
        </div>

        {/* Main nav — scrollable */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-1 pb-2">
          {MAIN_TABS.map(t => <NavItem key={t.id} t={t} />)}
        </nav>

        {/* Streak stats */}
        <div className="px-5 py-3 border-t border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
            <span>🔥 Streak</span>
            <span className="font-semibold text-gray-900 dark:text-white">{learning.streak || 0} days</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-600 mb-1.5">
            <span>Project #{learning.project || 1}</span>
            <span>{Math.min(100, Math.round(((learning.project||1)/300)*100))}% of 300</span>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gray-900 dark:bg-white h-full rounded-full transition-all" style={{ width: `${Math.min(100,((learning.project||1)/300)*100).toFixed(1)}%` }} />
          </div>
        </div>

        {/* Bottom nav — always visible */}
        <div className="px-4 py-3 space-y-1">
          {BOTTOM_TABS.map(t => <NavItem key={t.id} t={t} />)}
          {!apiKeys.githubToken && (
            <button onClick={() => setTab('settings')} className="w-full text-xs text-orange-500 bg-orange-50 dark:bg-orange-950 dark:text-orange-400 rounded-lg px-3 py-2 hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors text-left mt-1">
              ⚠ Enable cross-device sync
            </button>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">

        {/* Desktop topbar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {ALL_TABS.find(t => t.id === tab)?.icon} {ALL_TABS.find(t => t.id === tab)?.label}
          </h1>
          <div className="flex items-center gap-3">
            {syncText[syncStatus] && <span className={`text-sm ${syncColor[syncStatus]}`}>{syncText[syncStatus]}</span>}
            {urgentOpps > 0 && (
              <button onClick={() => setTab('opportunities')} className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-800">
                ⚠ {urgentOpps} deadline{urgentOpps > 1 ? 's' : ''} soon
              </button>
            )}
            {doneToday === 3 && (
              <span className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 text-sm px-3 py-1.5 rounded-xl border border-green-200 dark:border-green-800">
                ✓ Floor done
              </span>
            )}
          </div>
        </div>

        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 pt-6 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚀</span>
              <span className="font-semibold text-lg dark:text-white">
                {profile.name ? `Hey, ${profile.name.split(' ')[0]}` : 'Career Manager'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 pl-8">
              {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={toggleDark} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {dark ? '☀️' : '🌙'}
            </button>
            {urgentOpps > 0 && (
              <button onClick={() => setTab('opportunities')} className="bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-xs px-2.5 py-1.5 rounded-xl font-medium">⚠ {urgentOpps}</button>
            )}
          </div>
        </div>

        <div className="px-4 lg:px-8 py-4 lg:py-6">
          {renderContent()}
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex z-50">
        {ALL_TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors relative ${tab === t.id ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
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
