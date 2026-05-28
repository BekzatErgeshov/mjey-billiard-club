'use client'

import { motion } from 'framer-motion'
import { Award, Heart, Sparkles, Users } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'

const STORY = [
  {
    year: '2018',
    title: 'Идея',
    text: 'Группа энтузиастов мечтала о клубе, где бильярд — это искусство, а не просто игра.',
  },
  {
    year: '2020',
    title: 'Открытие',
    text: 'Мы открыли двери первого Mjey-зала. 5 столов, 1 бар и большая мечта.',
  },
  {
    year: '2023',
    title: 'Расширение',
    text: 'Перебрались в новое здание с 7 столами, VIP-комнатой и собственным баром.',
  },
  {
    year: '2026',
    title: 'Сегодня',
    text: 'Клуб №1 в городе по уровню сервиса, атмосфере и качеству оборудования.',
  },
]

const VALUES = [
  { icon: Award, title: 'Качество', text: 'Профессиональное оборудование от мировых брендов.' },
  { icon: Heart, title: 'Атмосфера', text: 'Cinematic-эстетика и внимание к каждой детали.' },
  { icon: Users, title: 'Сообщество', text: 'Игроки разных уровней объединены страстью к игре.' },
  { icon: Sparkles, title: 'Сервис', text: 'Каждый гость — VIP. Это наш стандарт.' },
]

const GALLERY = [
  'https://images.unsplash.com/photo-1615722440048-da4fd9202894?q=80&w=1200',
  'https://images.unsplash.com/photo-1606206522398-de44a6cb6a83?q=80&w=1200',
  'https://images.unsplash.com/photo-1574629173326-7b54ad48cb89?q=80&w=1200',
  'https://images.unsplash.com/photo-1551406483-3731d1997540?q=80&w=1200',
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="О клубе"
        title="История Mjey Billiard"
        description="Премиальный бильярдный клуб, созданный с любовью к игре и вниманием к деталям."
      />

      <section className="container-app py-12">
        <div className="space-y-10">
          {STORY.map((s, i) => (
            <motion.div
              key={s.year}
              initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
            >
              <div className="md:col-span-1">
                <div className="text-6xl font-display font-bold text-gradient-gold">{s.year}</div>
              </div>
              <Card hover className="md:col-span-2">
                <h3 className="text-2xl font-display font-semibold text-brand-light mb-2">
                  {s.title}
                </h3>
                <p className="text-muted leading-relaxed">{s.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-app py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-brand-gold">Что нас отличает</span>
          <h2 className="mt-3 text-4xl font-display font-bold">Наши ценности</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card hover className="h-full text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold mb-4">
                  <v.icon size={24} />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted">{v.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-app py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-brand-gold">Галерея</span>
          <h2 className="mt-3 text-4xl font-display font-bold">Наш клуб</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {GALLERY.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="aspect-square overflow-hidden rounded-2xl group"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}