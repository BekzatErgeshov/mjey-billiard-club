# Mjey Billiard Club

Премиальный бильярдный клуб — fullstack web app.

## Стек

- React 18 + Vite
- TailwindCSS
- React Router 6
- Zustand
- Framer Motion
- Lucide React
- Supabase (Auth, Postgres, Storage, Realtime, RLS)

## Установка

```bash
npm install
cp .env.example .env
# Заполни .env своими ключами Supabase
npm run dev
```

## Supabase

1. Создай проект на https://supabase.com
2. Открой SQL Editor
3. Запусти `supabase/migration.sql`
4. В Authentication → Providers включи Google OAuth
5. В Storage создай buckets: `avatars`, `receipts`, `tournaments`
6. Скопируй URL и anon key в `.env`

## Структура

```
src/
├── components/    # UI компоненты
├── pages/         # Страницы
├── layouts/       # Layout-обёртки
├── stores/        # Zustand stores
├── lib/           # Supabase клиент, утилиты
├── hooks/         # Кастомные хуки
└── routes/        # Конфиг роутов
```
