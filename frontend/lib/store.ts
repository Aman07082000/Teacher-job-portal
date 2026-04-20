import { create } from 'zustand'

interface User {
  id: number
  name: string
  email: string
  role: 'teacher' | 'school' | 'admin'
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User | null) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  login: (token: string, user: User) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token, error: null })
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },
  setUser: (user: User | null) => set({ user }),
  setError: (error: string | null) => set({ error }),
}))
