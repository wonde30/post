import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { api, getToken, setToken } from '@/lib/http'

export const useAuthStore = defineStore('auth', () => {
  // Seed the token from localStorage so a refresh keeps you logged in.
  const token = ref<string | null>(getToken())
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => token.value !== null)

  function setSession(newToken: string) {
    token.value = newToken
    setToken(newToken)
  }

  function clearSession() {
    token.value = null
    user.value = null
    setToken(null)
  }

  /** GET /me — fetch the current user (used after login and on app start). */
  async function loadUser() {
    if (!token.value) return
    try {
      user.value = await api.get<User>('/me').then((r) => r.data)
    } catch {
      clearSession()
    }
  }

  /** POST /login — exchange email + password for a bearer token, then load the user. */
  async function login(payload: { email: string; password: string }) {
    const { token: newToken } = await api
      .post<{ token: string }>('/login', payload)
      .then((r) => r.data)
    setSession(newToken)
    await loadUser()
  }

  /** POST /register — create the account; the API returns the user + a token. */
  async function register(payload: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) {
    const { token: newToken, user: newUser } = await api
      .post<{ user: User; token: string }>('/register', payload)
      .then((r) => r.data)
    setSession(newToken)
    user.value = newUser
  }

  /** POST /logout — revoke the token on the server, then clear it locally. */
  async function logout() {
    try {
      await api.post('/logout')
    } finally {
      clearSession()
    }
  }

  /** True when the given user_id belongs to the logged-in user (owner checks). */
  function owns(userId: number) {
    return user.value?.id === userId
  }

  return {
    token,
    user,
    isAuthenticated,
    setSession,
    clearSession,
    loadUser,
    login,
    register,
    logout,
    owns,
  }
})
