import React, { useId } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../utils/cn'

// Shared frame for Input, Select and Textarea: label above, hint, error below.
export const controlClass = (error) =>
  cn(
    'w-full rounded-lg border bg-[var(--surface)] text-[var(--ink)] text-[0.9375rem] px-3',
    'transition-[border-color,box-shadow] duration-[var(--dur-fast)]',
    'focus:outline-none focus-visible:outline-none focus:border-[var(--pine)] focus:shadow-[0_0_0_3px_var(--pine-tint)]',
    'disabled:bg-[var(--sunk)] disabled:text-[var(--ink-3)]',
    error ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:shadow-[0_0_0_3px_var(--danger-tint)]' : 'border-[var(--line-strong)] hover:border-[var(--ink-3)]'
  )

export const Field = ({ id, label, hint, error, required, children, className }) => (
  <div className={cn('w-full flex flex-col gap-1.5', className)}>
    {label && (
      <label htmlFor={id} className="text-sm font-medium text-[var(--ink)]">
        {label}
        {/* The control's own required attribute announces this; the words are for sighted users. */}
        {required && <span aria-hidden="true" className="text-[var(--ink-3)] font-normal"> (required)</span>}
      </label>
    )}
    {children}
    {hint && !error && <p id={`${id}-hint`} className="text-[0.8125rem] text-[var(--ink-3)]">{hint}</p>}
    {error && (
      <p id={`${id}-error`} role="alert" className="flex items-start gap-1.5 text-[0.8125rem] font-medium text-[var(--danger-ink)]">
        <AlertCircle className="size-4 mt-px shrink-0" aria-hidden="true" />
        {error}
      </p>
    )}
  </div>
)

export const useFieldId = (id) => {
  const auto = useId()
  return id ?? `f${auto.replace(/:/g, '')}`
}

export const describedBy = (id, hint, error) =>
  [error && `${id}-error`, hint && !error && `${id}-hint`].filter(Boolean).join(' ') || undefined
