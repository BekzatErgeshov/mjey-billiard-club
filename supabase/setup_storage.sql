-- ============================================================
-- Создание Storage buckets и политик доступа
-- Запусти в SQL Editor
-- ============================================================

-- 1. Создаём 3 публичных bucket'а
insert into storage.buckets (id, name, public)
values
  ('avatars',     'avatars',     true),
  ('receipts',    'receipts',    true),
  ('tournaments', 'tournaments', true)
on conflict (id) do update set public = excluded.public;

-- ============================================================
-- 2. Политики доступа для storage.objects
-- ============================================================

-- Всем разрешаем читать файлы из публичных bucket'ов
drop policy if exists "Public read access" on storage.objects;
create policy "Public read access"
  on storage.objects for select
  using (bucket_id in ('avatars','receipts','tournaments'));

-- Авторизованные пользователи могут загружать в свою папку
-- (правило: первая часть пути = user_id)
drop policy if exists "Users can upload to own folder" on storage.objects;
create policy "Users can upload to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('avatars','receipts','tournaments')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Пользователи могут обновлять свои файлы
drop policy if exists "Users can update own files" on storage.objects;
create policy "Users can update own files"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('avatars','receipts','tournaments')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Пользователи могут удалять свои файлы
drop policy if exists "Users can delete own files" on storage.objects;
create policy "Users can delete own files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('avatars','receipts','tournaments')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Админы могут всё
drop policy if exists "Admins full access" on storage.objects;
create policy "Admins full access"
  on storage.objects for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- Проверка
-- ============================================================
select id, name, public from storage.buckets
where id in ('avatars','receipts','tournaments');
