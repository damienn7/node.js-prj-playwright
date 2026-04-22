export const normalizeUrl = (raw: string) => {
  try {
    const u = new URL(raw)
    // remove fragment
    u.hash = ''
    // remove default ports
    if ((u.protocol === 'http:' && u.port === '80') || (u.protocol === 'https:' && u.port === '443')) {
      u.port = ''
    }
    // remove trailing slash on path (except root)
    if (u.pathname !== '/' && u.pathname.endsWith('/')) {
      u.pathname = u.pathname.replace(/\/+$/, '')
    }
    return u.toString()
  } catch (e) {
    return raw
  }
}

export const extractDomain = (raw: string) => {
  try {
    const u = new URL(raw)
    return u.hostname.toLowerCase()
  } catch (e) {
    return raw
  }
}
