import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertOctagon, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { supabase } from '@/lib/supabaseClient'
import { formatDate, formatPrice, statusLabel } from '@/lib/utils'

export function MyFines({ userId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase
      .from('fines')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (!userId) return
    load()
    const channel = supabase
      .channel(`fines-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fines', filter: `user_id=eq.${userId}` }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [userId])

  if (loading) return <CardSkeleton />

  if (items.length === 0) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title="Штрафов нет"
        description="У вас нет штрафов. Так держать!"
      />
    )
  }

  const unpaid = items.filter((f) => f.status !== 'paid')
  const paid = items.filter((f) => f.status === 'paid')

  return (
    <div className="space-y-6">
      {unpaid.length > 0 && (
        <div>
          <h3 className="text-sm uppercase tracking-wider text-red-300 mb-3">К оплате</h3>
          <div className="space-y-3">
            {unpaid.map((f) => <FineCard key={f.id} fine={f} />)}
          </div>
        </div>
      )}
      {paid.length > 0 && (
        <div>
          <h3 className="text-sm uppercase tracking-wider text-brand-gold mb-3">Оплачены</h3>
          <div className="space-y-3">
            {paid.map((f) => <FineCard key={f.id} fine={f} />)}
          </div>
        </div>
      )}
    </div>
  )
}

function FineCard({ fine }) {
  const variant = fine.status === 'paid' ? 'green' : fine.status === 'pending' ? 'amber' : 'red'

  return (
    <Card className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <AlertOctagon size={16} className="text-red-400" />
          <h4 className="font-display font-semibold">{fine.reason}</h4>
          <Badge variant={variant}>{statusLabel(fine.status)}</Badge>
        </div>
        <p className="text-xs text-muted">Выписан: {formatDate(fine.created_at)}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-display font-bold text-brand-gold text-lg">
          {formatPrice(fine.amount)}
        </span>
        {fine.status === 'unpaid' && (
          <Link to={`/payment/fine/${fine.id}`}>
            <Button variant="gold" size="sm">Оплатить</Button>
          </Link>
        )}
      </div>
    </Card>
  )
}
