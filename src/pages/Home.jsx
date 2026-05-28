import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Trophy, Sparkles, Users, Crown, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FreeTablesCounter } from '@/components/home/FreeTablesCounter'
import { UpcomingTournaments } from '@/components/home/UpcomingTournaments'
import { GalleryPreview } from '@/components/home/GalleryPreview'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <FreeTablesCounter />
      <GalleryPreview />
      <UpcomingTournaments />
      <CTASection />
    </>
  )
}

function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1615722440048-da4fd9202894?q=80&w=2670")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/60 to-brand-dark" />
        <div className="absolute inset-0 bg-radial-gold opacity-40" />
      </div>

      <div className="container-app relative z-10 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <Badge variant="gold" className="mb-6">
            <Sparkles size={12} /> Премиальный бильярдный клуб
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.05]">
            <span className="text-gradient-gold">Mjey</span>
            <br />
            <span className="text-brand-light">Billiard Club</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-brand-light/80 max-w-xl leading-relaxed">
            Премиальный бильярдный клуб с уникальной атмосферой. Профессиональные столы,
            турниры и live-сессии в самом сердце города.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/booking">
              <Button variant="gold" size="xl">
                <Calendar size={20} /> Забронировать стол
              </Button>
            </Link>
            <Link to="/tournaments">
              <Button variant="outline" size="xl">
                <Trophy size={20} /> Турниры
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-brand-gold/60 text-xs uppercase tracking-[0.3em]"
      >
        прокрутите вниз ↓
      </motion.div>
    </section>
  )
}

const FEATURES = [
  {
    icon: Crown,
    title: 'Премиум столы',
    text: 'Профессиональные столы Pool, Snooker и Russian — лучшего качества в городе.',
  },
  {
    icon: Users,
    title: 'Турниры',
    text: 'Регулярные турниры с призовыми фондами от 25 000 сом и атмосферой драйва.',
  },
  {
    icon: Sparkles,
    title: 'Live-сессии',
    text: 'Играйте сколько хотите. Таймер и счёт ведутся автоматически.',
  },
  {
    icon: MapPin,
    title: 'Удобное расположение',
    text: 'В центре Бишкека. Парковка, бар, лаунж-зона и приватные комнаты.',
  },
]

function Features() {
  return (
    <section className="container-app py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-brand-gold">Преимущества</span>
        <h2 className="mt-3 text-4xl sm:text-5xl font-display font-bold">
          Почему именно <span className="text-gradient-gold">Mjey</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card hover className="h-full">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold mb-4">
                <f.icon size={22} />
              </div>
              <h3 className="text-lg font-display font-semibold text-brand-light mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.text}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="container-app pb-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl glass-strong p-10 sm:p-14 text-center"
      >
        <div className="absolute inset-0 bg-radial-gold opacity-60 pointer-events-none" />
        <div className="relative">
          <h2 className="text-3xl sm:text-4xl font-display font-bold">
            Готовы попробовать?
          </h2>
          <p className="mt-3 text-muted max-w-xl mx-auto">
            Забронируйте стол прямо сейчас или начните live-сессию по приходу.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/booking">
              <Button variant="gold" size="lg">
                <Calendar size={18} /> Забронировать стол
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button variant="outline" size="lg">Создать аккаунт</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
