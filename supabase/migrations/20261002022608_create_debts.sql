create type public.debt_type as enum (
  'owed_to_me',
  'i_owe'
);

create table public.debts (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  type public.debt_type not null,

  counterpart_name text not null
    check (char_length(trim(counterpart_name)) > 0),

  amount bigint not null
    check (amount > 0),

  note text
    check (
      note is null
      or char_length(note) <= 200
    ),

  due_date date,

  settled_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


create trigger set_debts_updated_at
before update on public.debts
for each row
execute function public.set_updated_at();


alter table public.debts enable row level security;


create policy "Users can select own debts"
on public.debts
for select
to authenticated
using (
  (select auth.uid()) = user_id
);


create policy "Users can insert own debts"
on public.debts
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);


create policy "Users can update own debts"
on public.debts
for update
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);


create policy "Users can delete own debts"
on public.debts
for delete
to authenticated
using (
  (select auth.uid()) = user_id
);