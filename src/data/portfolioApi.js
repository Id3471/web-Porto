export function portfolioApiUrl(path) {
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
  return `${base}${path}`
}
