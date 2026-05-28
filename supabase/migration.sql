-- ============================================================
-- Mjey Billiard Club — полная схема БД
-- Выполни этот файл в Supabase SQL Editor
-- ============================================================

-- расширения
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. ПРОФИЛИ
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  phone text,
  email text unique,
  avatar_url text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- триггер: автосоздание профиля при регистрации
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. БИЛЬЯРДНЫЕ СТОЛЫ
-- ============================================================
create table if not exists public.billiard_tables (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  table_type text not null default 'pool' check (table_type in ('pool','snooker','russian')),
  hourly_rate numeric(10,2) not null default 200,
  position_x int not null default 0,
  position_y int not null default 0,
  status text not null default 'available' check (status in ('available','booked','live','maintenance')),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- 3. БРОНИРОВАНИЯ (запланированные)
-- ============================================================
create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  table_id uuid not null references public.billiard_tables(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz not null,
  duration_hours numeric(5,2) not null,
  total_price numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','pending','paid','refunded')),
  cancelled_at timestamptz,
  refund_amount numeric(10,2),
  created_at timestamptz default now()
);

create index if not exists idx_bookings_user on public.bookings(user_id);
create index if not exists idx_bookings_table on public.bookings(table_id);
create index if not exists idx_bookings_time on public.bookings(start_time, end_time);

-- ============================================================
-- 4. LIVE-СЕССИИ (без фикс. времени)
-- ============================================================
create table if not exists public.live_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  table_id uuid not null references public.billiard_tables(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  hourly_rate numeric(10,2) not null,
  played_minutes int,
  final_price numeric(10,2),
  status text not null default 'active' check (status in ('active','ended')),
  started_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create index if not exists idx_live_sessions_table on public.live_sessions(table_id);
create index if not exists idx_live_sessions_status on public.live_sessions(status);

-- ============================================================
-- 5. ТУРНИРЫ
-- ============================================================
create table if not exists public.tournaments (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  format text default 'pool' check (format in ('pool','snooker','russian')),
  starts_at timestamptz not null,
  entry_fee numeric(10,2) not null default 500,
  prize_pool numeric(10,2) not null default 0,
  max_participants int not null default 16,
  participants_count int not null default 0,
  cover_url text,
  status text not null default 'upcoming' check (status in ('upcoming','live','finished','cancelled')),
  created_at timestamptz default now()
);

-- ============================================================
-- 6. РЕГИСТРАЦИИ НА ТУРНИР
-- ============================================================
create table if not exists public.tournament_registrations (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','rejected','refunded')),
  cancelled_at timestamptz,
  refund_amount numeric(10,2),
  created_at timestamptz default now(),
  unique(tournament_id, user_id)
);

-- ============================================================
-- 7. ШТРАФЫ
-- ============================================================
create table if not exists public.fines (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  amount numeric(10,2) not null,
  status text not null default 'unpaid' check (status in ('unpaid','pending','paid')),
  issued_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  paid_at timestamptz
);

create index if not exists idx_fines_user_status on public.fines(user_id, status);

-- ============================================================
-- 8. ПЛАТЕЖИ (с чеками)
-- ============================================================
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  payment_type text not null check (payment_type in ('booking','tournament','fine')),
  reference_id uuid not null,
  amount numeric(10,2) not null,
  receipt_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  note text,
  created_at timestamptz default now()
);

create index if not exists idx_payments_user on public.payments(user_id);
create index if not exists idx_payments_status on public.payments(status);
create index if not exists idx_payments_reference on public.payments(reference_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- helper: проверка админа
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.billiard_tables enable row level security;
alter table public.bookings enable row level security;
alter table public.live_sessions enable row level security;
alter table public.tournaments enable row level security;
alter table public.tournament_registrations enable row level security;
alter table public.fines enable row level security;
alter table public.payments enable row level security;

-- профили
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all" on public.profiles
  for select using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin());

-- столы — читают все, пишут админы
drop policy if exists "tables_select_all" on public.billiard_tables;
create policy "tables_select_all" on public.billiard_tables for select using (true);

drop policy if exists "tables_admin_write" on public.billiard_tables;
create policy "tables_admin_write" on public.billiard_tables
  for all using (public.is_admin()) with check (public.is_admin());

-- бронирования
drop policy if exists "bookings_select_own_or_admin" on public.bookings;
create policy "bookings_select_own_or_admin" on public.bookings
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "bookings_insert_own" on public.bookings;
create policy "bookings_insert_own" on public.bookings
  for insert with check (auth.uid() = user_id);

drop policy if exists "bookings_update_own_or_admin" on public.bookings;
create policy "bookings_update_own_or_admin" on public.bookings
  for update using (auth.uid() = user_id or public.is_admin());

drop policy if exists "bookings_admin_delete" on public.bookings;
create policy "bookings_admin_delete" on public.bookings
  for delete using (public.is_admin());

-- live-сессии — читают все (для realtime hall), управляет админ
drop policy if exists "sessions_select_all" on public.live_sessions;
create policy "sessions_select_all" on public.live_sessions for select using (true);

drop policy if exists "sessions_admin_write" on public.live_sessions;
create policy "sessions_admin_write" on public.live_sessions
  for all using (public.is_admin()) with check (public.is_admin());

-- турниры — читают все, пишут админы
drop policy if exists "tournaments_select_all" on public.tournaments;
create policy "tournaments_select_all" on public.tournaments for select using (true);

drop policy if exists "tournaments_admin_write" on public.tournaments;
create policy "tournaments_admin_write" on public.tournaments
  for all using (public.is_admin()) with check (public.is_admin());

-- регистрации
drop policy if exists "regs_select_own_or_admin" on public.tournament_registrations;
create policy "regs_select_own_or_admin" on public.tournament_registrations
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "regs_insert_own" on public.tournament_registrations;
create policy "regs_insert_own" on public.tournament_registrations
  for insert with check (auth.uid() = user_id);

drop policy if exists "regs_update_own_or_admin" on public.tournament_registrations;
create policy "regs_update_own_or_admin" on public.tournament_registrations
  for update using (auth.uid() = user_id or public.is_admin());

-- штрафы — выдают только админы, видит владелец
drop policy if exists "fines_select_own_or_admin" on public.fines;
create policy "fines_select_own_or_admin" on public.fines
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "fines_admin_write" on public.fines;
create policy "fines_admin_write" on public.fines
  for all using (public.is_admin()) with check (public.is_admin());

-- платежи
drop policy if exists "payments_select_own_or_admin" on public.payments;
create policy "payments_select_own_or_admin" on public.payments
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "payments_insert_own" on public.payments;
create policy "payments_insert_own" on public.payments
  for insert with check (auth.uid() = user_id);

drop policy if exists "payments_admin_update" on public.payments;
create policy "payments_admin_update" on public.payments
  for update using (public.is_admin());

-- ============================================================
-- REALTIME (включи в Dashboard для этих таблиц)
-- ============================================================
-- Database → Replication → public → отметь:
--   billiard_tables, bookings, live_sessions, tournaments, fines, payments

-- ============================================================
-- ДЕМО-ДАННЫЕ
-- ============================================================
insert into public.billiard_tables (name, table_type, hourly_rate, position_x, position_y)
values
  ('Стол №1', 'pool',     200, 10, 10),
  ('Стол №2', 'pool',     200, 35, 10),
  ('Стол №3', 'pool',     200, 60, 10),
  ('Стол №4', 'snooker',  300, 10, 45),
  ('Стол №5', 'snooker',  300, 35, 45),
  ('Стол №6', 'russian',  250, 60, 45),
  ('Стол VIP', 'russian', 400, 35, 78)
on conflict do nothing;

insert into public.tournaments (title, description, format, starts_at, entry_fee, prize_pool, max_participants)
values
  ('Открытый кубок Mjey', 'Турнир по американскому пулу. Открытая регистрация для всех.', 'pool', now() + interval '14 days', 500, 25000, 32),
  ('Снукер-вечер', 'Классический снукер. Только опытные игроки.', 'snooker', now() + interval '30 days', 1000, 50000, 16),
  ('Русский бильярд — мастер', 'Турнир по русскому бильярду высокого уровня.', 'russian', now() + interval '7 days', 700, 30000, 24)
on conflict do nothing;
