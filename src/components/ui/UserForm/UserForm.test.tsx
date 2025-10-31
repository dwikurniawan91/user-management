import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import UserForm from './UserForm'

describe('UserForm', () => {
  const fillRequiredFields = () => {
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'johndoe' },
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' },
    })
  }

  it('renders initial data and handles cancel action', () => {
    const handleSubmit = vi.fn()
    const handleCancel = vi.fn()

    render(
      <UserForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={{
          name: 'Jane Doe',
          username: 'janedoe',
          email: 'jane@example.com',
          phone: '123-456',
          website: 'https://example.com',
          company: { name: 'Example Inc' },
        }}
      />
    )

    expect(screen.getByLabelText('Name')).toHaveValue('Jane Doe')
    expect(screen.getByLabelText('Username')).toHaveValue('janedoe')
    expect(screen.getByLabelText('Email')).toHaveValue('jane@example.com')
    expect(screen.getByLabelText('Phone')).toHaveValue('123-456')
    expect(screen.getByLabelText('Website')).toHaveValue('https://example.com')
    expect(screen.getByLabelText('Company Name')).toHaveValue('Example Inc')
    expect(screen.getByRole('button', { name: 'Update User' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(handleCancel).toHaveBeenCalledTimes(1)
  })

  it('submits valid data', async () => {
    const handleSubmit = vi.fn()

    render(<UserForm onSubmit={handleSubmit} />)

    fillRequiredFields()
    fireEvent.change(screen.getByLabelText('Phone'), {
      target: { value: '555-5555' },
    })
    fireEvent.change(screen.getByLabelText('Website'), {
      target: { value: 'https://acme.com' },
    })
    fireEvent.change(screen.getByLabelText('Company Name'), {
      target: { value: 'Acme Corp' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add User' }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        phone: '555-5555',
        website: 'https://acme.com',
        company: { name: 'Acme Corp' },
      })
    )
  })

  it('shows validation errors when required fields are missing', async () => {
    const handleSubmit = vi.fn()

    render(<UserForm onSubmit={handleSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Add User' }))

    expect(await screen.findByText('Name must be at least 2 characters')).toBeInTheDocument()
    expect(await screen.findByText('Username must be at least 3 characters')).toBeInTheDocument()
    expect(await screen.findByText('Please enter a valid email')).toBeInTheDocument()

    expect(handleSubmit).not.toHaveBeenCalled()
  })
})
