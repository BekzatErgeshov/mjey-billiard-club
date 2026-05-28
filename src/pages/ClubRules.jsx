import { motion } from 'framer-motion'
import { Shield, AlertTriangle, Ban, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'

const RULES = [
  'Соблюдайте дресс-код: smart-casual. Спортивная одежда и шлёпанцы запрещены.',
  'Курение и вейпинг только в специальной зоне.',
  'Бронирование стола подтверждается оплатой или предоплатой 50%.',
  'Опоздание более 15 минут — бронь считается отменённой без возврата.',
  'Дети до 16 лет — только в сопровождении родителей.',
  'Запрещено приносить еду и напитки извне.',
  'Уважайте других гостей и персонал клуба.',
  'Игра на интерес и денежные ставки запрещены на территории клуба.',
]

const PENALTIES = [
  { reason: 'Повреждение сукна', amount: 5000, severity: 'red' },
  { reason: 'Поломка кия', amount: 3000, severity: 'red' },
  { reason: 'Неявка на бронь без отмены', amount: 1000, severity: 'amber' },
  { reason: 'Курение вне зоны', amount: 500, severity: 'amber' },
  { reason: 'Грубое поведение', amount: 2000, severity: 'red' },
]

const WARNINGS = [
  {
    icon: Ban,
    title: 'Алкоголь и игра',
    text: 'Игрокам в состоянии сильного опьянения отказывают в игре. Безопасность оборудования — приоритет.',
  },
  {
    icon: AlertTriangle,
    title: 'Бережное обращение',
    text: 'Не садитесь на стол, не используйте кий не по назначению. Стоимость ремонта — за счёт виновника.',
  },
  {
    icon: Shield,
    title: 'Камеры наблюдения',
    text: 'Зал круглосуточно под видеонаблюдением. Все инциденты фиксируются.',
  },
]

export default function ClubRulesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Правила"
        title="Правила клуба"
        description="Чтобы каждый гость чувствовал себя комфортно — мы придерживаемся простых правил."
      />

      <section className="container-app py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card>
            <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-brand-gold" />
              Общие правила
            </h2>
            <ul className="space-y-3">
              {RULES.map((r, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-3 text-brand-light/85"
                >
                  <span className="text-brand-gold font-semibold shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span>{r}</span>
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </section>

      <section className="container-app py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-display font-bold mb-6 flex items-center gap-2">
            <AlertTriangle className="text-amber-400" />
            Штрафы
          </h2>
          <div className="grid gap-3">
            {PENALTIES.map((p, i) => (
              <motion.div
                key={p.reason}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass rounded-xl p-5 flex items-center justify-between gap-4"
              >
                <span className="text-brand-light/90">{p.reason}</span>
                <Badge variant={p.severity}>{formatPrice(p.amount)}</Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="container-app py-12">
        <h2 className="text-3xl font-display font-bold mb-6">Важные предупреждения</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {WARNINGS.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card hover className="h-full border-amber-500/20">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                  <w.icon size={22} />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{w.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{w.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
