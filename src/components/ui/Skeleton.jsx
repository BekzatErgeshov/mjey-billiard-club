'use client'

import { cn } from '@/lib/utils'

export function Skeleton({ className }) {
  return <div className={cn('shimmer-bg rounded-lg', className)} />
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-10 w-32 mt-2" />
    </div>
  )
}