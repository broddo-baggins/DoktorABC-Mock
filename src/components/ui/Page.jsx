import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, SearchX, FileQuestion } from 'lucide-react'
import { cn } from '../../utils/cn'

// Page frame: one container width and one vertical rhythm for every route.
export const Page = ({ className, children, narrow = false }) => (
  <div className={cn('container-page py-8 md:py-12', narrow && 'max-w-[880px]', className)}>{children}</div>
)

// Title block. `kicker` is the small mono line above (role, record ID) and is
// used on portal pages only, where it carries data rather than decoration.
export const PageHeader = ({ title, description, kicker, back, actions, className }) => (
  <header className={cn('mb-8 md:mb-10', className)}>
    {back && (
      <Link
        to={back.to}
        onClick={back.onClick}
        className="inline-flex items-center gap-1.5 -ml-1 mb-5 px-1 h-9 text-sm font-medium text-[var(--ink-2)] hover:text-[var(--ink)] rounded-md"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {back.label}
      </Link>
    )}
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {kicker && <p className="label-mono mb-2">{kicker}</p>}
        <h1 className="text-[1.75rem] md:text-[2.25rem] leading-[1.1] font-semibold tracking-[-0.025em] text-[var(--ink)]">
          {title}
        </h1>
        {description && <p className="mt-3 text-base md:text-lg text-[var(--ink-2)] max-w-[60ch]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
    </div>
  </header>
)

// A figure with its label. Numbers are mono and tabular; icons are optional and quiet.
export const Stat = ({ label, value, unit, note, icon: Icon, tone = 'default', className }) => (
  <div className={cn('bg-[var(--surface)] border border-[var(--line)] rounded-xl px-5 py-4 flex flex-col gap-3 min-w-0', className)}>
    <div className="flex items-start justify-between gap-2">
      <p className="text-sm font-medium leading-snug text-[var(--ink-2)]">{label}</p>
      {Icon && (
        <Icon
          aria-hidden="true"
          className={cn('size-[18px] shrink-0', tone === 'warn' ? 'text-[var(--warn-ink)]' : tone === 'danger' ? 'text-[var(--danger)]' : 'text-[var(--ink-3)]')}
        />
      )}
    </div>
    <p className="figure text-[1.75rem] leading-none font-medium text-[var(--ink)]">
      {value}
      {unit && <span className="text-base text-[var(--ink-3)] ml-1">{unit}</span>}
    </p>
    {note && <p className="text-[0.8125rem] text-[var(--ink-3)] -mt-1">{note}</p>}
  </div>
)

export const StatGrid = ({ children, className }) => (
  <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4', className)}>{children}</div>
)

// Empty: say what is missing and give one way forward.
export const EmptyState = ({ icon: Icon = FileQuestion, title, description, action, className, compact = false }) => (
  <div className={cn('flex flex-col items-center text-center', compact ? 'py-8 px-4' : 'py-14 px-6', className)}>
    <span className="grid place-items-center size-12 rounded-full bg-[var(--sunk)] text-[var(--ink-2)] mb-4">
      <Icon className="size-5" aria-hidden="true" />
    </span>
    <p className="text-base font-semibold text-[var(--ink)]">{title}</p>
    {description && <p className="mt-1.5 text-sm text-[var(--ink-3)] max-w-[42ch]">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
)

// Not found / error: a quiet sentence with one way forward, never a red page.
export const ErrorState = ({ title = 'We could not find that', description, action, icon = SearchX }) => (
  <div className="container-page py-16 md:py-24">
    <div className="max-w-md mx-auto bg-[var(--surface)] border border-[var(--line)] rounded-2xl">
      <EmptyState icon={icon} title={title} description={description} action={action} />
    </div>
  </div>
)

export const Skeleton = ({ className }) => <div aria-hidden="true" className={cn('skeleton h-4', className)} />

// Loading frame shaped like a portal page: header, four figures, two panels.
export const PageSkeleton = () => (
  <div className="container-page py-8 md:py-12" role="status" aria-label="Loading">
    <Skeleton className="h-3 w-28 mb-3" />
    <Skeleton className="h-9 w-72 mb-10" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-[104px] rounded-xl" />)}
    </div>
    <div className="grid lg:grid-cols-3 gap-6">
      <Skeleton className="h-72 rounded-xl lg:col-span-2" />
      <Skeleton className="h-72 rounded-xl" />
    </div>
  </div>
)

// The Rx label: the identity's signature surface. A mono header line (code,
// dose, expiry) over a perforation, then the object itself.
export const RxLabel = ({ code, meta, status, children, className, as: Tag = 'div', ...props }) => (
  <Tag className={cn('bg-[var(--surface)] border border-[var(--line)] rounded-xl overflow-hidden', className)} {...props}>
    <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2.5">
      <p className="label-mono truncate">
        {code}
        {meta && <span> / {meta}</span>}
      </p>
      {status}
    </div>
    <div className="perforation" />
    <div className="px-4 py-3.5">{children}</div>
  </Tag>
)

// Section heading inside a page.
export const SectionTitle = ({ children, action, className, as: Tag = 'h2' }) => (
  <div className={cn('flex items-center justify-between gap-3 mb-4', className)}>
    <Tag className="text-lg font-semibold tracking-[-0.01em] text-[var(--ink)]">{children}</Tag>
    {action}
  </div>
)

// A single-series horizontal bar list. Every bar is direct-labelled with its
// value, so identity and magnitude never rely on colour. An optional `mark`
// draws a reference tick (a reorder level, a target) on each row.
export const BarList = ({ rows, max, format = (v) => v, markLabel, caption, className }) => {
  const top = max ?? Math.max(1, ...rows.map(r => Math.max(r.value, r.mark ?? 0)))
  return (
    <figure className={cn('m-0', className)}>
      <ul className="flex flex-col gap-3">
        {rows.map(r => {
          const pct = Math.max(1.5, (r.value / top) * 100)
          const low = r.mark != null && r.value <= r.mark
          return (
            <li key={r.label} className="group grid grid-cols-[minmax(0,9.5rem)_1fr_auto] sm:grid-cols-[minmax(0,12rem)_1fr_auto] items-center gap-3"
              title={`${r.label}: ${format(r.value)}${r.mark != null ? ` (${markLabel ?? 'mark'} ${format(r.mark)})` : ''}`}>
              <span className="text-sm text-[var(--ink-2)] truncate">{r.label}</span>
              <span className="relative h-3 rounded-[3px]" aria-hidden="true">
                <span
                  className={cn('absolute inset-y-0 left-0 rounded-[3px] transition-opacity group-hover:opacity-85', low ? 'bg-amber-500' : 'bg-[var(--pine)]')}
                  style={{ width: `${pct}%` }}
                />
                {r.mark != null && (
                  <span className="absolute -inset-y-1 w-0.5 rounded bg-[var(--ink)]" style={{ left: `${Math.min(100, (r.mark / top) * 100)}%` }} />
                )}
              </span>
              <span className="figure text-sm text-[var(--ink)] text-right min-w-[3ch]">
                {format(r.value)}
                {low && <span className="sr-only"> (at or below {markLabel})</span>}
              </span>
            </li>
          )
        })}
      </ul>
      {caption && <figcaption className="mt-4 text-[0.8125rem] text-[var(--ink-3)]">{caption}</figcaption>}
    </figure>
  )
}
