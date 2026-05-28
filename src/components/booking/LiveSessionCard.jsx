import { useLiveTimer } from '@/hooks/useLiveTimer'
import { Activity, Square } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'

export function LiveSessionCard({ session, tableName, canStop, onStop }) {
  const { elapsedHours, formatted, elapsedMinutes } = useLiveTimer(session.started_at)
  const currentPrice = Math.round((elapsedMinutes / 60) * session.hourly_rate)

  return (
    <Card className="border-status-live/30">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <Badge variant="amber" className="mb-2">
            <Activity size={12} className="animate-pulse" /> LIVE
          </Badge>
          <h3 className="font-display text-xl font-semibold">{tableName}</h3>
          <p className="text-xs text-muted mt-1">
            Тариф: {formatPrice(session.hourly_rate)}/ч
          </p>
        </div>
        {canStop && (
          <Button variant="danger" size="sm" onClick={() => onStop?.(session)}>
            <Square size={14} /> Стоп
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="glass rounded-xl p-4">
          <div className="text-xs uppercase tracking-wider text-muted mb-1">Таймер</div>
          <div className="text-2xl font-display font-bold text-status-live tabular-nums">
            {formatted}
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="text-xs uppercase tracking-wider text-muted mb-1">К оплате</div>
          <div className="text-2xl font-display font-bold text-brand-gold tabular-nums">
            {formatPrice(currentPrice)}
          </div>
        </div>
      </div>
    </Card>
  )
}
