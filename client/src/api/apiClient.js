import { authClient } from './authClient'

const API_URL = import.meta.env.VITE_API_URL

export async function apiFetch(path, options = {}) {
  const { data } = await authClient.getSession()
  const token = data?.session?.token

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  let body = null
  try {
    body = await response.json()
  } catch {
    // Non-JSON response, e.g. HTML 502/503 from a cold-starting backend
  }

  if (!response.ok) {
    throw new Error(body?.error || `Request failed with status ${response.status}`)
  }
  return body?.data
}
