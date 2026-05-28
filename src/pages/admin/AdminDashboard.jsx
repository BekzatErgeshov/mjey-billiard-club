import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, Trophy, AlertOctagon, Activity, Coins } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { supabase } from '@/lib/supabaseClient'
import { formatPrice } from '@/lib/utils'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    bookings: 0,
    pendingPayments: 0,
    tournaments: 0,
    unpaidFines: 0,
    liveSessions: 0,
    revenueToday: 0,
  })

  useEffect(() => {
    const load = async () => {
      const [
        users,
        bookings,
        pending,
        tournaments,
        fines,
        sessions,
        todayPayments,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        supabase.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('tournaments').select('id', { count: 'exact', head: true }).eq('status', 'upcoming'),
        supabase.from('fines').select('id', { count: 'exact', head: true }).eq('status', 'unpaid'),
        supabase.from('live_sessions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('payments').select('amount').eq('status', 'approved').gte('reviewed_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
      ])

      const revenue = (todayPayments.data || []).reduce((sum, p) => sum + Number(p.amount || 0), 0)

      setStats({
        users: users.count || 0,
        bookings: bookings.count || 0,
        pendingPayments: pending.count || 0,
        tournaments: tournaments.count || 0,
        unpaidFines: fines.count || 0,
        liveSessions: sessions.count || 0,
        revenueToday: revenue,
      })
    }
    load()
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public' }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const cards = [
    { icon: Users, label: 'Пользователи', value: stats.users, color: 'text-blue-300' },
    { icon: Calendar, label: 'Брони (всего)', value: stats.bookings, color: 'text-brand-gold' },
    { icon: Activity, label: 'Live сейчас', value: stats.liveSessions, color: 'text-status-live' },
    { icon: Trophy, label: 'Турниров скоро', value: stats.tournaments, color: 'text-purple-300' },
    { icon: AlertOctagon, label: 'Неоплаченных штрафов', value: stats.unpaidFines, color: 'text-red-300' },
    { icon: Coins, label: 'На проверке', value: stats.pendingPayments, color: 'text-amber-300' },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-br from-brand-gold/15 to-transparent border-brand-gold/30">
          <div className="text-xs uppercase tracking-[0.2em] text-brand-gold/80">Выручка сегодня</div>
          <div className="text-4xl font-display font-bold text-gradient-gold mt-1">
            {formatPrice(stats.revenueToday)}
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card hover>
              <c.icon className={c.color} size={22} />
              <div className="mt-3 text-3xl font-display font-bold text-brand-light">{c.value}</div>
              <div className="text-xs text-muted mt-1">{c.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
