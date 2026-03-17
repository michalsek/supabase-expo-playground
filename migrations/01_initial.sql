-- ============================================================================
-- EXTENSIONS
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================================================================
-- ENUMS
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'todo_status') then
    create type public.todo_status as enum ('pending', 'done', 'cancelled');
  end if;

  if not exists (select 1 from pg_type where typname = 'todo_kind') then
    create type public.todo_kind as enum ('simple', 'scheduled', 'recurring');
  end if;

  if not exists (select 1 from pg_type where typname = 'recurrence_freq') then
    create type public.recurrence_freq as enum ('daily', 'weekly', 'monthly', 'yearly');
  end if;
end
$$;

-- ============================================================================
-- UPDATED_AT HELPER
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- TABLES
-- ============================================================================

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  title text not null check (char_length(trim(title)) > 0),
  description text,
  notes text,

  kind public.todo_kind not null default 'simple',
  status public.todo_status not null default 'pending',
  priority smallint not null default 0 check (priority between 0 and 5),

  archived boolean not null default false,

  list_id uuid null,
  parent_todo_id uuid null references public.todos(id) on delete cascade,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz null,

  constraint todos_completed_at_consistency
    check (
      (status = 'done' and completed_at is not null)
      or
      (status <> 'done')
    )
);

create table if not exists public.todo_instances (
  id uuid primary key default gen_random_uuid(),
  todo_id uuid not null references public.todos(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,

  visible_from timestamptz null,
  due_at timestamptz null,

  status public.todo_status not null default 'pending',
  completed_at timestamptz null,
  cancelled_at timestamptz null,

  title_override text null,
  description_override text null,

  -- for recurring occurrences; null for ad hoc/simple instances
  source_date date null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint todo_instances_status_time_consistency check (
    (status = 'done' and completed_at is not null)
    or
    (status = 'cancelled' and cancelled_at is not null)
    or
    (status = 'pending' and completed_at is null and cancelled_at is null)
  ),

  constraint todo_instances_source_date_unique unique (todo_id, source_date)
);

create table if not exists public.todo_recurrence_rules (
  id uuid primary key default gen_random_uuid(),
  todo_id uuid not null unique references public.todos(id) on delete cascade,

  freq public.recurrence_freq not null,
  interval_count integer not null default 1 check (interval_count > 0),

  -- ISO day-of-week: 1=Monday ... 7=Sunday
  by_weekdays smallint[] null,
  by_monthdays smallint[] null,
  by_months smallint[] null,

  starts_on date not null,
  ends_on date null,
  max_occurrences integer null check (max_occurrences is null or max_occurrences > 0),

  due_time time null,
  visible_days_before integer not null default 0 check (visible_days_before >= 0),

  last_generated_until date null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint recurrence_ends_after_start
    check (ends_on is null or ends_on >= starts_on),

  constraint recurrence_weekdays_range
    check (
      by_weekdays is null
      or (
        array_position(by_weekdays, 0) is null
        and array_position(by_weekdays, 8) is null
        and coalesce(array_length(by_weekdays, 1), 0) > 0
      )
    ),

  constraint recurrence_monthdays_range
    check (
      by_monthdays is null
      or (
        array_position(by_monthdays, 0) is null
        and array_position(by_monthdays, 32) is null
        and coalesce(array_length(by_monthdays, 1), 0) > 0
      )
    ),

  constraint recurrence_months_range
    check (
      by_months is null
      or (
        array_position(by_months, 0) is null
        and array_position(by_months, 13) is null
        and coalesce(array_length(by_months, 1), 0) > 0
      )
    )
);

-- ============================================================================
-- INDEXES
-- ============================================================================

create index if not exists idx_todos_user_id
  on public.todos(user_id);

create index if not exists idx_todos_user_status_archived
  on public.todos(user_id, status, archived);

create index if not exists idx_todos_parent_todo_id
  on public.todos(parent_todo_id);

create index if not exists idx_todo_instances_user_status_visible_from
  on public.todo_instances(user_id, status, visible_from);

create index if not exists idx_todo_instances_user_due_at
  on public.todo_instances(user_id, due_at);

create index if not exists idx_todo_instances_todo_id
  on public.todo_instances(todo_id);

create index if not exists idx_todo_instances_source_date
  on public.todo_instances(source_date);

create index if not exists idx_todo_recurrence_rules_todo_id
  on public.todo_recurrence_rules(todo_id);

create index if not exists idx_todo_recurrence_rules_starts_on
  on public.todo_recurrence_rules(starts_on);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

drop trigger if exists trg_todos_set_updated_at on public.todos;
create trigger trg_todos_set_updated_at
before update on public.todos
for each row
execute function public.set_updated_at();

drop trigger if exists trg_todo_instances_set_updated_at on public.todo_instances;
create trigger trg_todo_instances_set_updated_at
before update on public.todo_instances
for each row
execute function public.set_updated_at();

drop trigger if exists trg_todo_recurrence_rules_set_updated_at on public.todo_recurrence_rules;
create trigger trg_todo_recurrence_rules_set_updated_at
before update on public.todo_recurrence_rules
for each row
execute function public.set_updated_at();

-- ============================================================================
-- RLS
-- ============================================================================

alter table public.todos enable row level security;
alter table public.todo_instances enable row level security;
alter table public.todo_recurrence_rules enable row level security;

-- todos
drop policy if exists "users_can_select_own_todos" on public.todos;
create policy "users_can_select_own_todos"
on public.todos
for select
using (auth.uid() = user_id);

drop policy if exists "users_can_insert_own_todos" on public.todos;
create policy "users_can_insert_own_todos"
on public.todos
for insert
with check (auth.uid() = user_id);

drop policy if exists "users_can_update_own_todos" on public.todos;
create policy "users_can_update_own_todos"
on public.todos
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users_can_delete_own_todos" on public.todos;
create policy "users_can_delete_own_todos"
on public.todos
for delete
using (auth.uid() = user_id);

-- todo_instances
drop policy if exists "users_can_select_own_instances" on public.todo_instances;
create policy "users_can_select_own_instances"
on public.todo_instances
for select
using (auth.uid() = user_id);

drop policy if exists "users_can_insert_own_instances" on public.todo_instances;
create policy "users_can_insert_own_instances"
on public.todo_instances
for insert
with check (auth.uid() = user_id);

drop policy if exists "users_can_update_own_instances" on public.todo_instances;
create policy "users_can_update_own_instances"
on public.todo_instances
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users_can_delete_own_instances" on public.todo_instances;
create policy "users_can_delete_own_instances"
on public.todo_instances
for delete
using (auth.uid() = user_id);

-- recurrence rules
drop policy if exists "users_can_select_own_recurrence_rules" on public.todo_recurrence_rules;
create policy "users_can_select_own_recurrence_rules"
on public.todo_recurrence_rules
for select
using (
  exists (
    select 1
    from public.todos t
    where t.id = todo_recurrence_rules.todo_id
      and t.user_id = auth.uid()
  )
);

drop policy if exists "users_can_insert_own_recurrence_rules" on public.todo_recurrence_rules;
create policy "users_can_insert_own_recurrence_rules"
on public.todo_recurrence_rules
for insert
with check (
  exists (
    select 1
    from public.todos t
    where t.id = todo_recurrence_rules.todo_id
      and t.user_id = auth.uid()
  )
);

drop policy if exists "users_can_update_own_recurrence_rules" on public.todo_recurrence_rules;
create policy "users_can_update_own_recurrence_rules"
on public.todo_recurrence_rules
for update
using (
  exists (
    select 1
    from public.todos t
    where t.id = todo_recurrence_rules.todo_id
      and t.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.todos t
    where t.id = todo_recurrence_rules.todo_id
      and t.user_id = auth.uid()
  )
);

drop policy if exists "users_can_delete_own_recurrence_rules" on public.todo_recurrence_rules;
create policy "users_can_delete_own_recurrence_rules"
on public.todo_recurrence_rules
for delete
using (
  exists (
    select 1
    from public.todos t
    where t.id = todo_recurrence_rules.todo_id
      and t.user_id = auth.uid()
  )
);

-- ============================================================================
-- OPTIONAL: KEEP todo_instances.user_id IN SYNC WITH todos.user_id
-- ============================================================================

create or replace function public.sync_todo_instance_user_id()
returns trigger
language plpgsql
as $$
begin
  if new.user_id is distinct from (select user_id from public.todos where id = new.todo_id) then
    raise exception 'todo_instances.user_id must match todos.user_id';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_sync_todo_instance_user_id on public.todo_instances;
create trigger trg_sync_todo_instance_user_id
before insert or update on public.todo_instances
for each row
execute function public.sync_todo_instance_user_id();

-- ============================================================================
-- OPTIONAL: AUTO-MAINTAIN todos.completed_at BASED ON todos.status
-- ============================================================================

create or replace function public.set_todo_completed_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'done' and old.status is distinct from 'done' then
    new.completed_at = coalesce(new.completed_at, now());
  elsif new.status <> 'done' then
    new.completed_at = null;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_todo_completed_at on public.todos;
create trigger trg_set_todo_completed_at
before update on public.todos
for each row
execute function public.set_todo_completed_at();

-- ============================================================================
-- OPTIONAL: AUTO-MAINTAIN instance completed/cancelled timestamps
-- ============================================================================

create or replace function public.set_todo_instance_status_timestamps()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'done' then
    new.completed_at = coalesce(new.completed_at, now());
    new.cancelled_at = null;
  elsif new.status = 'cancelled' then
    new.cancelled_at = coalesce(new.cancelled_at, now());
    new.completed_at = null;
  else
    new.completed_at = null;
    new.cancelled_at = null;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_set_todo_instance_status_timestamps on public.todo_instances;
create trigger trg_set_todo_instance_status_timestamps
before update on public.todo_instances
for each row
execute function public.set_todo_instance_status_timestamps();

-- ============================================================================
-- VIEW: actionable instances for current user
-- ============================================================================

create or replace view public.v_actionable_todo_instances as
select
  ti.id,
  ti.todo_id,
  ti.user_id,
  coalesce(ti.title_override, t.title) as title,
  coalesce(ti.description_override, t.description) as description,
  t.notes,
  t.priority,
  t.kind,
  t.archived,
  ti.visible_from,
  ti.due_at,
  ti.status,
  ti.completed_at,
  ti.cancelled_at,
  ti.source_date,
  ti.created_at,
  ti.updated_at
from public.todo_instances ti
join public.todos t on t.id = ti.todo_id
where t.archived = false
  and ti.status = 'pending'
  and (ti.visible_from is null or ti.visible_from <= now());

-- ============================================================================
-- HELPER FUNCTION: create a simple todo with one visible instance
-- ============================================================================

create or replace function public.create_simple_todo(
  p_title text,
  p_description text default null,
  p_notes text default null,
  p_priority smallint default 0,
  p_visible_from timestamptz default now(),
  p_due_at timestamptz default null
)
returns uuid
language plpgsql
security invoker
as $$
declare
  v_todo_id uuid;
begin
  insert into public.todos (
    user_id,
    title,
    description,
    notes,
    kind,
    priority
  )
  values (
    auth.uid(),
    p_title,
    p_description,
    p_notes,
    'simple',
    p_priority
  )
  returning id into v_todo_id;

  insert into public.todo_instances (
    todo_id,
    user_id,
    visible_from,
    due_at
  )
  values (
    v_todo_id,
    auth.uid(),
    p_visible_from,
    p_due_at
  );

  return v_todo_id;
end;
$$;

-- ============================================================================
-- HELPER FUNCTION: create a future/scheduled todo
-- ============================================================================

create or replace function public.create_scheduled_todo(
  p_title text,
  p_visible_from timestamptz,
  p_due_at timestamptz default null,
  p_description text default null,
  p_notes text default null,
  p_priority smallint default 0
)
returns uuid
language plpgsql
security invoker
as $$
declare
  v_todo_id uuid;
begin
  insert into public.todos (
    user_id,
    title,
    description,
    notes,
    kind,
    priority
  )
  values (
    auth.uid(),
    p_title,
    p_description,
    p_notes,
    'scheduled',
    p_priority
  )
  returning id into v_todo_id;

  insert into public.todo_instances (
    todo_id,
    user_id,
    visible_from,
    due_at
  )
  values (
    v_todo_id,
    auth.uid(),
    p_visible_from,
    p_due_at
  );

  return v_todo_id;
end;
$$;

-- ============================================================================
-- HELPER FUNCTION: generate weekly recurring instances
-- v1 focuses on weekly recurrence because your example was "every Saturday"
-- ============================================================================
--
-- by_weekdays uses ISO DOW:
-- Monday=1 ... Sunday=7
--
-- This generates missing instances in [p_from, p_to].
-- You can call it from an Edge Function or pg_cron job.
-- ============================================================================

create or replace function public.generate_weekly_todo_instances(
  p_todo_id uuid,
  p_from date,
  p_to date
)
returns integer
language plpgsql
security invoker
as $$
declare
  v_rule public.todo_recurrence_rules%rowtype;
  v_todo public.todos%rowtype;
  v_date date;
  v_due_at timestamptz;
  v_visible_from timestamptz;
  v_inserted_count integer := 0;
  v_effective_from date;
  v_effective_to date;
begin
  select *
  into v_rule
  from public.todo_recurrence_rules
  where todo_id = p_todo_id;

  if not found then
    raise exception 'No recurrence rule found for todo_id %', p_todo_id;
  end if;

  if v_rule.freq <> 'weekly' then
    raise exception 'This helper currently supports only weekly recurrence';
  end if;

  select *
  into v_todo
  from public.todos
  where id = p_todo_id;

  if not found then
    raise exception 'Todo not found: %', p_todo_id;
  end if;

  v_effective_from := greatest(p_from, v_rule.starts_on);
  v_effective_to := least(p_to, coalesce(v_rule.ends_on, p_to));

  if v_effective_from > v_effective_to then
    return 0;
  end if;

  for v_date in
    select gs::date
    from generate_series(v_effective_from, v_effective_to, interval '1 day') as gs
  loop
    if extract(isodow from v_date)::int = any(coalesce(v_rule.by_weekdays, '{}')) then
      if v_rule.due_time is not null then
        v_due_at := (v_date::timestamp + v_rule.due_time) at time zone 'UTC';
      else
        v_due_at := null;
      end if;

      if v_rule.visible_days_before > 0 then
        if v_rule.due_time is not null then
          v_visible_from := ((v_date - v_rule.visible_days_before)::timestamp + v_rule.due_time) at time zone 'UTC';
        else
          v_visible_from := (v_date - v_rule.visible_days_before)::timestamp at time zone 'UTC';
        end if;
      else
        if v_rule.due_time is not null then
          v_visible_from := (v_date::timestamp + v_rule.due_time) at time zone 'UTC';
        else
          v_visible_from := v_date::timestamp at time zone 'UTC';
        end if;
      end if;

      insert into public.todo_instances (
        todo_id,
        user_id,
        visible_from,
        due_at,
        source_date
      )
      values (
        v_todo.id,
        v_todo.user_id,
        v_visible_from,
        v_due_at,
        v_date
      )
      on conflict (todo_id, source_date) do nothing;

      if found then
        v_inserted_count := v_inserted_count + 1;
      end if;
    end if;
  end loop;

  update public.todo_recurrence_rules
  set last_generated_until = greatest(coalesce(last_generated_until, v_effective_from), v_effective_to)
  where todo_id = p_todo_id;

  return v_inserted_count;
end;
$$;

-- ============================================================================
-- HELPER FUNCTION: create a recurring weekly todo and pre-generate N days ahead
-- ============================================================================

create or replace function public.create_weekly_recurring_todo(
  p_title text,
  p_by_weekdays smallint[],
  p_starts_on date,
  p_due_time time default null,
  p_visible_days_before integer default 0,
  p_description text default null,
  p_notes text default null,
  p_priority smallint default 0,
  p_generate_days_ahead integer default 60
)
returns uuid
language plpgsql
security invoker
as $$
declare
  v_todo_id uuid;
begin
  insert into public.todos (
    user_id,
    title,
    description,
    notes,
    kind,
    priority
  )
  values (
    auth.uid(),
    p_title,
    p_description,
    p_notes,
    'recurring',
    p_priority
  )
  returning id into v_todo_id;

  insert into public.todo_recurrence_rules (
    todo_id,
    freq,
    interval_count,
    by_weekdays,
    starts_on,
    due_time,
    visible_days_before
  )
  values (
    v_todo_id,
    'weekly',
    1,
    p_by_weekdays,
    p_starts_on,
    p_due_time,
    p_visible_days_before
  );

  perform public.generate_weekly_todo_instances(
    v_todo_id,
    p_starts_on,
    p_starts_on + p_generate_days_ahead
  );

  return v_todo_id;
end;
$$;
