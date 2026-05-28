'use client'

import { cn } from '@/lib/utils'

export function Card({ className, children, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'glass rounded-2xl p-6 shadow-soft',
        hover && 'transition-all duration-300 hover:border-brand-gold/30 hover:shadow-glow-gold hover:-translate-y-1',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({ className, children }) {
  return (
    <h3 className={cn('text-xl font-display font-semibold text-brand-light', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children }) {
  return <p className={cn('text-sm text-muted mt-1', className)}>{children}</p>
}