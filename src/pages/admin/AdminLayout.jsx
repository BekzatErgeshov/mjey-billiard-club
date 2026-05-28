import { NavLink, Outlet } from 'react-router-dom'
import { Users, Calendar, Trophy, Activity, AlertOctagon, CircleDot, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const LINKS = [
  { to: '/admin', label: 'Обзор', icon: Activity, end: true },
  { to: '/admin/users', label: 'Пользователи', icon: Users },
  { to: '/admin/bookings', label: 'Брони', icon: Calendar },
  { to: '/admin/tournaments', label: 'Турниры', icon: Trophy },
  { to: '/admin/tables', label: 'Столы', icon: CircleDot },
  { to: '/admin/sessions', label: 'Live-сессии', icon: Activity },
  { to: '/admin/fines', label: 'Штрафы', icon: AlertOctagon },
  { to: '/admin/payments', label: 'Платежи', icon: ShieldCheck },
]

export default function AdminLayout() {
  return (
    <div className="pt-24 pb-12 container-app">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gradient-gold">Админ-панель</h1>
        <p className="text-muted text-sm mt-1">Управление клубом</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <aside>
          <nav className="glass rounded-2xl p-2 space-y-0.5 sticky top-24">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition',
                    isActive
                      ? 'bg-brand-gold/15 text-brand-gold'
                      : 'text-brand-light/70 hover:bg-white/5 hover:text-brand-light',
                  )
                }
              >
                <l.icon size={16} />
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
