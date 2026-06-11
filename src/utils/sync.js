const GIST_FILENAME = 'career-manager-data.json'

function ghHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

export async function saveToGist(data, token, gistId) {
  const body = {
    description: 'Career Manager — synced data',
    public: false,
    files: { [GIST_FILENAME]: { content: JSON.stringify(data, null, 2) } }
  }

  if (gistId) {
    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: ghHeaders(token),
      body: JSON.stringify(body)
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`Update failed: ${err.message || res.status}`)
    }
    return gistId
  } else {
    const res = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: ghHeaders(token),
      body: JSON.stringify(body)
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`Create failed: ${err.message || res.status}`)
    }
    const d = await res.json()
    return d.id
  }
}

export async function loadFromGist(token, gistId) {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: ghHeaders(token)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Load failed: ${err.message || res.status}`)
  }
  const d = await res.json()
  const content = d.files[GIST_FILENAME]?.content
  if (!content) throw new Error('No data found in gist')
  return JSON.parse(content)
}

export async function findExistingGist(token) {
  const res = await fetch('https://api.github.com/gists?per_page=100', {
    headers: ghHeaders(token)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Auth failed: ${err.message || res.status} — check your token has "gist" scope`)
  }
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
