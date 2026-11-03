-- Contact form messages from the landing page.
-- Run once in Supabase: Dashboard > SQL Editor > New query > paste > Run.

create table if not exists public.contact_messages (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 2 and 100),
  email       text not null check (char_length(email) <= 200),
  phone       text check (char_length(phone) <= 30),
  company     text check (char_length(company) <= 100),
  message     text not null check (char_length(message) between 10 and 2000),
  user_agent  text,
  handled     boolean not null default false
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

-- RLS on with no policies: the public anon/publishable key can neither read nor write.
-- Only the .NET server (secret key, which bypasses RLS) inserts rows.
alter table public.contact_messages enable row level security;
revoke all on public.contact_messages from anon, authenticated;

-- The project was created with "Automatically expose new tables" off,
-- so the server's role gets explicit access to this table only.
grant select, insert, update on public.contact_messages to service_role;
