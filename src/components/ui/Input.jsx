'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Input = forwardRef(function Input(
  { className, type = 'text', error, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10',
        'text-brand-light placeholder:text-brand-light/40',
        'focus:outline-none focus:border-brand-gold/60 focus:bg-white/[0.06]',
        'transition-all duration-200',
        error && 'border-red-500/60 focus:border-red-500',
        className,
      )}
      {...props}
    />
  )
})

export function Label({ children, htmlFor, className }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-sm font-medium text-brand-light/80 mb-1.5', className)}
    >
      {children}
    </label>
  )
}

export function FieldError({ children }) {
  if (!children) return null
  return <p className="mt-1.5 text-xs text-red-400">{children}</p>
}