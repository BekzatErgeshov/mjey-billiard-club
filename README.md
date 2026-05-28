# Mjey Billiard Club

Премиальный бильярдный клуб — fullstack web app на Next.js 15 + Supabase.

## Стек

- **Next.js 15** (App Router)
- React 18
- TailwindCSS
- Zustand
- Framer Motion
- Lucide React
- Supabase (Auth, Postgres, Storage, Realtime, RLS)

## Локальный запуск

```bash
npm install
cp .env.example .env
# Заполни .env своими ключами Supabase
npm run dev
```

Открой http://localhost:3000

## Деплой на Vercel

1. Импортируй репозиторий в Vercel
2. В **Settings → Environment Variables** добавь все переменные из `.env.example`
3. Deploy

## Supabase setup

1. Создай проект на https://supabase.com
2. Открой SQL Editor → запусти `supabase/setup_all.sql` (создаёт таблицы, RLS, триггеры, демо-данные и админа)
3. Запусти `supabase/setup_storage.sql` (создаёт buckets для аватаров, чеков, обложек турниров)
4. В **Database → Replication** включи реалтайм для таблиц: `billiard_tables`, `bookings`, `live_sessions`, `tournaments`, `fines`, `payments`, `tournament_registrations`, `profiles`
5. Скопируй URL и anon key в `.env`

### Админ по умолчанию

После запуска `setup_all.sql`:
- **Email:** `mjey@mjey.com`
- **Пароль:** `Mjey25.05.06`

## Структура

```
app/                  # Next.js App Router
  (main)/             # страницы с Navbar + Footer
  auth/               # login / register
src/
  compat/             # shim для react-router-dom API
  components/         # UI компоненты
  screens/            # содержимое страниц
  layouts/            # MainLayout
  stores/             # Zustand stores (auth, theme)
  lib/                # Supabase client, утилиты
  hooks/              # кастомные хуки
  styles/             # global.css
supabase/             # SQL миграции
```
