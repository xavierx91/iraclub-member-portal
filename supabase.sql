create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  membership_status text not null default 'pending'
    check (membership_status in ('pending','active','inactive','cancelled')),
  stripe_customer_id text,
  stripe_checkout_session_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update own basic profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);
