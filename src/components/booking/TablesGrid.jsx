import { motion } from 'framer-motion'
import { Circle, Activity, Lock, Wrench } from 'lucide-react'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn, formatPrice, statusLabel } from '@/lib/utils'

const TYPE_LABEL = { pool: 'Pool', snooker: 'Snooker', russian: 'Русский' }

const STATUS_META = {
  available: {
    badge: 'green',
    icon: Circle,
    border: 'border-status-available/40',
    glow: 'hover:shadow-glow-green',
    btnLabel: 'Забронировать',
    btnVariant: 'gold',
  },
  booked: {
    badge: 'red',
    icon: Lock,
    border: 'border-status-booked/30',
    glow: '',
    btnLabel: 'Занят',
    btnVariant: 'glass',
  },
  live: {
    badge: 'amber',
    icon: Activity,
    border: 'border-status-live/40',
    glow: '',
    btnLabel: 'Идёт игра',
    btnVariant: 'glass',
  },
  maintenance: {
    badge: 'default',
    icon: Wrench,
    border: 'border-white/10',
    glow: '',
    btnLabel: 'На обслуживании',
    btnVariant: 'glass',
  },
}

export function TablesGrid({ tables, loading, onSelect, selectedId }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {tables.map((t, i) => {
        const meta = STATUS_META[t.status] || STATUS_META.available
        const Icon = meta.icon
        const isSelected = selectedId === t.id
        const canSelect = t.status === 'available'

        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              'glass rounded-2xl p-6 border-2 transition-all duration-300',
              meta.border,
              canSelect && 'hover:-translate-y-1',
              meta.glow,
              isSelected && 'border-brand-gold/70 shadow-glow-gold scale-[1.02]',
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="text-2xl font-display font-bold text-brand-light">{t.name}</h3>
                <p className="text-xs text-muted mt-1">{TYPE_LABEL[t.table_type] || t.table_type}</p>
              </div>
              <Badge variant={meta.badge}>
                <Icon size={12} className={t.status === 'live' ? 'animate-pulse' : ''} />
                {statusLabel(t.status)}
              </Badge>
            </div>

            <div className="glass rounded-xl px-4 py-3 mb-5">
              <div className="text-xs uppercase tracking-wider text-muted">Тариф</div>
              <div className="text-2xl font-display font-bold text-brand-gold">
                {formatPrice(t.hourly_rate)}<span className="text-sm text-muted font-normal"> / час</span>
              </div>
            </div>

            <Button
              variant={meta.btnVariant}
              size="lg"
              className="w-full"
              disabled={!canSelect}
              onClick={() => canSelect && onSelect?.(t)}
            >
              {meta.btnLabel}
            </Button>
          </motion.div>
        )
      })}
    </div>
  )
}
