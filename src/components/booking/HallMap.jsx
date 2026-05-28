import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn, formatPrice, statusLabel } from '@/lib/utils'

const STATUS_STYLE = {
  available: 'bg-status-available/15 border-status-available/50 text-status-available hover:bg-status-available/25 hover:scale-105 cursor-pointer',
  booked: 'bg-status-booked/15 border-status-booked/50 text-status-booked cursor-not-allowed',
  live: 'bg-status-live/15 border-status-live/50 text-status-live cursor-not-allowed',
  maintenance: 'bg-white/5 border-white/10 text-brand-light/40 cursor-not-allowed',
  selected: 'bg-status-selected/25 border-status-selected text-status-selected scale-105 shadow-glow-gold',
}

export function HallMap({ tables, loading, selectedId, onSelect }) {
  if (loading) {
    return (
      <div className="glass-strong rounded-3xl p-6 aspect-[16/9]">
        <Skeleton className="w-full h-full" />
      </div>
    )
  }

  return (
    <div className="relative glass-strong rounded-3xl p-6 sm:p-8 overflow-hidden">
      <div className="absolute inset-0 bg-radial-green opacity-50 pointer-events-none" />
      <div
        className="relative w-full"
        style={{ minHeight: '480px', aspectRatio: '16 / 10' }}
      >
        <div className="absolute inset-3 sm:inset-6 rounded-2xl border-2 border-dashed border-white/10 pointer-events-none" />
        <span className="absolute top-3 left-4 text-[10px] uppercase tracking-[0.3em] text-brand-gold/60 pointer-events-none">
          схема зала
        </span>

        {tables.map((t, i) => {
          const styleKey = selectedId === t.id ? 'selected' : t.status
          return (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, type: 'spring' }}
              onClick={() => onSelect?.(t)}
              disabled={t.status !== 'available' && selectedId !== t.id}
              style={{
                left: `${t.position_x}%`,
                top: `${t.position_y}%`,
              }}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-1/2',
                'w-28 sm:w-32 h-20 sm:h-24 rounded-xl border-2',
                'transition-all duration-300 backdrop-blur-md',
                'flex flex-col items-center justify-center gap-1',
                STATUS_STYLE[styleKey],
              )}
            >
              <span className="font-display text-sm font-semibold">{t.name}</span>
              <span className="text-[10px] uppercase tracking-widest opacity-70">
                {statusLabel(t.status)}
              </span>
              <span className="text-[10px] opacity-60">{formatPrice(t.hourly_rate)}/ч</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
