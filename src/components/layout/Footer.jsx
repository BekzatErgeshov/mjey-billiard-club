'use client'

import { Link } from '@/compat/router'
import { Instagram, Phone, MapPin, Mail } from 'lucide-react'
import { NAV_LINKS, PAYMENT_INFO } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5 pt-16 pb-8 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="Mjey Logo"
                className="w-10 h-10 rounded-xl object-contain bg-brand-dark/50 border border-white/10 shadow-glow-gold"
              />
              <span className="text-xl font-display font-bold text-brand-light">
                Mjey Billiard Club
              </span>
            </div>
            <p className="text-muted text-sm max-w-md leading-relaxed">
              Премиальный бильярдный клуб с уникальной атмосферой. Профессиональные столы,
              турниры мирового уровня и cinematic-атмосфера ждут вас.
            </p>
          </div>

          <div>
            <h4 className="font-display text-brand-light mb-4">Навигация</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted hover:text-brand-gold transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-brand-light mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-brand-gold shrink-0" />
                <span>Бишкек, ул. Примерная 42</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-brand-gold shrink-0" />
                <span>{PAYMENT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-brand-gold shrink-0" />
                <span>info@mjeyclub.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram size={16} className="text-brand-gold shrink-0" />
                <span>@mjey.billiard</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <span>© {new Date().getFullYear()} Mjey Billiard Club. Все права защищены.</span>
          <span>Работаем ежедневно 12:00 — 02:00</span>
        </div>
      </div>
    </footer>
  )
}