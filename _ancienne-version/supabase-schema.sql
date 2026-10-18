-- À exécuter une seule fois dans Supabase > SQL Editor.
create table if not exists public.learner_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.learner_state enable row level security;
revoke all on public.learner_state from anon;
grant select, insert, update, delete on public.learner_state to authenticated;

drop policy if exists "Each learner reads their own state" on public.learner_state;
create policy "Each learner reads their own state"
  on public.learner_state for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Each learner creates their own state" on public.learner_state;
create policy "Each learner creates their own state"
  on public.learner_state for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Each learner updates their own state" on public.learner_state;
create policy "Each learner updates their own state"
  on public.learner_state for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Each learner deletes their own state" on public.learner_state;
create policy "Each learner deletes their own state"
  on public.learner_state for delete to authenticated
  using ((select auth.uid()) = user_id);
