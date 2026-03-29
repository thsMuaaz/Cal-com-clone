/**
 * Central API helper. Uses same-origin `/api` in dev (Vite proxy) or VITE_API_URL.
 */
const base = import.meta.env.VITE_API_URL ?? ''

function joinUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}/api${p}`
}

export async function apiJson(path, options = {}) {
  const { headers, body, ...rest } = options
  const res = await fetch(joinUrl(path), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let detail = res.statusText
    try {
      const errBody = await res.json()
      detail = errBody.error ?? errBody.message ?? JSON.stringify(errBody)
    } catch {
      try {
        detail = await res.text()
      } catch {
        /* ignore */
      }
    }
    throw new Error(detail || `Request failed (${res.status})`)
  }

  if (res.status === 204) return null
  const text = await res.text()
  if (!text) return null
  return JSON.parse(text)
}
