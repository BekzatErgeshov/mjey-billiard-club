'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Instagram, MessageCircle } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { PAYMENT_INFO } from '@/lib/constants'

const ITEMS = [
  { icon: MapPin, title: 'Адрес', value: 'Бишкек, ул. Примерная 42', desc: 'Парковка во дворе' },
  { icon: Phone, title: 'Телефон', value: PAYMENT_INFO.phone, desc: 'Звонки и WhatsApp' },
  { icon: Mail, title: 'Email', value: 'info@mjeyclub.com', desc: 'Ответим в течение дня' },
  { icon: Clock, title: 'График', value: '12:00 — 02:00', desc: 'Без выходных' },
  { icon: Instagram, title: 'Instagram', value: '@mjey.billiard', desc: 'Турниры и фото' },
  { icon: MessageCircle, title: 'Telegram', value: '@mjey_club', desc: 'Быстрый ответ' },
]

export default function ContactsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Связь"
        title="Контакты"
        description="Мы всегда на связи. Звоните, пишите, приходите — будем рады каждому."
      />

      <section className="container-app py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ITEMS.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card hover className="h-full">
                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold mb-4">
                  <it.icon size={22} />
                </div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-muted">{it.title}</h3>
                <p className="text-lg font-display text-brand-light mt-1">{it.value}</p>
                <p className="text-sm text-muted mt-1">{it.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-app pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden glass-strong aspect-[16/9] flex items-center justify-center"
        >
          <div className="text-center text-muted">
            <MapPin size={48} className="mx-auto text-brand-gold mb-4" />
            <p>Карта со схемой проезда</p>
            <p className="text-xs mt-2">Подставь сюда iframe Google Maps или Yandex Maps</p>
          </div>
        </motion.div>
      </section>
    </>
  )
}