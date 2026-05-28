'use client'

import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-white/10 text-brand-light/80',
  gold: 'bg-brand-gold/20 text-brand-gold border border-brand-gold/30',
  green: 'bg-green-500/20 text-green-300 border border-green-500/30',
  red: 'bg-red-500/20 text-red-300 border border-red-500/30',
  amber: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  outline: 'border border-white/20 text-brand-light/80',
}

export function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}