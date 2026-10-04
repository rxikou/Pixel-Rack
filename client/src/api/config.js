import { apiFetch } from './apiClient'

// Which optional features this deployment has switched on. Public endpoint,
// so this works signed out too.
export function fetchConfig() {
  return apiFetch('/api/config')
}
