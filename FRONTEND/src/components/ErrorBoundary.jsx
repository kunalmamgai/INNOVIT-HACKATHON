import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center px-4">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-xl font-bold text-gold mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-4 max-w-md">
            The page failed to load. This can happen on slow connections.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false })
              window.location.reload()
            }}
            className="px-5 py-2 bg-gold text-gray-900 rounded font-semibold hover:bg-gold/90 transition"
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
