import React from 'react'
import { cn } from '../../utils/cn'

// The DoktorABC mark: a pine tile carrying the dispensary cross.
export const LogoMark = ({ className, size = 28, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    className={className}
    role={title ? 'img' : undefined}
    aria-hidden={title ? undefined : true}
    aria-label={title}
  >
    <rect width="28" height="28" rx="7" fill="var(--pine)" />
    <rect x="11.25" y="6" width="5.5" height="16" rx="1.5" fill="var(--on-pine)" />
    <rect x="6" y="11.25" width="16" height="5.5" rx="1.5" fill="var(--on-pine)" />
  </svg>
)

const Logo = ({ className, inverted = false }) => (
  <span className={cn('inline-flex items-center gap-2.5', className)}>
    <LogoMark />
    <span
      className={cn(
        'text-[1.1875rem] font-[650] tracking-[-0.02em] leading-none',
        inverted ? 'text-[var(--ink-on-dark)]' : 'text-[var(--ink)]'
      )}
    >
      Doktor<span className={inverted ? 'text-pine-300' : 'text-[var(--pine)]'}>ABC</span>
    </span>
  </span>
)

export default Logo
