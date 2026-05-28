import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Activity } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { useTables } from '@/hooks/useTables'
import { TablesGrid } from '@/components/booking/TablesGrid'
import { BookingModal } from '@/components/booking/BookingModal'
import { useAuthStore } from '@/stores/authStore'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export default function BookingPage() {
  const { tables, loading } = useTables()
  const { user } = useAuthStore()
  const [selected, setSelected] = useState(null)

  return (
    <>
      <PageHeader
        eyebrow="Бронирование"
        title="Выберите стол"
        description="Выберите свободный стол и забронируйте удобное время."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Legend color="bg-status-available" label="Свободен" />
          <Legend color="bg-status-booked" label="Забронирован" />
          <Legend color="bg-status-live" label="Идёт игра" />
        </div>
      </PageHeader>

      <section className="container-app py-8">
        {!user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-strong rounded-2xl p-5 mb-8 flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <Calendar className="text-brand-gold" />
              <span className="text-sm text-brand-light/90">
                Чтобы забронировать стол, войдите в свой аккаунт.
              </span>
            </div>
            <div className="flex gap-2">
              <Link to="/auth/login"><Button variant="ghost" size="sm">Войти</Button></Link>
              <Link to="/auth/register"><Button variant="gold" size="sm">Регистрация</Button></Link>
            </div>
          </motion.div>
        )}

        <TablesGrid
          tables={tables}
          loading={loading}
          selectedId={selected?.id}
          onSelect={(t) => user && setSelected(t)}
        />

        <div className="mt-8 flex items-center gap-2 text-xs text-muted">
          <Activity size={14} className="text-brand-gold" />
          Статусы столов обновляются в реальном времени
        </div>
      </section>

      <BookingModal
        table={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
  )
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-brand-light/70">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      {label}
    </div>
  )
}
