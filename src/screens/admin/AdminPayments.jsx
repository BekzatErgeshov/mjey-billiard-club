'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { EmptyState } from '@/components/ui/EmptyState'
import { supabase } from '@/lib/supabaseClient'
import { formatDateTime, formatPrice, statusLabel } from '@/lib/utils'

const FILTERS = ['pending', 'approved', 'rejected']

export default function AdminPayments() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('payments')
      .select('*, profiles:user_id(username, email)')
      .eq('status', filter)
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    const channel = supabase
      .channel('admin-payments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [filter])

  const review = async (p, approved) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const status = approved ? 'approved' : 'rejected'
      const { error } = await supabase
        .from('payments')
        .update({ status, reviewed_by: user.id, reviewed_at: new Date().toISOString() })
        .eq('id', p.id)
      if (error) throw error

      if (approved) {
        if (p.payment_type === 'booking') {
          await supabase.from('bookings').update({ payment_status: 'paid', status: 'confirmed' }).eq('id', p.reference_id)
        } else if (p.payment_type === 'tournament') {
          await supabase.from('tournament_registrations').update({ payment_status: 'paid' }).eq('id', p.reference_id)
          const { data: reg } = await supabase
            .from('tournament_registrations')
            .select('tournament_id, tournaments(participants_count)')
            .eq('id', p.reference_id)
            .single()
          if (reg) {
            await supabase
              .from('tournaments')
              .update({ participants_count: (reg.tournaments?.participants_count || 0) + 1 })
              .eq('id', reg.tournament_id)
          }
        } else if (p.payment_type === 'fine') {
          await supabase.from('fines').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', p.reference_id)
        }
      } else {
        if (p.payment_type === 'booking') {
          await supabase.from('bookings').update({ payment_status: 'unpaid' }).eq('id', p.reference_id)
        } else if (p.payment_type === 'tournament') {
          await supabase.from('tournament_registrations').update({ payment_status: 'rejected' }).eq('id', p.reference_id)
        } else if (p.payment_type === 'fine') {
          await supabase.from('fines').update({ status: 'unpaid' }).eq('id', p.reference_id)
        }
      }

      toast.success(approved ? 'Оплата подтверждена' : 'Оплата отклонена')
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const typeLabel = (t) =>
    t === 'booking' ? 'Бронь' : t === 'tournament' ? 'Турнир' : 'Штраф'

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === f ? 'bg-brand-gold text-brand-dark' : 'glass text-brand-light/70'
            }`}
          >
            {statusLabel(f)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted">Загрузка...</div>
      ) : items.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="Платежей нет" description="В этой категории сейчас пусто." />
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <Card key={p.id} className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[220px]">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant="gold">{typeLabel(p.payment_type)}</Badge>
                  <Badge variant={p.status === 'pending' ? 'amber' : p.status === 'approved' ? 'green' : 'red'}>
                    {statusLabel(p.status)}
                  </Badge>
                </div>
                <div className="text-sm text-brand-light">
                  {p.profiles?.username || 'Пользователь'} • {p.profiles?.email}
                </div>
                <div className="text-xs text-muted mt-0.5">{formatDateTime(p.created_at)}</div>
              </div>

              <div className="text-right">
                <div className="font-display text-2xl font-bold text-brand-gold">
                  {formatPrice(p.amount)}
                </div>
                {p.receipt_url && (
                  <a
                    href={p.receipt_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-brand-gold/70 hover:text-brand-gold inline-flex items-center gap-1 mt-1"
                  >
                    Смотреть чек <ExternalLink size={11} />
                  </a>
                )}
              </div>

              {p.status === 'pending' && (
                <div className="flex gap-2">
                  <Button size="sm" variant="gold" onClick={() => review(p, true)}>
                    <CheckCircle2 size={14} /> Принять
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => review(p, false)}>
                    <XCircle size={14} /> Отклонить
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}