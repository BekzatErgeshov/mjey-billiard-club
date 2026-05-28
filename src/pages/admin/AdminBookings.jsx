import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabaseClient'
import { formatDateTime, formatPrice, statusLabel } from '@/lib/utils'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*, billiard_tables(name), profiles:user_id(username, email)')
        .order('start_time', { ascending: false })
        .limit(100)
      setBookings(data || [])
    }
    load()
    const channel = supabase
      .channel('admin-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <Card key={b.id} className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-display font-semibold">{b.billiard_tables?.name}</h4>
              <Badge variant={b.status === 'cancelled' ? 'red' : b.status === 'confirmed' ? 'green' : 'amber'}>
                {statusLabel(b.status)}
              </Badge>
              <Badge variant={b.payment_status === 'paid' ? 'green' : 'amber'}>
                {statusLabel(b.payment_status)}
              </Badge>
            </div>
            <p className="text-sm text-brand-light/80">
              {b.profiles?.username} • {b.profiles?.email}
            </p>
            <p className="text-xs text-muted mt-0.5">
              {formatDateTime(b.start_time)} → {formatDateTime(b.end_time)}
            </p>
          </div>
          <div className="font-display font-bold text-brand-gold text-lg">
            {formatPrice(b.total_price)}
          </div>
        </Card>
      ))}
    </div>
  )
}
