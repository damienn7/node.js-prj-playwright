const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export const apiFetch = async (path: string, opts: RequestInit = {}) => {
  const url = `${BASE.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`
  const res = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}
