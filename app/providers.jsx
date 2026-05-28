'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { ToastViewport } from '@/components/ui/Toast'

export function Providers({ children }) {
  const initAuth = useAuthStore((s) => s.init)
  const initTheme = useThemeStore((s) => s.init)

  useEffect(() => {
    initTheme()
    initAuth()
  }, [initAuth, initTheme])

  return (
    <>
      {children}
      <ToastViewport />
    </>
  )
}
