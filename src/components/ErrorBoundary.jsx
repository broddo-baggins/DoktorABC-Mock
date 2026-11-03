import React from 'react'

/**
 * Keeps a render error in one page from blanking the whole app.
 * Reset by changing `resetKey` (the current pathname).
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, resetKey: props.resetKey }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.resetKey !== state.resetKey) {
      return { error: null, resetKey: props.resetKey }
    }
    return null
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center" role="alert">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-500 mb-6">This page could not be displayed. Please try again.</p>
          <a href={import.meta.env.BASE_URL} className="text-primary-600 hover:text-primary-700 font-medium">Back to home</a>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
