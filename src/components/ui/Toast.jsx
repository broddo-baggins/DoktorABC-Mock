import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '../../utils/cn'

const ToastContext = createContext(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  // A counter, not Date.now(): two toasts in the same millisecond must not share a React key.
  const nextId = useRef(0)

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++nextId.current
    setToasts(prev => [...prev, { id, message, type }])

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const value = useMemo(() => ({
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    info: (message, duration) => addToast(message, 'info', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
  }), [addToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed z-50 bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-6 flex flex-col gap-2 items-stretch sm:items-end"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="size-5 text-pine-300" aria-hidden="true" />,
    error: <AlertCircle className="size-5 text-red-300" aria-hidden="true" />,
    warning: <AlertTriangle className="size-5 text-amber-300" aria-hidden="true" />,
    info: <Info className="size-5 text-[var(--ink-on-dark-2)]" aria-hidden="true" />,
  }

  // Toasts sit on ink so they read over any page; the glyph carries the tone.
  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-center gap-3 sm:min-w-[320px] max-w-md pl-4 pr-2 py-2 rounded-xl shadow-[var(--shadow-3)] animate-slide-up',
        'bg-[var(--ink)] text-[var(--ink-on-dark)]'
      )}
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium py-2">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="grid place-items-center size-9 rounded-lg text-[var(--ink-on-dark-2)] hover:text-[var(--ink-on-dark)] hover:bg-white/10"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
