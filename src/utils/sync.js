const GIST_FILENAME = 'career-manager-data.json'

export async function saveToGist(data, token, gistId) {
  const body = {
    description: 'Career Manager — synced data',
    public: false,
    files: { [GIST_FILENAME]: { content: JSON.stringify(data, null, 2) } }
  }

  if (gistId) {
    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error('Failed to update gist')
    return gistId
  } else {
    const res = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error('Failed to create gist')
    const d = await res.json()
    return d.id
  }
}

export async function loadFromGist(token, gistId) {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `token ${token}` }
  })
  if (!res.ok) throw new Error('Failed to load gist')
  const d = await res.json()
  const content = d.files[GIST_FILENAME]?.content
  if (!content) throw new Error('No data found in gist')
  return JSON.parse(content)
}

export async function findExistingGist(token) {
  const res = await fetch('https://api.github.com/gists', {
    headers: { Authorization: `token ${token}` }
  })
  if (!res.ok) throw new Error('Failed to fetch gists')
  const gists = await res.json()
  const found = gists.find(g => g.files[GIST_FILENAME])
  return found?.id || null
}

export function exportData(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `career-manager-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try { resolve(JSON.parse(e.target.result)) }
      catch { reject(new Error('Invalid file')) }
    }
    reader.onerror = () => reject(new Error('Read error'))
    reader.readAsText(file)
  })
}
