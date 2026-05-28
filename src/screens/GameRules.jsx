'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

const FORMATS = [
  {
    key: 'pool',
    title: 'Pool (8-ball / 9-ball)',
    desc: 'Самый популярный американский формат. 16 шаров, классические правила.',
    rules: [
      'Игра ведётся до забивания всех своих шаров + 8-го (или 9-го).',
      'Игрок выбирает: «целые» (1-7) или «полосатые» (9-15) после первого забитого шара.',
      'Фол при ударе по чужому шару, прыжке битка, отсутствии касания.',
      'Восьмой шар забивается последним в заявленную лузу.',
      'Случайное забивание 8-го = поражение.',
    ],
  },
  {
    key: 'snooker',
    title: 'Snooker',
    desc: 'Классический английский снукер. 22 шара, длинные комбинации.',
    rules: [
      '15 красных шаров по 1 очку и 6 цветных от 2 до 7 очков.',
      'Сначала забивается красный, потом цветной — поочерёдно.',
      'Цветные после забивания возвращаются на стол (пока есть красные).',
      'После окончания красных — цветные забиваются по возрастанию.',
      'Победитель определяется по сумме очков.',
    ],
  },
  {
    key: 'russian',
    title: 'Русский бильярд',
    desc: 'Классика на больших столах. 16 шаров одинакового размера, малые лузы.',
    rules: [
      'Играется на больших столах (12 футов) с малыми лузами.',
      'Шары почти не отличаются от битка по размеру — требует точности.',
      'Свободная пирамида: можно забивать любым шаром в любую лузу.',
      'Победитель — первый забивший 8 шаров (из 16).',
      'Фол — выставление шара на штрафную линию.',
    ],
  },
]

export default function GameRulesPage() {
  const [active, setActive] = useState('pool')
  const cur = FORMATS.find((f) => f.key === active)

  return (
    <>
      <PageHeader
        eyebrow="Правила игры"
        title="Форматы и правила"
        description="Краткий гайд по основным форматам бильярда, которые доступны в Mjey Club."
      />

      <section className="container-app py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {FORMATS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                active === f.key
                  ? 'bg-brand-gold text-brand-dark shadow-glow-gold'
                  : 'glass text-brand-light/70 hover:text-brand-light hover:bg-white/10',
              )}
            >
              {f.title.split(' ')[0]}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <h2 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
                <Target className="text-brand-gold" />
                {cur.title}
              </h2>
              <p className="text-muted text-lg">{cur.desc}</p>
            </Card>

            <div className="grid gap-3">
              {cur.rules.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="glass rounded-xl p-5 flex gap-4"
                >
                  <span className="font-display text-2xl text-brand-gold shrink-0 leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-brand-light/90 pt-1">{r}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>
    </>
  )
}