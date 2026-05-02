import { create } from 'zustand'
import api from '@/lib/api'
import { User, ApiResponse } from '@/types'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (email: string, password: string) => Promise<void>
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  setUser: (user: User | null) => void
}

const useAuthStore = create<AuthStore>((set) => {
  // Initialize: if access_token exists, fetch current user
  const token = localStorage.getItem('access_token')
  if (token) {
    // Schedule fetchMe after store is created
    setTimeout(async () => {
      try {
        const response = await api.get<ApiResponse<{ user: User }>>('/auth/me')
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        })
      } catch {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null, isAuthenticated: false, isLoading: false })
      }
    }, 0)
  }

  return {
    user: null,
    isAuthenticated: false,
    isLoading: !!token, // loading only if token exists and we're about to fetch

    register: async (firstName: string, lastName: string, email: string, password: string) => {
      set({ isLoading: true })
      try {
        // Register just creates the account — no tokens returned, user must verify email
        await api.post('/auth/register', { firstName, lastName, email, password })
        set({ isLoading: false })
      } catch (error) {
        set({ isLoading: false })
        throw error
      }
    },

    login: async (email: string, password: string) => {
      set({ isLoading: true })
      try {
        const response = await api.post<
          ApiResponse<{ user: User; accessToken: string; refreshToken: string }>
        >('/auth/login', { email, password })

        const { user, accessToken, refreshToken } = response.data

        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)

        set({ user, isAuthenticated: true, isLoading: false })
      } catch (error) {
        set({ isLoading: false })
        throw error
      }
    },

    logout: async () => {
      set({ isLoading: true })
      try {
        await api.post('/auth/logout')
      } catch {
        // Ignore errors on logout
      } finally {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null, isAuthenticated: false, isLoading: false })
      }
    },

    fetchMe: async () => {
      set({ isLoading: true })
      try {
        const response = await api.get<ApiResponse<{ user: User }>>('/auth/me')
        set({ user: response.data.user, isAuthenticated: true, isLoading: false })
      } catch {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null, isAuthenticated: false, isLoading: false })
      }
    },

    setUser: (user: User | null) => {
      set({ user, isAuthenticated: !!user })
    },
  }
})

export default useAuthStore
