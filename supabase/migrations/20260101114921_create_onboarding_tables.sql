-- Create onboarding_responses table
create table if not exists public.onboarding_responses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  career_stage text,
  primary_goal text,
  timeline text,
  pain_points text[],
  ai_demo_used boolean default false,
  ai_demo_input text,
  ai_demo_output text,
  template_selected text,
  subscription_chosen text,
  completed_at timestamp with time zone,
  conversion_time_seconds integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Add RLS policies
alter table public.onboarding_responses enable row level security;

create policy "Users can view their own onboarding responses"
  on public.onboarding_responses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own onboarding responses"
  on public.onboarding_responses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own onboarding responses"
  on public.onboarding_responses for update
  using (auth.uid() = user_id);

-- Add onboarding_completed flag to profiles
alter table public.profiles
  add column if not exists onboarding_completed boolean default false;

-- Create index for faster lookups
create index if not exists onboarding_responses_user_id_idx 
  on public.onboarding_responses(user_id);

-- Create index on profiles for onboarding status
create index if not exists profiles_onboarding_completed_idx
  on public.profiles(onboarding_completed);
