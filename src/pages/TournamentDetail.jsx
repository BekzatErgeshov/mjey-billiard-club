import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Calendar, Users, Clock, ChevronRight, ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/authStore'
import { formatDate, formatTime, formatPrice, statusLabel } from '@/lib/utils'

export default function TournamentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [tournament, setTournament] = useState(null)
  const [myReg, setMyReg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: t } = await supabase.from('tournaments').select('*').eq('id', id).single()
      setTournament(t)
      if (user) {
        const { data: r } = await supabase
          .from('tournament_registrations')
          .select('*')
          .eq('tournament_id', id)
          .eq('user_id', user.id)
          .maybeSingle()
        setMyReg(r)
      }
      setLoading(false)
    }
    load()
  }, [id, user])

  const onRegister = async () => {
    if (!user) {
      navigate('/auth/login')
      return
    }
    setSubmitting(true)
    try {
      const { data: reg, error } = await supabase
        .from('tournament_registrations')
        .insert({ tournament_id: id, user_id: user.id, payment_status: 'pending' })
        .select()
        .single()
      if (error) throw error
      toast.success('Регистрация создана! Оплатите взнос.')
      navigate(`/payment/tournament/${reg.id}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="pt-32 text-center text-muted">Загрузка...</div>
  if (!tournament) return <div className="pt-32 text-center text-muted">Турнир не найден</div>

  const isFull = tournament.participants_count >= tournament.max_participants
  const isFinished = tournament.status === 'finished'
  const canRegister = !myReg && !isFull && !isFinished

  return (
    <>
      <PageHeader eyebrow="Турнир" title={tournament.title} />

      <section className="container-app py-8">
        <Link to="/tournaments" className="inline-flex items-center gap-1 text-sm text-muted hover:text-brand-gold mb-6">
          <ArrowLeft size={14} /> К списку турниров
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="gold"><Trophy size={12} /> {statusLabel(tournament.status)}</Badge>
                <Badge variant="outline">{tournament.format?.toUpperCase()}</Badge>
              </div>
              <p className="text-brand-light/85 leading-relaxed whitespace-pre-line">
                {tournament.description}
              </p>
            </Card>

            <Card>
              <h3 className="font-display text-lg font-semibold mb-4">Информация</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Info icon={Calendar} label="Дата" value={formatDate(tournament.starts_at)} />
                <Info icon={Clock} label="Время" value={formatTime(tournament.starts_at)} />
                <Info icon={Users} label="Участники" value={`${tournament.participants_count} / ${tournament.max_participants}`} />
                <Info icon={Trophy} label="Призовой фонд" value={formatPrice(tournament.prize_pool)} accent />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="sticky top-24">
              <div className="text-center mb-5">
                <div className="text-xs uppercase tracking-wider text-muted mb-1">Взнос</div>
                <div className="text-4xl font-display font-bold text-brand-gold">
                  {formatPrice(tournament.entry_fee)}
                </div>
              </div>

              {myReg ? (
                <div>
                  <div className="text-center py-4 px-3 glass rounded-xl mb-3">
                    <Badge variant="gold" className="mb-2">Вы зарегистрированы</Badge>
                    <div className="text-sm text-muted">Статус оплаты: {statusLabel(myReg.payment_status)}</div>
                  </div>
                  {myReg.payment_status === 'pending' && (
                    <Link to={`/payment/tournament/${myReg.id}`}>
                      <Button variant="gold" size="lg" className="w-full">Оплатить</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  loading={submitting}
                  disabled={!canRegister}
                  onClick={onRegister}
                >
                  {isFinished
                    ? 'Завершён'
                    : isFull
                    ? 'Мест нет'
                    : !user
                    ? 'Войти и зарегистрироваться'
                    : (<>Зарегистрироваться <ChevronRight size={18} /></>)}
                </Button>
              )}
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  )
}

function Info({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl glass">
      <Icon size={18} className="text-brand-gold shrink-0" />
      <div>
        <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
        <div className={accent ? 'font-display font-semibold text-brand-gold' : 'text-brand-light'}>
          {value}
        </div>
      </div>
    </div>
  )
}
