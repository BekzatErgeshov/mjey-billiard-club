import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, Coins } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input, Label, FieldError } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/authStore'
import { hoursBetween, calculatePrice, formatPrice, formatDuration } from '@/lib/utils'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function BookingModal({ table, open, onClose }) {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [date, setDate] = useState(todayIso())
  const [start, setStart] = useState('18:00')
  const [end, setEnd] = useState('20:00')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasUnpaidFines, setHasUnpaidFines] = useState(false)

  useEffect(() => {
    if (!user || !open) return
    ;(async () => {
      const { count } = await supabase
        .from('fines')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'unpaid')
      setHasUnpaidFines((count || 0) > 0)
    })()
  }, [user, open])

  const { startAt, endAt, hours, price, valid } = useMemo(() => {
    if (!table) return { hours: 0, price: 0, valid: false }
    const s = new Date(`${date}T${start}:00`)
    const e = new Date(`${date}T${end}:00`)
    const h = hoursBetween(s, e)
    const p = calculatePrice(h, table.hourly_rate)
    return { startAt: s, endAt: e, hours: h, price: p, valid: h > 0 && s > new Date() }
  }, [table, date, start, end])

  const onSubmit = async () => {
    setError('')
    if (hasUnpaidFines) {
      setError('У вас есть неоплаченные штрафы. Оплатите их перед бронированием.')
      return
    }
    if (!valid) {
      setError('Проверьте дату и время — начало должно быть в будущем, а конец позже начала.')
      return
    }
    setLoading(true)
    try {
      const { data: booking, error: insErr } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          table_id: table.id,
          start_time: startAt.toISOString(),
          end_time: endAt.toISOString(),
          duration_hours: hours,
          total_price: price,
          status: 'pending',
          payment_status: 'unpaid',
        })
        .select()
        .single()
      if (insErr) throw insErr
      toast.success('Бронь создана! Перейдите к оплате.')
      onClose()
      navigate(`/payment/booking/${booking.id}`)
    } catch (err) {
      setError(err.message || 'Не удалось создать бронь')
    } finally {
      setLoading(false)
    }
  }

  if (!table) return null

  return (
    <Modal open={open} onClose={onClose} title={`Бронь — ${table.name}`} size="md">
      {hasUnpaidFines && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-200">
          ⚠ У вас есть неоплаченные штрафы. Бронь недоступна.
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="date">Дата</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light/40" size={18} />
            <Input
              id="date"
              type="date"
              min={todayIso()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="start">Начало</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light/40" size={18} />
              <Input
                id="start"
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="end">Конец</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light/40" size={18} />
              <Input
                id="end"
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 space-y-3">
          <Row label="Стол" value={table.name} />
          <Row label="Тариф" value={`${formatPrice(table.hourly_rate)} / час`} />
          <Row label="Длительность" value={formatDuration(hours * 60)} />
          <div className="h-px bg-white/10" />
          <Row
            label="Итого"
            value={<span className="text-2xl font-display font-bold text-brand-gold">{formatPrice(price)}</span>}
            bold
          />
          <div className="flex items-start gap-2 text-xs text-muted pt-1">
            <Coins size={12} className="mt-0.5 text-brand-gold/70" />
            Оплата подтверждается админом после загрузки чека.
          </div>
        </div>

        <FieldError>{error}</FieldError>

        <div className="flex gap-2 pt-2">
          <Button variant="ghost" size="lg" className="flex-1" onClick={onClose}>
            Отмена
          </Button>
          <Button
            variant="gold"
            size="lg"
            className="flex-1"
            loading={loading}
            disabled={!valid || hasUnpaidFines}
            onClick={onSubmit}
          >
            К оплате
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? 'text-brand-light' : 'text-sm text-muted'}>{label}</span>
      <span className={bold ? '' : 'text-brand-light/90'}>{value}</span>
    </div>
  )
}
