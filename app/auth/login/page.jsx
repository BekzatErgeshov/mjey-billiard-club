import { Suspense } from 'react'
import LoginPage from '@/screens/auth/Login'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  )
}

