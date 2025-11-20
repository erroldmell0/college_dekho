export const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function parseResponse(res) {
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return res.json()
  }
  return res.text()
}

export async function request(path, options = {}) {
  // attach Authorization header if token present and not already provided
  const token = localStorage.getItem('token')
  const headers = new Headers(options.headers || {})
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${API}${path}`, { ...options, headers })
  const data = await parseResponse(res)

  if (!res.ok) {
    // Normalize common error shapes
    let message = 'Request failed'
    if (data) {
      if (typeof data === 'string') message = data
      else if (data.message) message = data.message
      else if (Array.isArray(data.errors)) message = data.errors.map(e => e.msg || e.message).join(', ')
      else message = JSON.stringify(data)
    }
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}
