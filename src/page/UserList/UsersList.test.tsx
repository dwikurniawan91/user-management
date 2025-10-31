import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import UsersList from './UsersList'

const mockFetchUsers = vi.fn()
const mockAddUser = vi.fn()
const mockUpdateUser = vi.fn()
const mockDeleteUser = vi.fn()

const { toastSuccessMock, toastErrorMock } = vi.hoisted(() => ({
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
}))

const mockState = {
  users: [] as Array<{
    id: number
    name: string
    username: string
    email: string
    avatar: string
    phone?: string
    website?: string
    company?: Record<string, unknown>
  }>,
  loading: false,
  error: null as string | null,
  fetchUsers: mockFetchUsers,
  addUser: mockAddUser,
  updateUser: mockUpdateUser,
  deleteUser: mockDeleteUser,
}

vi.mock('sonner', () => ({
  toast: {
    success: toastSuccessMock,
    error: toastErrorMock,
  },
  Toaster: () => null,
}))

vi.mock('motion/react', () => {
  return {
    motion: {
      li: ({
        children,
        ...rest
      }: React.PropsWithChildren<Record<string, unknown>>) =>
        React.createElement('li', rest as React.HTMLAttributes<HTMLLIElement>, children),
    },
  }
})

vi.mock('@/stores/userStore', () => ({
  __esModule: true,
  default: vi.fn((selector: (state: typeof mockState) => unknown) => selector(mockState)),
}))

describe('UsersList', () => {
  beforeEach(() => {
    mockState.users = []
    mockState.loading = false
    mockState.error = null
    mockFetchUsers.mockClear()
    mockAddUser.mockClear()
    mockUpdateUser.mockClear()
    mockDeleteUser.mockClear()
    toastSuccessMock.mockClear()
    toastErrorMock.mockClear()
  })

  it('fetches users on mount when list is empty', async () => {
    render(<UsersList />)

    await waitFor(() => {
      expect(mockFetchUsers).toHaveBeenCalledTimes(1)
    })
  })

  it('renders user cards when users exist', () => {
    mockState.users = [
      {
        id: 1,
        name: 'Alice Smith',
        username: 'alice',
        email: 'alice@example.com',
        avatar: 'https://example.com/avatar.png',
      },
    ]

    render(<UsersList />)

    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    expect(screen.getByText('@alice')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(mockFetchUsers).not.toHaveBeenCalled()
  })

  it('shows loading skeletons while data is fetching', () => {
    mockState.loading = true

    render(<UsersList />)

    expect(screen.getAllByRole('article')).toHaveLength(10)
  })

  it('displays an error message when an error occurs', () => {
    mockState.error = 'Network error'

    render(<UsersList />)

    expect(screen.getByRole('alert')).toHaveTextContent('Error: Network error')
    expect(toastErrorMock).toHaveBeenCalledWith('Network error')
  })

  it('allows adding a user via the dialog form', async () => {
    render(<UsersList />)

    expect(screen.queryByText('Add New User')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Add User' }))

    expect(screen.getByText('Add New User')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'johndoe' },
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add User' }))

    await waitFor(() => {
      expect(mockAddUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
        })
      )
    })
  })
})
