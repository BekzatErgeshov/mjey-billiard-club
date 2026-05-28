import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { toast } from '@/components/ui/Toast'
import { supabase } from '@/lib/supabaseClient'
import { formatDateTime, formatPrice, formatDuration, statusLabel, cn } from '@/lib/utils'

export function MyBookings({ userId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*, billiard_tables(name)')
      .eq('user_id', userId)
      .order('start_time', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (!userId) return
    load()
    const channel = supabase
      .channel(`bookings-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `user_id=eq.${userId}` }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [userId])

  const onCancel = async (booking) => {
    if (!confirm('Отменить бронь? Возврат составит 50% от суммы.')) return
    const refund = Math.round(booking.total_price * 0.5)
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          refund_amount: refund,
        })
        .eq('id', booking.id)
      if (error) throw error
      toast.success(`Бронь отменена. Возврат: ${formatPrice(refund)}`)
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const now = Date.now()
  const active = items.filter((b) => b.status !== 'cancelled' && new Date(b.end_time).getTime() > now)
  const history = items.filter((b) => b.status === 'cancelled' || new Date(b.end_time).getTime() <= now)

  if (loading) return <CardSkeleton />

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="Пока нет броней"
        description="Забронируйте свой первый стол и он появится здесь."
        action={
          <Link to="/booking">
            <Button variant="gold" size="md">Забронировать стол</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <Section title="Активные">
        {active.length === 0 && <p className="text-muted text-sm">Нет активных броней</p>}
        {active.map((b) => (
          <BookingCard key={b.id} booking={b} onCancel={() => onCancel(b)} />
        ))}
      </Section>

      {history.length > 0 && (
        <Section title="История">
          {history.map((b) => (
            <BookingCard key={b.id} booking={b} historyMode />
          ))}
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-sm uppercase tracking-wider text-brand-gold mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function BookingCard({ booking, onCancel, historyMode }) {
  const payVariant =
    booking.payment_status === 'paid' ? 'green'
    : booking.payment_status === 'pending' ? 'amber'
    : 'red'

  return (
    <Card
      className={cn(
        'flex flex-wrap items-center justify-between gap-4',
        historyMode && 'opacity-70',
      )}
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-display font-semibold">{booking.billiard_tables?.name}</h4>
          <Badge variant={payVariant}>{statusLabel(booking.payment_status)}</Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted flex-wrap">
          <span className="flex items-center gap-1"><Calendar size={12} /> {formatDateTime(booking.start_time)}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {formatDuration(booking.duration_hours * 60)}</span>
        </div>
        {booking.status === 'cancelled' && (
          <p className="text-xs text-red-300 mt-1">
            Отменена • Возврат {formatPrice(booking.refund_amount || 0)}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="font-display font-bold text-brand-gold text-lg">
          {formatPrice(booking.total_price)}
        </span>
        {!historyMode && booking.payment_status === 'unpaid' && (
          <Link to={`/payment/booking/${booking.id}`}>
            <Button variant="gold" size="sm">Оплатить</Button>
          </Link>
        )}
        {!historyMode && booking.status !== 'cancelled' && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X size={14} /> Отменить
          </Button>
        )}
      </div>
    </Card>
  )
}
