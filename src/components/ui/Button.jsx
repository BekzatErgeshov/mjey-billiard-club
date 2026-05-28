'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-brand text-brand-light hover:bg-brand-hover shadow-soft hover:shadow-glow-green',
  gold: 'bg-brand-gold text-brand-dark hover:brightness-110 shadow-soft hover:shadow-glow-gold font-semibold',
  outline: 'border border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10 hover:border-brand-gold',
  ghost: 'text-brand-light/80 hover:bg-white/5 hover:text-brand-light',
  danger: 'bg-red-600/90 text-white hover:bg-red-600 shadow-soft',
  glass: 'glass-strong text-brand-light hover:bg-white/[0.12]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
  xl: 'px-10 py-4 text-lg rounded-2xl',
  icon: 'w-10 h-10 rounded-xl flex items-center justify-center',
}

export const Button = forwardRef(function Button(
  { className, variant = 'primary', size = 'md', loading = false, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none',
        'ring-focus active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
})