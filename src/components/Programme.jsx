import { useState } from 'react'

const PROGRAMME = {
  year1: {
    label: 'Year 1 — Foundation (2025–2026)',
    color: 'blue',
    sections: [
      {
        title: 'Internships & Experience',
        items: [
          { id: 'y1_irembo', label: 'Irembo — Software Engineer Intern, Product & Engineering (April–July 2026)' },
          { id: 'y1_science', label: 'Science/space internship — September–November 2026' },
        ]
      },
      {
        title: 'Projects to Ship',
        items: [
          { id: 'y1_afrilang', label: 'AfriLang — deployed at afrilang.onrender.com' },
          { id: 'y1_talentscreen', label: 'TalentScreen — deployed at talentscreen-gpvs.onrender.com' },
          { id: 'y1_afrispace', label: 'AfriSpace — Django forum deployed' },
          { id: 'y1_exo', label: 'Exoplanet Detection Tool — Python ML, NASA Kepler data (August)' },
          { id: 'y1_orbit', label: 'Satellite Orbit Predictor — Python physics simulation (August)' },
        ]
      },
      {
        title: 'Mathematics & Physics',
        items: [
          { id: 'y1_algebra', label: 'Khan Academy: Algebra Basics' },
          { id: 'y1_trig', label: 'Khan Academy: Trigonometry' },
          { id: 'y1_calc', label: 'Khan Academy: Differential Calculus' },
          { id: 'y1_physics', label: 'The Physics Book — Chapters 1–10' },
        ]
      },
      {
        title: 'Communities (join this week)',
        items: [
          { id: 'y1_zindi', label: 'Zindi Africa — zindi.africa' },
          { id: 'y1_afas', label: 'African Astronomical Society — afasociety.org' },
          { id: 'y1_sgac', label: 'SGAC Space Generation Advisory Council — spacegeneration.org' },
          { id: 'y1_mlh', label: 'MLH Major League Hacking — mlh.io' },
          { id: 'y1_nasa', label: 'NASA Citizen Science — science.nasa.gov/citizen-science' },
        ]
      },
      {
        title: 'Applications (Urgent — June 2026)',
        items: [
          { id: 'y1_cern', label: 'CERN Short Term Internship — apply NOW (open year-round, paid)' },
          { id: 'y1_cern_tech', label: 'CERN Technical Student Programme — deadline June 30, 2026' },
          { id: 'y1_foundjem', label: 'Email Dr. Foundjem — Polytechnique Montréal (this week)' },
          { id: 'y1_cnes', label: 'CNES France — apply June 2026' },
          { id: 'y1_airbus', label: 'Airbus Defence & Space — apply June 2026' },
          { id: 'y1_esa', label: 'ESA — apply June 2026' },
        ]
      }
    ]
  },
  year2: {
    label: 'Year 2 — Depth & Exposure (Sep 2026–Jun 2027)',
    color: 'orange',
    sections: [
      {
        title: 'New Skills',
        items: [
          { id: 'y2_cpp', label: 'C and C++ basics — hardware, embedded, space software' },
          { id: 'y2_pytorch', label: 'PyTorch — standard ML research framework' },
          { id: 'y2_docker', label: 'Docker and containerisation' },
          { id: 'y2_linalg', label: 'Linear Algebra — MIT OCW 18.06 (Gilbert Strang)' },
          { id: 'y2_diffeq', label: 'Differential Equations' },
        ]
      },
      {
        title: 'Projects',
        items: [
          { id: 'y2_nlp', label: 'African Language NLP Tool — train model on African language data' },
          { id: 'y2_eo', label: 'Earth Observation Dashboard — ESA/NASA satellite data for Africa' },
          { id: 'y2_phys', label: 'Physics Simulation — orbital mechanics or wave propagation' },
          { id: 'y2_hw', label: 'Hardware project — Arduino or Raspberry Pi' },
        ]
      },
      {
        title: 'Fellowships to Apply',
        items: [
          { id: 'y2_au', label: 'African Union Digital & Innovation Fellowship' },
          { id: 'y2_deepmind', label: 'Google DeepMind Africa' },
          { id: 'y2_zindi', label: 'Zindi Fellowship' },
          { id: 'y2_nasaapps', label: 'NASA Space Apps Challenge — October 2026' },
        ]
      },
      {
        title: 'Science Club',
        items: [
          { id: 'y2_club', label: 'Launch ALU Science Club — soft launch September 2026' },
          { id: 'y2_club2', label: 'Official ALU recognition — January 2027' },
          { id: 'y2_olympiad', label: 'First Math Olympiad with cash prizes — June 2027' },
        ]
      }
    ]
  },
  year3: {
    label: 'Year 3 — Convergence & Launch (Sep 2027–Jun 2028)',
    color: 'purple',
    sections: [
      {
        title: 'Specialisation Decision (end of Year 2)',
        items: [
          { id: 'y3_spec', label: 'Choose primary direction: Space Systems / AI for Science / Scientific Computing / Hardware' },
        ]
      },
      {
        title: 'Capstone Project',
        items: [
          { id: 'y3_cap', label: 'Build one major African-focused capstone project — real data, published, open source' },
          { id: 'y3_blog', label: 'Document capstone publicly — technical blog series' },
        ]
      },
      {
        title: "Master's Applications",
        items: [
          { id: 'y3_poly', label: 'Polytechnique Montréal — Dr. Foundjem contact' },
          { id: 'y3_aims', label: 'AIMS — African Institute for Mathematical Sciences' },
          { id: 'y3_uct', label: 'University of Cape Town — African Space Innovation Centre' },
          { id: 'y3_kth', label: 'KTH Royal Institute of Technology — Sweden' },
          { id: 'y3_delft', label: 'TU Delft — Netherlands, aerospace engineering' },
        ]
      },
      {
        title: 'Flagship Events',
        items: [
          { id: 'y3_nasawin', label: 'NASA Space Apps Challenge — aim top 10 globally' },
          { id: 'y3_sgac', label: 'SGAC Space Generation Congress — present your research' },
          { id: 'y3_google', label: 'Google Research Africa — internship or fellowship' },
        ]
      }
    ]
  }
}

const YEAR_STYLES = {
  blue: { header: 'bg-blue-50 border-blue-200 text-blue-800', dot: 'bg-blue-500' },
  orange: { header: 'bg-orange-50 border-orange-200 text-orange-800', dot: 'bg-orange-500' },
  purple: { header: 'bg-purple-50 border-purple-200 text-purple-800', dot: 'bg-purple-500' },
}

export default function Programme({ progress, onSave }) {
  const [open, setOpen] = useState({ year1: true, year2: false, year3: false })
  const prog = progress || {}

  const toggle = (id) => {
    const next = { ...prog, [id]: !prog[id] }
    onSave(next)
  }

  const countDone = (year) => {
    const all = PROGRAMME[year].sections.flatMap(s => s.items)
    return all.filter(i => prog[i.id]).length
  }
  const countTotal = (year) => PROGRAMME[year].sections.flatMap(s => s.items).length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {['year1','year2','year3'].map(y => {
          const done = countDone(y)
          const total = countTotal(y)
          const pct = Math.round((done/total)*100)
          const styles = YEAR_STYLES[PROGRAMME[y].color]
          return (
            <div key={y} className={`rounded-2xl border p-3 text-center ${styles.header}`}>
              <div className="text-2xl font-semibold">{pct}%</div>
              <div className="text-xs mt-0.5">{done}/{total}</div>
              <div className="text-xs mt-1 font-medium">Year {y.replace('year','')}</div>
            </div>
          )
        })}
      </div>

      {['year1','year2','year3'].map(yearKey => {
        const year = PROGRAMME[yearKey]
        const styles = YEAR_STYLES[year.color]
        const done = countDone(yearKey)
        const total = countTotal(yearKey)
        const isOpen = open[yearKey]

        return (
          <div key={yearKey} className="card overflow-hidden p-0">
            <button
              onClick={() => setOpen(p => ({ ...p, [yearKey]: !p[yearKey] }))}
              className={`w-full flex items-center justify-between px-5 py-4 border-b ${isOpen ? styles.header : 'bg-white text-gray-700'} transition-colors`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
                <span className="font-semibold text-sm">{year.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs opacity-70">{done}/{total}</div>
                <div className="w-16 bg-white/50 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full rounded-full ${styles.dot}`} style={{width:`${Math.round((done/total)*100)}%`}} />
                </div>
                <span className="text-xs opacity-60">{isOpen ? '▲' : '▼'}</span>
              </div>
            </button>

            {isOpen && (
              <div className="p-5 space-y-5">
                {year.sections.map(section => (
                  <div key={section.title}>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{section.title}</h4>
                    <div className="space-y-1.5">
                      {section.items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => toggle(item.id)}
                          className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl border text-left text-sm transition-all ${
                            prog[item.id]
                              ? 'bg-gray-50 border-gray-100 opacity-60'
                              : 'bg-white border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            prog[item.id] ? 'bg-gray-900 border-gray-900' : 'border-gray-300'
                          }`}>
                            {prog[item.id] && <span className="text-white text-xs">✓</span>}
                          </div>
                          <span className={prog[item.id] ? 'line-through text-gray-400' : 'text-gray-700'}>
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
