import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export function FreeTablesCounter() {
  const [stats, setStats] = useState({ total: 0, free: 0, live: 0, booked: 0, loading: true })

  const load = async () => {
    const { data } = await supabase.from('billiard_tables').select('status').eq('is_active', true)
    if (!data) return setStats((s) => ({ ...s, loading: false }))
    const counts = data.reduce(
      (acc, t) => {
        acc.total++
        if (t.status === 'available') acc.free++
        if (t.status === 'live') acc.live++
        if (t.status === 'booked') acc.booked++
        return acc
      },
      { total: 0, free: 0, live: 0, booked: 0 },
    )
    setStats({ ...counts, loading: false })
  }

  useEffect(() => {
    load()
    const channel = supabase
      .channel('home-tables')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'billiard_tables' }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const items = [
    { label: 'Всего столов', value: stats.total, color: 'text-brand-gold' },
    { label: 'Свободно сейчас', value: stats.free, color: 'text-status-available' },
    { label: 'Идёт игра', value: stats.live, color: 'text-status-live' },
    { label: 'Забронировано', value: stats.booked, color: 'text-status-booked' },
  ]

  return (
    <section className="container-app py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-strong rounded-3xl p-8 sm:p-12"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-status-available animate-pulse" />
          <span className="text-xs uppercase tracking-[0.3em] text-brand-gold">
            Live статус зала
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((it) => (
            <div key={it.label}>
              <div className={`text-4xl sm:text-5xl font-display font-bold ${it.color}`}>
                {stats.loading ? '—' : it.value}
              </div>
              <div className="mt-1 text-sm text-muted">{it.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-2 text-xs text-muted">
          <Activity size={14} className="text-brand-gold" />
          Обновляется в реальном времени
        </div>
      </motion.div>
    </section>
  )
}
