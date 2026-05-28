'use client'

import { cn } from '@/lib/utils'

export function Avatar({ src, name, size = 'md', className }) {
  const sizes = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-2xl',
  }
  const initials = (name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden bg-gradient-to-br from-brand to-brand-hover',
        'flex items-center justify-center text-brand-light font-semibold',
        'border border-white/15 shrink-0',
        sizes[size],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name || ''} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}