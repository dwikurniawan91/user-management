import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'
import { toast } from 'sonner'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidCatch(error: Error, _info: ErrorInfo) {
    const message = error?.message || 'Something went wrong'
    toast.error(message)
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <div role="alert">Something went wrong.</div>
    }

    return this.props.children
  }
}
