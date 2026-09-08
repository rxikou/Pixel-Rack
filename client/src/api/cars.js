import { apiFetch } from './apiClient'
import { authClient } from './authClient'

const API_URL = import.meta.env.VITE_API_URL

// The API returns server-relative /uploads paths; the client runs on a
// different origin in dev, so resolve them here rather than in components.
function resolveImageUrls(car) {
  const absolute = (url) => (url && url.startsWith('/') ? `${API_URL}${url}` : url)
  return {
    ...car,
    originalImageUrl: absolute(car.originalImageUrl),
    pixelImageUrl: absolute(car.pixelImageUrl),
  }
}

export async function fetchCars() {
  const cars = await apiFetch('/api/cars')
  return cars.map(resolveImageUrls)
}

// XHR rather than fetch: it exposes real upload progress for the panel's bar.
export async function uploadCar({ file, name, series, onProgress }) {
  const { data } = await authClient.getSession()
  const token = data?.session?.token

  const form = new FormData()
  form.append('image', file)
  form.append('name', name)
  if (series) form.append('series', series)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${import.meta.env.VITE_API_URL}/api/cars/upload`)
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      let body
      try {
        body = JSON.parse(xhr.responseText)
      } catch {
        return reject(new Error('Unexpected server response'))
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100)
        resolve(resolveImageUrls(body.data))
      } else {
        reject(new Error(body.error || 'Upload failed'))
      }
    }

    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.send(form)
  })
}

export function updateCar(id, changes) {
  return apiFetch(`/api/cars/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  })
}

export function deleteCar(id) {
  return apiFetch(`/api/cars/${id}`, { method: 'DELETE' })
}

export function fetchEnvironments() {
  return apiFetch('/api/environments')
}

export async function fetchPlacements(environmentId) {
  const data = await apiFetch(`/api/environments/${environmentId}/placements`)
  return {
    ...data,
    placements: data.placements.map((p) => ({
      ...p,
      car: resolveImageUrls(p.car),
    })),
  }
}

/** Pass carId null to clear the slot. */
export function setPlacement(environmentId, slotIndex, carId) {
  return apiFetch(
    `/api/environments/${environmentId}/placements/${slotIndex}`,
    { method: 'PUT', body: JSON.stringify({ carId }) },
  )
}
