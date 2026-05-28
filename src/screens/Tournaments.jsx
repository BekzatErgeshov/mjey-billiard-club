'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/compat/router'
import { motion } from 'framer-motion'
import { Trophy, Calendar, Users, ArrowRight, Filter } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { supabase } from '@/lib/supabaseClient'
import { formatDate, formatPrice, statusLabel } from '@/lib/utils'
import { cn } from '@/lib/utils'

const FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'upcoming', label: 'Скоро' },
  { key: 'live', label: 'Идёт' },
  { key: 'finished', label: 'Завершены' },
]

export default function TournamentsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('tournaments')
        .select('*')
        .order('starts_at', { ascending: true })
      setItems(data || [])
      setLoading(false)
    }
    load()
    const channel = supabase
      .channel('tournaments-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournaments' }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const filtered = filter === 'all' ? items : items.filter((t) => t.status === filter)

  return (
    <>
      <PageHeader
        eyebrow="Турниры"
        title="Все турниры клуба"
        description="Регистрируйтесь, играйте, побеждайте. Призовой фонд растёт с каждым турниром."
      />

      <section className="container-app py-8">
        <div className="flex items-center gap-2 mb-8">
          <Filter size={16} className="text-brand-gold mr-1" />
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition',
                filter === f.key
                  ? 'bg-brand-gold text-brand-dark'
                  : 'glass text-brand-light/70 hover:bg-white/10',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="Пока нет турниров"
            description="Турниры появятся скоро. Загляните чуть позже."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <TournamentCard tournament={t} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

function TournamentCard({ tournament: t }) {
  const isFull = t.participants_count >= t.max_participants
  const statusVariant =
    t.status === 'live' ? 'amber' : t.status === 'finished' ? 'default' : 'gold'

  return (
    <Card hover className="h-full flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-4">
        <Badge variant={statusVariant}>
          <Trophy size={12} /> {statusLabel(t.status)}
        </Badge>
        <Badge variant="outline">{t.format?.toUpperCase()}</Badge>
      </div>

      <h3 className="text-xl font-display font-semibold text-brand-light mb-2">{t.title}</h3>
      <p className="text-sm text-muted line-clamp-2 mb-5">{t.description}</p>

      <div className="space-y-2 text-sm mb-6 mt-auto">
        <div className="flex items-center gap-2 text-brand-light/85">
          <Calendar size={15} className="text-brand-gold" /> {formatDate(t.starts_at)}
        </div>
        <div className="flex items-center gap-2 text-brand-light/85">
          <Users size={15} className="text-brand-gold" />
          {t.participants_count} / {t.max_participants} участников
        </div>
        <div className="text-brand-gold text-base font-semibold pt-1">
          Призовой фонд: {formatPrice(t.prize_pool)}
        </div>
        <div className="text-xs text-muted">
          Взнос: {formatPrice(t.entry_fee)}
        </div>
      </div>

      <Link to={`/tournaments/${t.id}`}>
        <Button variant={isFull ? 'glass' : 'gold'} size="md" className="w-full" disabled={isFull || t.status === 'finished'}>
          {isFull ? 'Мест нет' : t.status === 'finished' ? 'Завершён' : 'Подробнее'} <ArrowRight size={16} />
        </Button>
      </Link>
    </Card>
  )
}