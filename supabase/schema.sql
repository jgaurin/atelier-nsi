-- Synchronisation de la progression entre appareils : une ligne par compte, avec toute la progression (JSON).
-- À exécuter une fois dans Supabase → SQL Editor → Run. On peut le relancer sans risque.

create table if not exists public.progression (
  user_id uuid primary key references auth.users (id) on delete cascade,
  etat jsonb not null default '{}'::jsonb,
  maj timestamptz not null default now(),
  -- garde-fou : une progression normale pèse quelques centaines de Ko au plus
  constraint progression_taille check (pg_column_size(etat) < 5000000)
);

-- Chaque compte ne peut lire et écrire que SA ligne ; les visiteurs non connectés n'ont accès à rien.
alter table public.progression enable row level security;
revoke all on public.progression from anon;
grant select, insert, update, delete on public.progression to authenticated;

drop policy if exists "lire sa progression" on public.progression;
create policy "lire sa progression" on public.progression
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "créer sa progression" on public.progression;
create policy "créer sa progression" on public.progression
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "modifier sa progression" on public.progression;
create policy "modifier sa progression" on public.progression
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "supprimer sa progression" on public.progression;
create policy "supprimer sa progression" on public.progression
  for delete to authenticated using ((select auth.uid()) = user_id);
