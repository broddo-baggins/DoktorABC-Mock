import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import usersData from '../../data/users.json'
import { cn } from '../../utils/cn'

// Pieces shared by the five staff portals (Doctor, Pharmacy, Support,
// Customer Service). Public pages do not use these.

export const fmtDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

export const fmtTime = (value) =>
  value ? new Date(value).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '-'

export const fmtDateTime = (value) => (value ? `${fmtDate(value)}, ${fmtTime(value)}` : '-')

export const fmtNumber = (n) => (typeof n === 'number' ? n.toLocaleString('en-GB') : n ?? '-')

export const todayLine = () =>
  new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

// Staff see patients by name with their record ID beside it.
export const patientById = (id) => usersData.find(u => u.id === id)
export const patientName = (id) => patientById(id)?.name ?? 'Unknown patient'

export const countBy = (items, key) =>
  items.reduce((acc, item) => ({ ...acc, [item[key]]: (acc[item[key]] ?? 0) + 1 }), {})

// The pharmacy's words for the prescription statuses it moves orders through.
export const ORDER_STAGE = {
  pending: { label: 'New', variant: 'warning' },
  active: { label: 'Preparing', variant: 'primary' },
  filled: { label: 'Ready', variant: 'success' },
}

export const sentence = (s) => (s ? String(s).charAt(0).toUpperCase() + String(s).slice(1).replace(/-/g, ' ') : s)

// A panel: a titled card with an optional action on the right.
export const Panel = ({ title, action, children, className, bodyClassName, id }) => (
  <section className={cn('bg-[var(--surface)] border border-[var(--line)] rounded-xl min-w-0', className)} aria-labelledby={id}>
    <div className="flex items-center justify-between gap-3 px-5 md:px-6 h-14 border-b border-[var(--line)]">
      <h2 id={id} className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-[var(--ink)] truncate">{title}</h2>
      {action}
    </div>
    <div className={cn('px-5 md:px-6 py-4', bodyClassName)}>{children}</div>
  </section>
)

// Quiet text link used as a panel action ("View all").
export const PanelLink = ({ to, children }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1 h-9 px-2 -mr-2 rounded-md text-sm font-medium text-[var(--pine)] hover:text-[var(--pine-hover)] hover:bg-[var(--pine-wash)]"
  >
    {children}
    <ChevronRight className="size-4" aria-hidden="true" />
  </Link>
)

// A data table that becomes stacked label/value rows below 768 px.
// columns: [{ key, header, render?, className?, align?, primary?, mobileFooter? }]
// `wide` tables (seven or more columns) stay stacked up to 1024 px.
export const DataTable = ({ columns, rows, rowKey = 'id', caption, onRowClick, rowClassName, wide = false }) => (
  <>
    <div className={cn('relative -mx-5 md:-mx-6 overflow-x-auto', wide ? 'hidden lg:block' : 'hidden md:block')}>
      <table className="w-full text-sm border-collapse">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="text-left">
            {columns.map(c => (
              <th
                key={c.key}
                scope="col"
                className={cn(
                  'h-10 px-3 first:pl-5 md:first:pl-6 last:pr-5 md:last:pr-6 font-medium text-[0.8125rem] text-[var(--ink-3)] bg-[var(--paper)] border-b border-[var(--line)] whitespace-nowrap',
                  c.align === 'right' && 'text-right'
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line)]">
          {rows.map(row => (
            <tr
              key={row[rowKey]}
              className={cn('align-middle', onRowClick && 'cursor-pointer hover:bg-[var(--paper)]', rowClassName?.(row))}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map(c => (
                <td
                  key={c.key}
                  className={cn(
                    'px-3 py-3 first:pl-5 md:first:pl-6 last:pr-5 md:last:pr-6 text-[var(--ink)]',
                    c.align === 'right' && 'text-right',
                    c.className
                  )}
                >
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <ul className={cn('-mx-5 md:-mx-6 divide-y divide-[var(--line)]', wide ? 'lg:hidden' : 'md:hidden')} aria-label={caption}>
      {rows.map(row => {
        const primary = columns.find(c => c.primary) ?? columns[0]
        const rest = columns.filter(c => c !== primary && !c.mobileFooter)
        const footer = columns.filter(c => c.mobileFooter)
        return (
          <li key={row[rowKey]} className={cn('px-5 md:px-6 py-4', rowClassName?.(row))}>
            <div className="text-[var(--ink)]">{primary.render ? primary.render(row) : row[primary.key]}</div>
            {rest.length > 0 && (
              <dl className={cn('mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm', wide && 'md:grid-cols-4')}>
                {rest.map(c => (
                  <div key={c.key} className="min-w-0">
                    <dt className="text-[0.8125rem] text-[var(--ink-3)]">{c.header}</dt>
                    <dd className="text-[var(--ink)] mt-0.5 min-w-0 break-words">{c.render ? c.render(row) : row[c.key]}</dd>
                  </div>
                ))}
              </dl>
            )}
            {footer.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {footer.map(c => <React.Fragment key={c.key}>{c.render(row)}</React.Fragment>)}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  </>
)

// Filter tabs with counts. Real buttons with aria-pressed.
export const FilterTabs = ({ options, value, onChange, label }) => (
  <div role="group" aria-label={label} className="inline-flex flex-wrap gap-1 p-1 rounded-[10px] bg-[var(--sunk)]">
    {options.map(o => (
      <button
        key={o.value}
        type="button"
        aria-pressed={value === o.value}
        onClick={() => onChange(o.value)}
        className={cn(
          'inline-flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-medium transition-colors',
          value === o.value
            ? 'bg-[var(--surface)] text-[var(--ink)] shadow-[var(--shadow-1)]'
            : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
        )}
      >
        {o.label}
        {o.count != null && <span className="figure text-xs text-[var(--ink-3)]">{o.count}</span>}
      </button>
    ))}
  </div>
)

// Navigation rows: icon, label, hint, chevron. Used instead of stacks of outlined buttons.
export const ShortcutList = ({ items }) => (
  <ul className="-mx-5 md:-mx-6 -my-4 divide-y divide-[var(--line)]">
    {items.map(item => {
      const Icon = item.icon
      return (
        <li key={item.label}>
          <button
            type="button"
            onClick={item.onClick}
            className="group w-full flex items-center gap-3 px-5 md:px-6 py-3.5 text-left hover:bg-[var(--paper)] focus-visible:outline-offset-[-2px]"
          >
            {Icon && (
              <span className="grid place-items-center size-9 rounded-lg bg-[var(--pine-wash)] text-[var(--pine)] shrink-0">
                <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
              </span>
            )}
            <span className="flex-1 min-w-0">
              <span className="block text-[0.9375rem] font-medium text-[var(--ink)]">{item.label}</span>
              {item.hint && <span className="block text-[0.8125rem] text-[var(--ink-3)] truncate">{item.hint}</span>}
            </span>
            <ChevronRight className="size-4 text-[var(--ink-3)] group-hover:text-[var(--ink)] group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </button>
        </li>
      )
    })}
  </ul>
)

// A key/value record: label left, value right (mono unless { text: true }).
export const RecordList = ({ items }) => (
  <dl className="divide-y divide-[var(--line)] -my-1">
    {items.map(([label, value, opts]) => (
      <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
        <dt className="text-sm text-[var(--ink-2)] shrink-0">{label}</dt>
        <dd className={cn('text-sm text-[var(--ink)] text-right', !opts?.text && 'figure')}>{value}</dd>
      </div>
    ))}
  </dl>
)
