import React, { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const titleId = useId()
  const panelRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const previous = document.activeElement
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-[rgb(14_25_22/0.48)] animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative w-full bg-[var(--surface)] rounded-t-2xl sm:rounded-2xl shadow-[var(--shadow-3)] animate-slide-up focus:outline-none',
          sizes[size]
        )}
      >
        <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4 border-b border-[var(--line)]">
          <h2 id={titleId} className="text-xl font-semibold text-[var(--ink)]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 grid place-items-center size-11 rounded-lg text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--sunk)]"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

export default Modal
