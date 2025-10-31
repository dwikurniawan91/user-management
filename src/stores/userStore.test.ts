import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import type { User } from './userStore'

import useUserStore from './userStore'
import type { UserWithoutAvatar } from '@/services/userService'

const sampleUsers: Array<Omit<User, 'avatar'>> = [
  {
    id: 1,
    name: 'Alice',
    username: 'alice',
    email: 'alice@example.com',
  },
  {
    id: 2,
    name: 'Bob',
    username: 'bob',
    email: 'bob@example.com',
  },
] satisfies Array<UserWithoutAvatar>

describe('useUserStore', () => {
  beforeEach(() => {
    useUserStore.getState().clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('adds a new user and increments id', () => {
    const { addUser } = useUserStore.getState()

    addUser({
      name: 'Charlie',
      username: 'charlie',
      email: 'charlie@example.com',
    })

    const createdUser = useUserStore.getState().users[0]
    expect(createdUser).toMatchObject({
      id: 1,
      name: 'Charlie',
      username: 'charlie',
      email: 'charlie@example.com',
    })
    expect(createdUser.avatar).toMatch(/https:\/\/i\.pravatar\.cc\/150\?img=\d+/)
  })

  it('updates an existing user', () => {
    const { addUser, updateUser } = useUserStore.getState()
    addUser({
      name: 'Dana',
      username: 'dana',
      email: 'dana@example.com',
    })

    updateUser(1, { email: 'new@example.com' })

    expect(useUserStore.getState().users[0].email).toBe('new@example.com')
  })

  it('deletes a user by id', () => {
    const { addUser, deleteUser } = useUserStore.getState()
    addUser({
      name: 'Eve',
      username: 'eve',
      email: 'eve@example.com',
    })
    addUser({
      name: 'Frank',
      username: 'frank',
      email: 'frank@example.com',
    })

    deleteUser(1)

    const remainingUsers = useUserStore.getState().users
    expect(remainingUsers).toHaveLength(1)
    expect(remainingUsers[0].name).toBe('Frank')
  })

  it('fetches users successfully and assigns avatars', async () => {
    const mockJson = vi.fn().mockResolvedValue(sampleUsers)
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: mockJson,
    } as unknown as Response)
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    const store = useUserStore.getState()
    await store.fetchUsers()

    const { users, loading, error } = useUserStore.getState()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(loading).toBe(false)
    expect(error).toBeNull()
    expect(users).toHaveLength(2)
    users.forEach((user) => {
      expect(user.avatar).toBe('https://i.pravatar.cc/150?img=36')
    })
  })

  it('handles fetch errors correctly', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as unknown as Response)
    vi.stubGlobal('fetch', fetchMock)

    await useUserStore.getState().fetchUsers()

    const { users, loading, error } = useUserStore.getState()
    expect(users).toEqual([])
    expect(loading).toBe(false)
    expect(error).toBe('HTTP 500')
  })
})
