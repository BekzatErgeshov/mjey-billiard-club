'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'

export function ProtectedRoute({ children, adminOnly = false }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, profile, loading, initialized } = useAuthStore()

  useEffect(() => {
    if (!initialized || loading) return
    if (!user) {
      router.replace(`/auth/login?from=${encodeURIComponent(pathname || '/')}`)
      return
    }
    if (adminOnly && profile?.role !== 'admin') {
      router.replace('/')
    }
  }, [user, profile, loading, initialized, adminOnly, router, pathname])

  if (!initialized || loading || !user || (adminOnly && profile?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return children
}
