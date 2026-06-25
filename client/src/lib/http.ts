import axios, { type AxiosInstance, isAxiosError } from 'axios'

const TOKEN_KEY = 'pm_token'

/** Read / write the Sanctum bearer token in localStorage. */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

// The app registers a callback here (in main.ts) so the interceptor can
// log the user out without importing the router/store (avoids import cycles).
let onUnauthorized: (() => void) | null = null
export function setUnauthorizedHandler(fn: () => void): void {
  onUnauthorized = fn
}

/** A single axios instance every API call goes through. */
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: 'application/json' },
})

// Attach the bearer token (when present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// If the token is rejected, clear it and let the app send the user to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      setToken(null)
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)

/** Pull a human-readable message out of an axios error (Laravel sends `message`). */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    return data?.message ?? error.message ?? fallback
  }
  return fallback
}

/** Turn a Laravel 422 `{ errors: { field: [msg] } }` body into `{ field: msg }`. */
export function getFieldErrors(error: unknown): Record<string, string> {
  const out: Record<string, string> = {}
  if (isAxiosError(error)) {
    const errs = (error.response?.data as { errors?: Record<string, string[]> } | undefined)?.errors
    if (errs) {
      for (const [field, messages] of Object.entries(errs)) {
        const first = messages?.[0]
        if (first) out[field] = first
      }
    }
  }
  return out
}
