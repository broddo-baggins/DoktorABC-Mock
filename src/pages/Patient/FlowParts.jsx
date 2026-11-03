import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../utils/cn'
import { RxLabel } from '../../components/ui/Page'

// Shared pieces for the booking flows (QuickBook, Questionnaire, BookTreatment,
// BookConsultation, Payment). Candidate for src/components/ui once stable.

// Stepped progress: numbered steps with a bar under each; the current step is
// announced with aria-current. On phones it collapses to "Step n of m".
export const Stepper = ({ steps, current, className }) => (
  <nav aria-label="Progress" className={cn('mb-8 md:mb-10', className)}>
    <p className="sm:hidden text-sm text-[var(--ink-2)] mb-2">
      Step <span className="figure">{current}</span> of <span className="figure">{steps.length}</span>
      <span className="text-[var(--ink)] font-medium">: {steps[current - 1]}</span>
    </p>
    <ol className="grid gap-1.5 sm:gap-3" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
      {steps.map((label, i) => {
        const n = i + 1
        const done = n < current
        const active = n === current
        return (
          <li key={label} aria-current={active ? 'step' : undefined} className="min-w-0">
            <span className={cn('block h-1 rounded-full', done || active ? 'bg-[var(--pine)]' : 'bg-[var(--line)]')} />
            <span className="hidden sm:flex items-center gap-2 mt-2.5 text-sm min-w-0">
              <span
                className={cn(
                  'grid place-items-center size-5 rounded-full font-mono text-[11px] shrink-0',
                  done ? 'bg-[var(--pine)] text-[var(--on-pine)]' : active ? 'bg-[var(--ink)] text-[var(--ink-on-dark)]' : 'bg-[var(--sunk)] text-[var(--ink-3)]'
                )}
              >
                {done ? <Check className="size-3" strokeWidth={3} aria-hidden="true" /> : n}
              </span>
              <span className={cn('truncate', active ? 'text-[var(--ink)] font-medium' : 'text-[var(--ink-3)]')}>{label}</span>
              {done && <span className="sr-only">(completed)</span>}
            </span>
          </li>
        )
      })}
    </ol>
  </nav>
)

// Order summary as a pharmacy label. rows: [{ label, value, muted }]; total: { label, value }.
export const Summary = ({ code = 'ORDER SUMMARY', meta, title, rows = [], total, children, className }) => (
  <RxLabel code={code} meta={meta} className={className}>
    {title && <p className="font-semibold text-[var(--ink)] mb-2">{title}</p>}
    {rows.length > 0 && (
      <dl className="divide-y divide-[var(--line)]">
        {rows.map(r => (
          <div key={r.label} className="flex justify-between items-baseline gap-4 py-2">
            <dt className="text-sm text-[var(--ink-3)] shrink-0">{r.label}</dt>
            <dd className={cn('text-sm text-right min-w-0', r.mono ? 'figure' : '', r.muted ? 'text-[var(--ink-3)]' : 'text-[var(--ink)]')}>
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    )}
    {total && (
      <div className="mt-2 pt-3 border-t border-[var(--ink)] flex justify-between items-baseline">
        <span className="font-semibold text-[var(--ink)]">{total.label}</span>
        <span className="figure text-xl font-medium text-[var(--ink)]">{total.value}</span>
      </div>
    )}
    {children}
  </RxLabel>
)

// A selectable tile used for areas, clinics, slots and answers.
export const ChoiceButton = ({ selected, className, children, ...props }) => (
  <button
    type="button"
    aria-pressed={selected}
    className={cn(
      'relative text-left rounded-lg border transition-colors',
      selected
        ? 'border-[var(--pine)] bg-[var(--pine-wash)] text-[var(--ink)] shadow-[inset_0_0_0_1px_var(--pine)]'
        : 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink-2)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]',
      className
    )}
    {...props}
  >
    {children}
  </button>
)

export const FlowTitle = ({ kicker, title, description }) => (
  <div className="mb-6">
    {kicker && <p className="label-mono mb-2">{kicker}</p>}
    <h1 className="text-[1.625rem] md:text-[2rem] leading-[1.15] font-semibold tracking-[-0.025em] text-[var(--ink)]">{title}</h1>
    {description && <p className="mt-2 text-[var(--ink-2)] max-w-[60ch]">{description}</p>}
  </div>
)

export const formatSlot = (iso, opts = { weekday: 'short', day: 'numeric', month: 'short' }) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.toLocaleDateString('en-GB', opts)}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
}
