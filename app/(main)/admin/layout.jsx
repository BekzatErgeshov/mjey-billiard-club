'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import AdminLayout from '@/screens/admin/AdminLayout'

export default function AdminGroupLayout({ children }) {
  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  )
}
