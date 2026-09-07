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

  const body = await response.json()
  if (!response.ok) {
    throw new Error(body.error || 'Request failed')
  }
  return body.data
}
