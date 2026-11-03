import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Shown when a URL parameter points at a record that does not exist
 * (or that the signed-in user may not see).
 */
const NotFound = ({ title = 'Not found', message, backTo = '/', backLabel = 'Back to home' }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      {message && <p className="text-gray-500 mb-6">{message}</p>}
      <Link to={backTo} className="text-primary-600 hover:text-primary-700 font-medium">
        {backLabel}
      </Link>
    </div>
  )
}

export default NotFound
