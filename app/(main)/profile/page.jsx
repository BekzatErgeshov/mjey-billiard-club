'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import ProfilePage from '@/screens/Profile'

export default function Page() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  )
}
