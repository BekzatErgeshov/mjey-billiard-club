'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/compat/router'
import { motion } from 'framer-motion'
import { Trophy, Calendar, Users, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatDate, formatPrice } from '@/lib/utils'

export function UpcomingTournaments() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase
        .from('tournaments')
        .select('*')
        .in('status', ['upcoming', 'live'])
        .order('starts_at', { ascending: true })
        .limit(3)
      setItems(data || [])
      setLoading(false)
    })()
  }, [])

  return (
    <section className="container-app py-20">
      <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-brand-gold">Ближайшие</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-display font-bold">
            Турниры
          </h2>
        </motion.div>
        <Link to="/tournaments">
          <Button variant="ghost" size="md">
            Все турниры <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-6 w-2/3 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </Card>
            ))
          : items.length === 0
          ? (
            <Card className="md:col-span-3 text-center py-12">
              <Trophy className="mx-auto text-brand-gold/60 mb-3" size={32} />
              <p className="text-muted">Скоро здесь появятся турниры</p>
            </Card>
          )
          : items.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card hover className="h-full flex flex-col">
                  <Badge variant="gold" className="self-start mb-4">
                    <Trophy size={12} /> {t.format?.toUpperCase()}
                  </Badge>
                  <h3 className="text-xl font-display font-semibold text-brand-light mb-2">
                    {t.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2 mb-5">{t.description}</p>

                  <div className="space-y-2 text-sm mb-6 mt-auto">
                    <div className="flex items-center gap-2 text-brand-light/80">
                      <Calendar size={15} className="text-brand-gold" />
                      {formatDate(t.starts_at)}
                    </div>
                    <div className="flex items-center gap-2 text-brand-light/80">
                      <Users size={15} className="text-brand-gold" />
                      {t.participants_count} / {t.max_participants} участников
                    </div>
                    <div className="text-brand-gold text-base font-semibold">
                      Призовой фонд: {formatPrice(t.prize_pool)}
                    </div>
                  </div>

                  <Link to={`/tournaments/${t.id}`}>
                    <Button variant="gold" size="md" className="w-full">
                      Зарегистрироваться
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
      </div>
    </section>
  )
}