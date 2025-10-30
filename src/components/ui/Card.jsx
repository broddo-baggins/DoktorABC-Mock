import React from 'react'
import { cn } from '../../utils/cn'

export const Card = ({ className, children, onClick, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-md border border-neutral-200/50 overflow-hidden backdrop-blur-sm',
        onClick && 'cursor-pointer hover:shadow-xl hover:border-primary-300 transition-all duration-300 hover:-translate-y-1',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('px-6 py-5 border-b border-neutral-200/50', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3
      className={cn('text-lg font-bold text-neutral-900 tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export const CardFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('px-6 py-4 bg-neutral-50/50 border-t border-neutral-200/50', className)}
      {...props}
    >
      {children}
    </div>
  )
}

