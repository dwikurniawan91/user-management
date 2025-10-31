import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import ErrorBoundary from './ErrorBoundary'

const { toastErrorMock } = vi.hoisted(() => ({
  toastErrorMock: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    error: toastErrorMock,
    success: vi.fn(),
  },
  Toaster: () => null,
}))

const ProblemChild = () => {
  throw new Error('Boom')
}

describe('ErrorBoundary', () => {
  it('renders fallback and triggers toast error on failure', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary fallback={<p role="alert">Fallback rendered</p>}>
        <ProblemChild />
      </ErrorBoundary>
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Fallback rendered')
    expect(toastErrorMock).toHaveBeenCalledWith('Boom')

    consoleSpy.mockRestore()
  })
})
