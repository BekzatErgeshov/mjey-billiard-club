import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ToastViewport } from '@/components/ui/Toast'

import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'

import HomePage from '@/pages/Home'
import AboutPage from '@/pages/About'
import ClubRulesPage from '@/pages/ClubRules'
import GameRulesPage from '@/pages/GameRules'
import BookingPage from '@/pages/Booking'
import TournamentsPage from '@/pages/Tournaments'
import TournamentDetailPage from '@/pages/TournamentDetail'
import ContactsPage from '@/pages/Contacts'
import LoginPage from '@/pages/auth/Login'
import RegisterPage from '@/pages/auth/Register'
import ProfilePage from '@/pages/Profile'
import PaymentPage from '@/pages/Payment'

import AdminLayout from '@/pages/admin/AdminLayout'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminUsers from '@/pages/admin/AdminUsers'
import AdminBookings from '@/pages/admin/AdminBookings'
import AdminTournaments from '@/pages/admin/AdminTournaments'
import AdminTables from '@/pages/admin/AdminTables'
import AdminSessions from '@/pages/admin/AdminSessions'
import AdminFines from '@/pages/admin/AdminFines'
import AdminPayments from '@/pages/admin/AdminPayments'

export default function App() {
  const initAuth = useAuthStore((s) => s.init)
  const initTheme = useThemeStore((s) => s.init)

  useEffect(() => {
    initTheme()
    initAuth()
  }, [initAuth, initTheme])

  return (
    <>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="club-rules" element={<ClubRulesPage />} />
          <Route path="game-rules" element={<GameRulesPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="tournaments" element={<TournamentsPage />} />
          <Route path="tournaments/:id" element={<TournamentDetailPage />} />
          <Route path="contacts" element={<ContactsPage />} />

          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="payment/:type/:id"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="tournaments" element={<AdminTournaments />} />
            <Route path="tables" element={<AdminTables />} />
            <Route path="sessions" element={<AdminSessions />} />
            <Route path="fines" element={<AdminFines />} />
            <Route path="payments" element={<AdminPayments />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>

      <ToastViewport />
    </>
  )
}
