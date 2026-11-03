import React from 'react'
import { cn } from '../../utils/cn'

// One primary (pine) action per view. `accent` and `outline` are kept as
// aliases so older call sites resolve to the same two-tier system.
const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium select-none ' +
    'transition-[background-color,border-color,color,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)] ' +
    'active:translate-y-px disabled:cursor-not-allowed disabled:active:translate-y-0 ' +
    // Disabled reads as "not yet", still legible: ink-3 on sunk is 4.96:1.
    'disabled:bg-[var(--sunk)] disabled:text-[var(--ink-3)] disabled:border-[var(--line)] disabled:hover:bg-[var(--sunk)] ' +
    '[&_svg]:size-[1.1em] [&_svg]:shrink-0'

  const primary = 'bg-[var(--pine)] text-[var(--on-pine)] hover:bg-[var(--pine-hover)] active:bg-[var(--pine-press)]'
  const secondary =
    'bg-[var(--surface)] text-[var(--ink)] border border-[var(--line-strong)] hover:bg-[var(--sunk)] hover:border-[var(--ink-3)]'

  const variants = {
    primary,
    accent: primary,
    secondary,
    outline: secondary,
    ghost: 'text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--sunk)]',
    danger: 'bg-[var(--danger)] text-[var(--on-pine)] hover:bg-[var(--danger-ink)]',
    'danger-quiet': 'text-[var(--danger-ink)] border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--danger-tint)] hover:border-[var(--danger)]',
  }

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-[0.9375rem]',
    lg: 'h-[52px] px-6 text-base',
  }

  return (
    <button
      className={cn(baseStyles, variants[variant] ?? primary, sizes[size], className)}
      ref={ref}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
