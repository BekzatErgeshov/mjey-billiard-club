-- ============================================================
-- Создание администратора Mjey
-- Запусти ПОСЛЕ выполнения migration.sql
-- ============================================================
-- Логин на сайте: email = mjey@mjey.com
-- Пароль:        Mjey25.05.06
-- Username:      Mjey
-- ============================================================

-- расширение pgcrypto (на всякий случай, обычно уже включено)
create extension if not exists pgcrypto;

do $$
declare
  admin_email text := 'mjey@mjey.com';
  admin_password text := 'Mjey25.05.06';
  admin_username text := 'Mjey';
  new_user_id uuid;
begin
  -- если такой пользователь уже есть — просто обновим его до админа
  select id into new_user_id from auth.users where email = admin_email;

  if new_user_id is null then
    -- создаём нового пользователя в auth
    new_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('username', admin_username),
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    -- identities для Supabase Auth (новые версии требуют запись)
    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      gen_random_uuid(),
      new_user_id,
      jsonb_build_object('sub', new_user_id::text, 'email', admin_email),
      'email',
      new_user_id::text,
      now(),
      now(),
      now()
    );
  end if;

  -- профиль (триггер handle_new_user мог не сработать при ручной вставке)
  insert into public.profiles (id, username, email, role)
  values (new_user_id, admin_username, admin_email, 'admin')
  on conflict (id) do update
    set role = 'admin',
        username = admin_username,
        email = admin_email,
        updated_at = now();
end $$;

-- Проверка результата
select id, email, username, role from public.profiles where email = 'mjey@mjey.com';
