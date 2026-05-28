'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/compat/router'
import { Trophy, Calendar, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { toast } from '@/components/ui/Toast'
import { supabase } from '@/lib/supabaseClient'
import { formatDate, formatPrice, statusLabel, cn } from '@/lib/utils'

export function MyTournaments({ userId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase
      .from('tournament_registrations')
      .select('*, tournaments(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (!userId) return
    load()
    const channel = supabase
      .channel(`regs-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournament_registrations', filter: `user_id=eq.${userId}` }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [userId])

  const onCancel = async (reg) => {
    if (!confirm('Отказаться от участия? Возврат 50% от взноса.')) return
    const refund = Math.round((reg.tournaments?.entry_fee || 0) * 0.5)
    try {
      const { error } = await supabase
        .from('tournament_registrations')
        .update({
          payment_status: 'refunded',
          cancelled_at: new Date().toISOString(),
          refund_amount: refund,
        })
        .eq('id', reg.id)
      if (error) throw error
      toast.success(`Отказ принят. Возврат: ${formatPrice(refund)}`)
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) return <CardSkeleton />

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="Нет регистраций"
        description="Запишитесь на турнир и он появится здесь."
        action={
          <Link to="/tournaments">
            <Button variant="gold" size="md">К турнирам</Button>
          </Link>
        }
      />
    )
  }

  const now = Date.now()
  const active = items.filter((r) => r.payment_status !== 'refunded' && r.tournaments && new Date(r.tournaments.starts_at).getTime() > now)
  const history = items.filter((r) => r.payment_status === 'refunded' || (r.tournaments && new Date(r.tournaments.starts_at).getTime() <= now))

  return (
    <div className="space-y-6">
      <Section title="Активные">
        {active.length === 0 && <p className="text-muted text-sm">Нет активных турниров</p>}
        {active.map((r) => <RegCard key={r.id} reg={r} onCancel={() => onCancel(r)} />)}
      </Section>
      {history.length > 0 && (
        <Section title="История">
          {history.map((r) => <RegCard key={r.id} reg={r} historyMode />)}
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

function RegCard({ reg, onCancel, historyMode }) {
  const t = reg.tournaments
  const payVariant =
    reg.payment_status === 'paid' ? 'green'
    : reg.payment_status === 'pending' ? 'amber'
    : 'red'

  return (
    <Card className={cn('flex flex-wrap items-center justify-between gap-4', historyMode && 'opacity-70')}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-display font-semibold">{t?.title}</h4>
          <Badge variant={payVariant}>{statusLabel(reg.payment_status)}</Badge>
        </div>
        <div className="text-xs text-muted flex items-center gap-1">
          <Calendar size={12} /> {formatDate(t?.starts_at)}
        </div>
        {reg.refund_amount && (
          <p className="text-xs text-red-300 mt-1">
            Возврат {formatPrice(reg.refund_amount)}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-display font-bold text-brand-gold">{formatPrice(t?.entry_fee)}</span>
        {!historyMode && reg.payment_status === 'pending' && (
          <Link to={`/payment/tournament/${reg.id}`}>
            <Button variant="gold" size="sm">Оплатить</Button>
          </Link>
        )}
        {!historyMode && reg.payment_status !== 'refunded' && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X size={14} /> Отказаться
          </Button>
        )}
      </div>
    </Card>
  )
}