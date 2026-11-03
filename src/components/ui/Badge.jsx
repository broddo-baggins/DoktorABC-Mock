import React from 'react'
import { cn } from '../../utils/cn'

// Status tags read like the printed line on a pharmacy label: mono, small caps,
// square-cornered. Colour carries state only; the word always says it too.
const tones = {
  default: 'bg-[var(--sunk)] text-[var(--ink-2)]',
  primary: 'bg-[var(--pine-tint)] text-[var(--pine-hover)]',
  accent: 'bg-[var(--pine-tint)] text-[var(--pine-hover)]',
  success: 'bg-[var(--pine-tint)] text-[var(--pine-hover)]',
  warning: 'bg-[var(--warn-tint)] text-[var(--warn-ink)]',
  danger: 'bg-[var(--danger-tint)] text-[var(--danger-ink)]',
  info: 'bg-[var(--sunk)] text-[var(--ink-2)]',
  outline: 'border border-[var(--line-strong)] text-[var(--ink-2)]',
}

// Maps the mock data's status words onto tones, so pages need not.
const statusTone = {
  active: 'success', completed: 'success', delivered: 'success', resolved: 'success', approved: 'success',
  'in stock': 'success', operational: 'success', confirmed: 'success', paid: 'success',
  scheduled: 'primary', 'in-progress': 'primary', processing: 'primary', shipped: 'primary', 'in transit': 'primary',
  pending: 'warning', open: 'warning', medium: 'warning', 'low stock': 'warning', 'pending review': 'warning', degraded: 'warning',
  urgent: 'danger', high: 'danger', critical: 'danger', cancelled: 'danger', rejected: 'danger', 'out of stock': 'danger', expired: 'danger',
  low: 'default', closed: 'default',
}

export const toneFor = (status) => statusTone[String(status ?? '').toLowerCase()] ?? 'default'

const Badge = ({ className, variant, status, children, ...props }) => {
  const tone = variant ?? (status ? toneFor(status) : 'default')
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 h-[22px] px-2 rounded-[var(--radius-tag)] font-mono text-[11px] font-medium uppercase tracking-[0.05em] whitespace-nowrap',
        tones[tone] ?? tones.default,
        className
      )}
      {...props}
    >
      {children ?? status}
    </span>
  )
}

export default Badge
