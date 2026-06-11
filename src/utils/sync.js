// ── EXPORT / IMPORT ──────────────────────────────────────────
export function exportData(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `career-manager-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try { resolve(JSON.parse(e.target.result)) }
      catch { reject(new Error('Invalid file — make sure it is a career manager JSON backup')) }
    }
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsText(file)
  })
}

// ── QR CODE SYNC ─────────────────────────────────────────────
// Encode data for URL (excludes docContext to stay within QR limits)
export function encodeSyncData(profile, opps, learning, programme) {
  const { docContext, ...profileClean } = profile
  const payload = { profile: profileClean, opps, learning, programme }
  const json = JSON.stringify(payload)
  // Use base64url encoding that handles unicode
  return btoa(unescape(encodeURIComponent(json)))
}

export function decodeSyncData(encoded) {
  const json = decodeURIComponent(escape(atob(encoded)))
  return JSON.parse(json)
}

export function getQRCodeUrl(syncData) {
  const appUrl = window.location.origin + window.location.pathname
  const targetUrl = `${appUrl}?sync=${encodeURIComponent(syncData)}`
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(targetUrl)}`
}

export function getSyncParam() {
  const params = new URLSearchParams(window.location.search)
  return params.get('sync')
}

export function clearSyncParam() {
  window.history.replaceState({}, '', window.location.pathname)
}
