import { create } from 'zustand'

export type User = {
  id: number
  name: string
  username: string
  email: string
  phone?: string
  website?: string
  address?: Record<string, unknown>
  company?: Record<string, unknown>
  avatar: string
}

type State = {
  users: User[]
  loading: boolean
  error: string | null
  fetchUsers: () => Promise<void>
  clear: () => void
  addUser: (user: Omit<User, 'id' | 'avatar'>) => void
  updateUser: (id: number, updates: Partial<Omit<User, 'id'>>) => void
  deleteUser: (id: number) => void
}

const API = import.meta.env.VITE_API_URL

const useUserStore = create<State>((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: User[] = await res.json()
      data.forEach((user) => {
        const randomId = Math.floor(Math.random() * 70) + 1 // Random ID between 1 and 70
        user.avatar = `https://i.pravatar.cc/150?img=${randomId}`
      })
      set({ users: data, loading: false })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      set({ error: msg, loading: false, users: [] })
    }
  },
  clear: () => set({ users: [], error: null, loading: false }),
  addUser: (user) => {
    set((state) => {
      const maxId = Math.max(0, ...state.users.map((u) => u.id))
      const randomId = Math.floor(Math.random() * 70) + 1
      const newUser: User = {
        ...user,
        id: maxId + 1,
        avatar: `https://i.pravatar.cc/150?img=${randomId}`,
      }
      return { users: [...state.users, newUser] }
    })
  },
  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === id ? { ...user, ...updates } : user)),
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
}))

export default useUserStore
