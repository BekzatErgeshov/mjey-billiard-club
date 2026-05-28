export const PAYMENT_INFO = {
  phone: process.env.NEXT_PUBLIC_PAYMENT_PHONE || '+996 700 123 456',
  card: process.env.NEXT_PUBLIC_PAYMENT_CARD || '4444 5555 6666 7777',
  qrUrl: process.env.NEXT_PUBLIC_PAYMENT_QR_URL || '/qr-placeholder.png',
}

export const TABLE_STATUSES = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  LIVE: 'live',
  MAINTENANCE: 'maintenance',
}

export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  RECEIPTS: 'receipts',
  TOURNAMENTS: 'tournaments',
}

export const NAV_LINKS = [
  { to: '/', label: 'Главная' },
  { to: '/about', label: 'О клубе' },
  { to: '/club-rules', label: 'Правила клуба' },
  { to: '/game-rules', label: 'Правила игры' },
  { to: '/booking', label: 'Бронь' },
  { to: '/tournaments', label: 'Турниры' },
  { to: '/contacts', label: 'Контакты' },
]
