import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, SearchX } from 'lucide-react'

/**
 * Shown when a URL parameter points at a record that does not exist
 * (or that the signed-in user may not see). Same quiet card as ErrorState,
 * but the title is the page's h1.
 */
const NotFound = ({ title = 'Not found', message, backTo = '/', backLabel = 'Back to home' }) => {
  return (
    <div className="container-page py-16 md:py-24">
      <div className="max-w-md mx-auto bg-[var(--surface)] border border-[var(--line)] rounded-2xl flex flex-col items-center text-center py-14 px-6">
        <span className="grid place-items-center size-12 rounded-full bg-[var(--sunk)] text-[var(--ink-2)] mb-4">
          <SearchX className="size-5" aria-hidden="true" />
        </span>
        <h1 className="text-base font-semibold text-[var(--ink)]">{title}</h1>
        {message && <p className="mt-1.5 text-sm text-[var(--ink-3)] max-w-[42ch]">{message}</p>}
        <Link
          to={backTo}
          className="mt-5 inline-flex items-center gap-1.5 h-10 px-4 rounded-lg text-sm font-medium text-[var(--pine)] hover:bg-[var(--pine-tint)]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {backLabel}
        </Link>
      </div>
    </div>
  )
}

export default NotFound
