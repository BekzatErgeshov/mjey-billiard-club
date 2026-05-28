'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import PaymentPage from '@/screens/Payment'

export default function Page() {
  return (
    <ProtectedRoute>
      <PaymentPage />
    </ProtectedRoute>
  )
}
