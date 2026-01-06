'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent 
          error={this.state.error} 
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      )
    }

    return this.props.children
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; reset: () => void }> = ({ error, reset }) => (
  <div className="min-h-screen bg-nike-black flex items-center justify-center">
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
      <p className="text-gray-400 mb-6">
        {error?.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={reset}
        className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
)

export default ErrorBoundary