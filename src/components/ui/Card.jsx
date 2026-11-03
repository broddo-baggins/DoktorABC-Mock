import React from 'react'
import { cn } from '../../utils/cn'

// Cards are for grouped content that needs an edge. A clickable card is a
// real button for keyboard users and lifts its edge on hover, never its body.
export const Card = ({ className, children, onClick, ...props }) => {
  const interactive = Boolean(onClick)
  return (
    <div
      className={cn(
        'bg-[var(--surface)] rounded-xl border border-[var(--line)] overflow-hidden',
        interactive &&
          'cursor-pointer transition-[border-color,box-shadow] duration-[var(--dur-base)] hover:border-[var(--line-strong)] hover:shadow-[var(--shadow-2)]',
        className
      )}
      onClick={onClick}
      {...(interactive && {
        role: props.role ?? 'button',
        tabIndex: props.tabIndex ?? 0,
        onKeyDown: (e) => {
          if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onClick(e)
          }
        },
      })}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ className, children, ...props }) => (
  <div
    className={cn('px-5 pt-5 pb-4 md:px-6 border-b border-[var(--line)] flex items-center justify-between gap-3 flex-wrap', className)}
    {...props}
  >
    {children}
  </div>
)

export const CardTitle = ({ className, children, as: Tag = 'h2', ...props }) => (
  <Tag className={cn('text-[1.0625rem] font-semibold text-[var(--ink)] tracking-[-0.01em]', className)} {...props}>
    {children}
  </Tag>
)

export const CardContent = ({ className, children, ...props }) => (
  <div className={cn('px-5 py-4 md:px-6', className)} {...props}>
    {children}
  </div>
)

export const CardFooter = ({ className, children, ...props }) => (
  <div className={cn('px-5 py-4 md:px-6 bg-[var(--paper)] border-t border-[var(--line)]', className)} {...props}>
    {children}
  </div>
)
