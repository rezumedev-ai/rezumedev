drop extension if exists "pg_net";

create type "public"."quiz_question_type" as enum ('personal_info', 'work_experience', 'education', 'certification');


  create table "public"."affiliate_clicks" (
    "id" uuid not null default gen_random_uuid(),
    "link_id" uuid not null,
    "visitor_ip" text,
    "referrer" text,
    "user_agent" text,
    "cookie_id" text not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."affiliate_clicks" enable row level security;


  create table "public"."affiliate_conversions" (
    "id" uuid not null default gen_random_uuid(),
    "click_id" uuid not null,
    "user_id" uuid,
    "amount" numeric(10,2) default 0.00,
    "commission_amount" numeric(10,2) default 0.00,
    "status" text default 'pending'::text,
    "conversion_type" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."affiliate_conversions" enable row level security;


  create table "public"."affiliate_links" (
    "id" uuid not null default gen_random_uuid(),
    "affiliate_id" uuid not null,
    "code" text not null,
    "name" text not null,
    "target_url" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."affiliate_links" enable row level security;


  create table "public"."affiliate_payments" (
    "id" uuid not null default gen_random_uuid(),
    "affiliate_id" uuid not null,
    "amount" numeric(10,2) not null,
    "payment_method" text not null,
    "payment_details" jsonb default '{}'::jsonb,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."affiliate_payments" enable row level security;


  create table "public"."affiliates" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "first_name" text not null,
    "last_name" text not null,
    "email" text not null,
    "commission_rate" numeric(5,2) default 10.00,
    "payment_method" text,
    "payment_details" jsonb default '{}'::jsonb,
    "status" text default 'pending'::text,
    "balance" numeric(10,2) default 0.00,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."affiliates" enable row level security;


  create table "public"."ai_suggestions" (
    "id" uuid not null default gen_random_uuid(),
    "resume_id" uuid not null,
    "suggestion" text not null,
    "section" text not null,
    "priority" text not null default 'medium'::text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."ai_suggestions" enable row level security;


  create table "public"."contact_submissions" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "email" text not null,
    "message" text not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."contact_submissions" enable row level security;


  create table "public"."cover_letters" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "content" text not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."cover_letters" enable row level security;


  create table "public"."job_applications" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "company_name" text not null,
    "job_title" text not null,
    "status" text not null default 'saved'::text,
    "application_date" date,
    "notes" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."job_applications" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "full_name" text,
    "email" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "resume_preferences" jsonb default '{}'::jsonb,
    "email_notifications" boolean default true,
    "desktop_notifications" boolean default false,
    "subscription_plan" text,
    "subscription_status" text,
    "subscription_id" text,
    "payment_method" text,
    "subscription_end_date" timestamp with time zone,
    "stripe_customer_id" text,
    "phone" text,
    "linkedin_url" text,
    "website_url" text
      );


alter table "public"."profiles" enable row level security;


  create table "public"."quiz_questions" (
    "id" uuid not null default gen_random_uuid(),
    "question_key" text not null,
    "question_type" public.quiz_question_type not null,
    "question_text" text not null,
    "required" boolean default true,
    "order_index" integer not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."quiz_questions" enable row level security;


  create table "public"."redemption_codes" (
    "id" uuid not null default gen_random_uuid(),
    "code" text not null,
    "is_redeemed" boolean not null default false,
    "redeemed_by" uuid,
    "redeemed_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "source" text default 'appsumo'::text
      );


alter table "public"."redemption_codes" enable row level security;


  create table "public"."resume_content" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "personal_info" jsonb not null default '{}'::jsonb,
    "professional_summary" jsonb not null default '{}'::jsonb,
    "work_experience" jsonb[] not null default ARRAY[]::jsonb[],
    "education" jsonb[] not null default ARRAY[]::jsonb[],
    "skills" jsonb not null default '{}'::jsonb,
    "certifications" jsonb[] not null default ARRAY[]::jsonb[],
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."resume_content" enable row level security;


  create table "public"."resume_profiles" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "name" text not null,
    "personal_info" jsonb not null default jsonb_build_object('fullName', '', 'email', '', 'phone', '', 'linkedin', '', 'website', ''),
    "avatar_url" text,
    "is_default" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."resume_profiles" enable row level security;


  create table "public"."resume_quiz_responses" (
    "id" uuid not null default gen_random_uuid(),
    "resume_id" uuid,
    "question_key" text not null,
    "response" jsonb,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."resume_quiz_responses" enable row level security;


  create table "public"."resume_sections" (
    "id" uuid not null default gen_random_uuid(),
    "resume_id" uuid,
    "section_type" text not null,
    "content" jsonb,
    "order_index" integer,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."resume_sections" enable row level security;


  create table "public"."resumes" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "content" jsonb not null default '{}'::jsonb,
    "views" integer default 0,
    "downloads" integer default 0,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "completion_status" text default 'draft'::text,
    "current_step" integer default 1,
    "personal_info" jsonb default jsonb_build_object('fullName', '', 'email', '', 'phone', '', 'linkedin', '', 'website', ''),
    "professional_summary" jsonb default jsonb_build_object('title', '', 'summary', ''),
    "work_experience" jsonb[] default ARRAY[]::jsonb[],
    "education" jsonb[] default ARRAY[]::jsonb[],
    "skills" jsonb default jsonb_build_object('hard_skills', ARRAY[]::text[], 'soft_skills', ARRAY[]::text[]),
    "certifications" jsonb[] default ARRAY[]::jsonb[],
    "template_id" text,
    "style_preference" text default 'professional'::text,
    "profile_image_url" text
      );


alter table "public"."resumes" enable row level security;

CREATE UNIQUE INDEX affiliate_clicks_pkey ON public.affiliate_clicks USING btree (id);

CREATE UNIQUE INDEX affiliate_conversions_pkey ON public.affiliate_conversions USING btree (id);

CREATE UNIQUE INDEX affiliate_links_code_key ON public.affiliate_links USING btree (code);

CREATE UNIQUE INDEX affiliate_links_pkey ON public.affiliate_links USING btree (id);

CREATE UNIQUE INDEX affiliate_payments_pkey ON public.affiliate_payments USING btree (id);

CREATE UNIQUE INDEX affiliates_pkey ON public.affiliates USING btree (id);

CREATE UNIQUE INDEX ai_suggestions_pkey ON public.ai_suggestions USING btree (id);

CREATE UNIQUE INDEX contact_submissions_pkey ON public.contact_submissions USING btree (id);

CREATE UNIQUE INDEX cover_letters_pkey ON public.cover_letters USING btree (id);

CREATE INDEX idx_redemption_codes_code ON public.redemption_codes USING btree (code);

CREATE UNIQUE INDEX job_applications_pkey ON public.job_applications USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE INDEX profiles_stripe_customer_id_idx ON public.profiles USING btree (stripe_customer_id);

CREATE UNIQUE INDEX quiz_questions_pkey ON public.quiz_questions USING btree (id);

CREATE UNIQUE INDEX redemption_codes_code_key ON public.redemption_codes USING btree (code);

CREATE UNIQUE INDEX redemption_codes_pkey ON public.redemption_codes USING btree (id);

CREATE UNIQUE INDEX resume_content_pkey ON public.resume_content USING btree (id);

CREATE UNIQUE INDEX resume_profiles_pkey ON public.resume_profiles USING btree (id);

CREATE UNIQUE INDEX resume_quiz_responses_pkey ON public.resume_quiz_responses USING btree (id);

CREATE UNIQUE INDEX resume_sections_pkey ON public.resume_sections USING btree (id);

CREATE UNIQUE INDEX resumes_pkey ON public.resumes USING btree (id);

alter table "public"."affiliate_clicks" add constraint "affiliate_clicks_pkey" PRIMARY KEY using index "affiliate_clicks_pkey";

alter table "public"."affiliate_conversions" add constraint "affiliate_conversions_pkey" PRIMARY KEY using index "affiliate_conversions_pkey";

alter table "public"."affiliate_links" add constraint "affiliate_links_pkey" PRIMARY KEY using index "affiliate_links_pkey";

alter table "public"."affiliate_payments" add constraint "affiliate_payments_pkey" PRIMARY KEY using index "affiliate_payments_pkey";

alter table "public"."affiliates" add constraint "affiliates_pkey" PRIMARY KEY using index "affiliates_pkey";

alter table "public"."ai_suggestions" add constraint "ai_suggestions_pkey" PRIMARY KEY using index "ai_suggestions_pkey";

alter table "public"."contact_submissions" add constraint "contact_submissions_pkey" PRIMARY KEY using index "contact_submissions_pkey";

alter table "public"."cover_letters" add constraint "cover_letters_pkey" PRIMARY KEY using index "cover_letters_pkey";

alter table "public"."job_applications" add constraint "job_applications_pkey" PRIMARY KEY using index "job_applications_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."quiz_questions" add constraint "quiz_questions_pkey" PRIMARY KEY using index "quiz_questions_pkey";

alter table "public"."redemption_codes" add constraint "redemption_codes_pkey" PRIMARY KEY using index "redemption_codes_pkey";

alter table "public"."resume_content" add constraint "resume_content_pkey" PRIMARY KEY using index "resume_content_pkey";

alter table "public"."resume_profiles" add constraint "resume_profiles_pkey" PRIMARY KEY using index "resume_profiles_pkey";

alter table "public"."resume_quiz_responses" add constraint "resume_quiz_responses_pkey" PRIMARY KEY using index "resume_quiz_responses_pkey";

alter table "public"."resume_sections" add constraint "resume_sections_pkey" PRIMARY KEY using index "resume_sections_pkey";

alter table "public"."resumes" add constraint "resumes_pkey" PRIMARY KEY using index "resumes_pkey";

alter table "public"."affiliate_clicks" add constraint "affiliate_clicks_link_id_fkey" FOREIGN KEY (link_id) REFERENCES public.affiliate_links(id) not valid;

alter table "public"."affiliate_clicks" validate constraint "affiliate_clicks_link_id_fkey";

alter table "public"."affiliate_conversions" add constraint "affiliate_conversions_click_id_fkey" FOREIGN KEY (click_id) REFERENCES public.affiliate_clicks(id) not valid;

alter table "public"."affiliate_conversions" validate constraint "affiliate_conversions_click_id_fkey";

alter table "public"."affiliate_conversions" add constraint "affiliate_conversions_conversion_type_check" CHECK ((conversion_type = ANY (ARRAY['signup'::text, 'purchase'::text]))) not valid;

alter table "public"."affiliate_conversions" validate constraint "affiliate_conversions_conversion_type_check";

alter table "public"."affiliate_conversions" add constraint "affiliate_conversions_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'paid'::text]))) not valid;

alter table "public"."affiliate_conversions" validate constraint "affiliate_conversions_status_check";

alter table "public"."affiliate_conversions" add constraint "affiliate_conversions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."affiliate_conversions" validate constraint "affiliate_conversions_user_id_fkey";

alter table "public"."affiliate_links" add constraint "affiliate_links_affiliate_id_fkey" FOREIGN KEY (affiliate_id) REFERENCES public.affiliates(id) not valid;

alter table "public"."affiliate_links" validate constraint "affiliate_links_affiliate_id_fkey";

alter table "public"."affiliate_links" add constraint "affiliate_links_code_key" UNIQUE using index "affiliate_links_code_key";

alter table "public"."affiliate_payments" add constraint "affiliate_payments_affiliate_id_fkey" FOREIGN KEY (affiliate_id) REFERENCES public.affiliates(id) not valid;

alter table "public"."affiliate_payments" validate constraint "affiliate_payments_affiliate_id_fkey";

alter table "public"."affiliate_payments" add constraint "affiliate_payments_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'processed'::text, 'failed'::text]))) not valid;

alter table "public"."affiliate_payments" validate constraint "affiliate_payments_status_check";

alter table "public"."affiliates" add constraint "affiliates_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'active'::text, 'suspended'::text]))) not valid;

alter table "public"."affiliates" validate constraint "affiliates_status_check";

alter table "public"."affiliates" add constraint "affiliates_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."affiliates" validate constraint "affiliates_user_id_fkey";

alter table "public"."ai_suggestions" add constraint "ai_suggestions_resume_id_fkey" FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE not valid;

alter table "public"."ai_suggestions" validate constraint "ai_suggestions_resume_id_fkey";

alter table "public"."cover_letters" add constraint "cover_letters_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."cover_letters" validate constraint "cover_letters_user_id_fkey";

alter table "public"."job_applications" add constraint "job_applications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."job_applications" validate constraint "job_applications_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."redemption_codes" add constraint "redemption_codes_code_key" UNIQUE using index "redemption_codes_code_key";

alter table "public"."redemption_codes" add constraint "redemption_codes_redeemed_by_fkey" FOREIGN KEY (redeemed_by) REFERENCES auth.users(id) not valid;

alter table "public"."redemption_codes" validate constraint "redemption_codes_redeemed_by_fkey";

alter table "public"."resume_content" add constraint "resume_content_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."resume_content" validate constraint "resume_content_user_id_fkey";

alter table "public"."resume_profiles" add constraint "resume_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."resume_profiles" validate constraint "resume_profiles_user_id_fkey";

alter table "public"."resume_quiz_responses" add constraint "resume_quiz_responses_resume_id_fkey" FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE not valid;

alter table "public"."resume_quiz_responses" validate constraint "resume_quiz_responses_resume_id_fkey";

alter table "public"."resume_sections" add constraint "resume_sections_resume_id_fkey" FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE not valid;

alter table "public"."resume_sections" validate constraint "resume_sections_resume_id_fkey";

alter table "public"."resumes" add constraint "resumes_completion_status_check" CHECK ((completion_status = ANY (ARRAY['draft'::text, 'completed'::text, 'enhancing'::text]))) not valid;

alter table "public"."resumes" validate constraint "resumes_completion_status_check";

alter table "public"."resumes" add constraint "resumes_current_step_check" CHECK (((current_step >= 1) AND (current_step <= 7))) not valid;

alter table "public"."resumes" validate constraint "resumes_current_step_check";

alter table "public"."resumes" add constraint "resumes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."resumes" validate constraint "resumes_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.set_default_profile()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- If the new profile is being set as default
  IF NEW.is_default = true THEN
    -- Update all other profiles of this user to not be default
    UPDATE public.resume_profiles
    SET is_default = false
    WHERE user_id = NEW.user_id
      AND id != NEW.id;
  END IF;
  
  -- If there are no default profiles for this user, make this one default
  IF NOT EXISTS (
    SELECT 1 FROM public.resume_profiles
    WHERE user_id = NEW.user_id AND is_default = true
  ) THEN
    NEW.is_default := true;
  END IF;
  
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."affiliate_clicks" to "anon";

grant insert on table "public"."affiliate_clicks" to "anon";

grant references on table "public"."affiliate_clicks" to "anon";

grant select on table "public"."affiliate_clicks" to "anon";

grant trigger on table "public"."affiliate_clicks" to "anon";

grant truncate on table "public"."affiliate_clicks" to "anon";

grant update on table "public"."affiliate_clicks" to "anon";

grant delete on table "public"."affiliate_clicks" to "authenticated";

grant insert on table "public"."affiliate_clicks" to "authenticated";

grant references on table "public"."affiliate_clicks" to "authenticated";

grant select on table "public"."affiliate_clicks" to "authenticated";

grant trigger on table "public"."affiliate_clicks" to "authenticated";

grant truncate on table "public"."affiliate_clicks" to "authenticated";

grant update on table "public"."affiliate_clicks" to "authenticated";

grant delete on table "public"."affiliate_clicks" to "service_role";

grant insert on table "public"."affiliate_clicks" to "service_role";

grant references on table "public"."affiliate_clicks" to "service_role";

grant select on table "public"."affiliate_clicks" to "service_role";

grant trigger on table "public"."affiliate_clicks" to "service_role";

grant truncate on table "public"."affiliate_clicks" to "service_role";

grant update on table "public"."affiliate_clicks" to "service_role";

grant delete on table "public"."affiliate_conversions" to "anon";

grant insert on table "public"."affiliate_conversions" to "anon";

grant references on table "public"."affiliate_conversions" to "anon";

grant select on table "public"."affiliate_conversions" to "anon";

grant trigger on table "public"."affiliate_conversions" to "anon";

grant truncate on table "public"."affiliate_conversions" to "anon";

grant update on table "public"."affiliate_conversions" to "anon";

grant delete on table "public"."affiliate_conversions" to "authenticated";

grant insert on table "public"."affiliate_conversions" to "authenticated";

grant references on table "public"."affiliate_conversions" to "authenticated";

grant select on table "public"."affiliate_conversions" to "authenticated";

grant trigger on table "public"."affiliate_conversions" to "authenticated";

grant truncate on table "public"."affiliate_conversions" to "authenticated";

grant update on table "public"."affiliate_conversions" to "authenticated";

grant delete on table "public"."affiliate_conversions" to "service_role";

grant insert on table "public"."affiliate_conversions" to "service_role";

grant references on table "public"."affiliate_conversions" to "service_role";

grant select on table "public"."affiliate_conversions" to "service_role";

grant trigger on table "public"."affiliate_conversions" to "service_role";

grant truncate on table "public"."affiliate_conversions" to "service_role";

grant update on table "public"."affiliate_conversions" to "service_role";

grant delete on table "public"."affiliate_links" to "anon";

grant insert on table "public"."affiliate_links" to "anon";

grant references on table "public"."affiliate_links" to "anon";

grant select on table "public"."affiliate_links" to "anon";

grant trigger on table "public"."affiliate_links" to "anon";

grant truncate on table "public"."affiliate_links" to "anon";

grant update on table "public"."affiliate_links" to "anon";

grant delete on table "public"."affiliate_links" to "authenticated";

grant insert on table "public"."affiliate_links" to "authenticated";

grant references on table "public"."affiliate_links" to "authenticated";

grant select on table "public"."affiliate_links" to "authenticated";

grant trigger on table "public"."affiliate_links" to "authenticated";

grant truncate on table "public"."affiliate_links" to "authenticated";

grant update on table "public"."affiliate_links" to "authenticated";

grant delete on table "public"."affiliate_links" to "service_role";

grant insert on table "public"."affiliate_links" to "service_role";

grant references on table "public"."affiliate_links" to "service_role";

grant select on table "public"."affiliate_links" to "service_role";

grant trigger on table "public"."affiliate_links" to "service_role";

grant truncate on table "public"."affiliate_links" to "service_role";

grant update on table "public"."affiliate_links" to "service_role";

grant delete on table "public"."affiliate_payments" to "anon";

grant insert on table "public"."affiliate_payments" to "anon";

grant references on table "public"."affiliate_payments" to "anon";

grant select on table "public"."affiliate_payments" to "anon";

grant trigger on table "public"."affiliate_payments" to "anon";

grant truncate on table "public"."affiliate_payments" to "anon";

grant update on table "public"."affiliate_payments" to "anon";

grant delete on table "public"."affiliate_payments" to "authenticated";

grant insert on table "public"."affiliate_payments" to "authenticated";

grant references on table "public"."affiliate_payments" to "authenticated";

grant select on table "public"."affiliate_payments" to "authenticated";

grant trigger on table "public"."affiliate_payments" to "authenticated";

grant truncate on table "public"."affiliate_payments" to "authenticated";

grant update on table "public"."affiliate_payments" to "authenticated";

grant delete on table "public"."affiliate_payments" to "service_role";

grant insert on table "public"."affiliate_payments" to "service_role";

grant references on table "public"."affiliate_payments" to "service_role";

grant select on table "public"."affiliate_payments" to "service_role";

grant trigger on table "public"."affiliate_payments" to "service_role";

grant truncate on table "public"."affiliate_payments" to "service_role";

grant update on table "public"."affiliate_payments" to "service_role";

grant delete on table "public"."affiliates" to "anon";

grant insert on table "public"."affiliates" to "anon";

grant references on table "public"."affiliates" to "anon";

grant select on table "public"."affiliates" to "anon";

grant trigger on table "public"."affiliates" to "anon";

grant truncate on table "public"."affiliates" to "anon";

grant update on table "public"."affiliates" to "anon";

grant delete on table "public"."affiliates" to "authenticated";

grant insert on table "public"."affiliates" to "authenticated";

grant references on table "public"."affiliates" to "authenticated";

grant select on table "public"."affiliates" to "authenticated";

grant trigger on table "public"."affiliates" to "authenticated";

grant truncate on table "public"."affiliates" to "authenticated";

grant update on table "public"."affiliates" to "authenticated";

grant delete on table "public"."affiliates" to "service_role";

grant insert on table "public"."affiliates" to "service_role";

grant references on table "public"."affiliates" to "service_role";

grant select on table "public"."affiliates" to "service_role";

grant trigger on table "public"."affiliates" to "service_role";

grant truncate on table "public"."affiliates" to "service_role";

grant update on table "public"."affiliates" to "service_role";

grant delete on table "public"."ai_suggestions" to "anon";

grant insert on table "public"."ai_suggestions" to "anon";

grant references on table "public"."ai_suggestions" to "anon";

grant select on table "public"."ai_suggestions" to "anon";

grant trigger on table "public"."ai_suggestions" to "anon";

grant truncate on table "public"."ai_suggestions" to "anon";

grant update on table "public"."ai_suggestions" to "anon";

grant delete on table "public"."ai_suggestions" to "authenticated";

grant insert on table "public"."ai_suggestions" to "authenticated";

grant references on table "public"."ai_suggestions" to "authenticated";

grant select on table "public"."ai_suggestions" to "authenticated";

grant trigger on table "public"."ai_suggestions" to "authenticated";

grant truncate on table "public"."ai_suggestions" to "authenticated";

grant update on table "public"."ai_suggestions" to "authenticated";

grant delete on table "public"."ai_suggestions" to "service_role";

grant insert on table "public"."ai_suggestions" to "service_role";

grant references on table "public"."ai_suggestions" to "service_role";

grant select on table "public"."ai_suggestions" to "service_role";

grant trigger on table "public"."ai_suggestions" to "service_role";

grant truncate on table "public"."ai_suggestions" to "service_role";

grant update on table "public"."ai_suggestions" to "service_role";

grant delete on table "public"."contact_submissions" to "anon";

grant insert on table "public"."contact_submissions" to "anon";

grant references on table "public"."contact_submissions" to "anon";

grant select on table "public"."contact_submissions" to "anon";

grant trigger on table "public"."contact_submissions" to "anon";

grant truncate on table "public"."contact_submissions" to "anon";

grant update on table "public"."contact_submissions" to "anon";

grant delete on table "public"."contact_submissions" to "authenticated";

grant insert on table "public"."contact_submissions" to "authenticated";

grant references on table "public"."contact_submissions" to "authenticated";

grant select on table "public"."contact_submissions" to "authenticated";

grant trigger on table "public"."contact_submissions" to "authenticated";

grant truncate on table "public"."contact_submissions" to "authenticated";

grant update on table "public"."contact_submissions" to "authenticated";

grant delete on table "public"."contact_submissions" to "service_role";

grant insert on table "public"."contact_submissions" to "service_role";

grant references on table "public"."contact_submissions" to "service_role";

grant select on table "public"."contact_submissions" to "service_role";

grant trigger on table "public"."contact_submissions" to "service_role";

grant truncate on table "public"."contact_submissions" to "service_role";

grant update on table "public"."contact_submissions" to "service_role";

grant delete on table "public"."cover_letters" to "anon";

grant insert on table "public"."cover_letters" to "anon";

grant references on table "public"."cover_letters" to "anon";

grant select on table "public"."cover_letters" to "anon";

grant trigger on table "public"."cover_letters" to "anon";

grant truncate on table "public"."cover_letters" to "anon";

grant update on table "public"."cover_letters" to "anon";

grant delete on table "public"."cover_letters" to "authenticated";

grant insert on table "public"."cover_letters" to "authenticated";

grant references on table "public"."cover_letters" to "authenticated";

grant select on table "public"."cover_letters" to "authenticated";

grant trigger on table "public"."cover_letters" to "authenticated";

grant truncate on table "public"."cover_letters" to "authenticated";

grant update on table "public"."cover_letters" to "authenticated";

grant delete on table "public"."cover_letters" to "service_role";

grant insert on table "public"."cover_letters" to "service_role";

grant references on table "public"."cover_letters" to "service_role";

grant select on table "public"."cover_letters" to "service_role";

grant trigger on table "public"."cover_letters" to "service_role";

grant truncate on table "public"."cover_letters" to "service_role";

grant update on table "public"."cover_letters" to "service_role";

grant delete on table "public"."job_applications" to "anon";

grant insert on table "public"."job_applications" to "anon";

grant references on table "public"."job_applications" to "anon";

grant select on table "public"."job_applications" to "anon";

grant trigger on table "public"."job_applications" to "anon";

grant truncate on table "public"."job_applications" to "anon";

grant update on table "public"."job_applications" to "anon";

grant delete on table "public"."job_applications" to "authenticated";

grant insert on table "public"."job_applications" to "authenticated";

grant references on table "public"."job_applications" to "authenticated";

grant select on table "public"."job_applications" to "authenticated";

grant trigger on table "public"."job_applications" to "authenticated";

grant truncate on table "public"."job_applications" to "authenticated";

grant update on table "public"."job_applications" to "authenticated";

grant delete on table "public"."job_applications" to "service_role";

grant insert on table "public"."job_applications" to "service_role";

grant references on table "public"."job_applications" to "service_role";

grant select on table "public"."job_applications" to "service_role";

grant trigger on table "public"."job_applications" to "service_role";

grant truncate on table "public"."job_applications" to "service_role";

grant update on table "public"."job_applications" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."quiz_questions" to "anon";

grant insert on table "public"."quiz_questions" to "anon";

grant references on table "public"."quiz_questions" to "anon";

grant select on table "public"."quiz_questions" to "anon";

grant trigger on table "public"."quiz_questions" to "anon";

grant truncate on table "public"."quiz_questions" to "anon";

grant update on table "public"."quiz_questions" to "anon";

grant delete on table "public"."quiz_questions" to "authenticated";

grant insert on table "public"."quiz_questions" to "authenticated";

grant references on table "public"."quiz_questions" to "authenticated";

grant select on table "public"."quiz_questions" to "authenticated";

grant trigger on table "public"."quiz_questions" to "authenticated";

grant truncate on table "public"."quiz_questions" to "authenticated";

grant update on table "public"."quiz_questions" to "authenticated";

grant delete on table "public"."quiz_questions" to "service_role";

grant insert on table "public"."quiz_questions" to "service_role";

grant references on table "public"."quiz_questions" to "service_role";

grant select on table "public"."quiz_questions" to "service_role";

grant trigger on table "public"."quiz_questions" to "service_role";

grant truncate on table "public"."quiz_questions" to "service_role";

grant update on table "public"."quiz_questions" to "service_role";

grant delete on table "public"."redemption_codes" to "anon";

grant insert on table "public"."redemption_codes" to "anon";

grant references on table "public"."redemption_codes" to "anon";

grant select on table "public"."redemption_codes" to "anon";

grant trigger on table "public"."redemption_codes" to "anon";

grant truncate on table "public"."redemption_codes" to "anon";

grant update on table "public"."redemption_codes" to "anon";

grant delete on table "public"."redemption_codes" to "authenticated";

grant insert on table "public"."redemption_codes" to "authenticated";

grant references on table "public"."redemption_codes" to "authenticated";

grant select on table "public"."redemption_codes" to "authenticated";

grant trigger on table "public"."redemption_codes" to "authenticated";

grant truncate on table "public"."redemption_codes" to "authenticated";

grant update on table "public"."redemption_codes" to "authenticated";

grant delete on table "public"."redemption_codes" to "service_role";

grant insert on table "public"."redemption_codes" to "service_role";

grant references on table "public"."redemption_codes" to "service_role";

grant select on table "public"."redemption_codes" to "service_role";

grant trigger on table "public"."redemption_codes" to "service_role";

grant truncate on table "public"."redemption_codes" to "service_role";

grant update on table "public"."redemption_codes" to "service_role";

grant delete on table "public"."resume_content" to "anon";

grant insert on table "public"."resume_content" to "anon";

grant references on table "public"."resume_content" to "anon";

grant select on table "public"."resume_content" to "anon";

grant trigger on table "public"."resume_content" to "anon";

grant truncate on table "public"."resume_content" to "anon";

grant update on table "public"."resume_content" to "anon";

grant delete on table "public"."resume_content" to "authenticated";

grant insert on table "public"."resume_content" to "authenticated";

grant references on table "public"."resume_content" to "authenticated";

grant select on table "public"."resume_content" to "authenticated";

grant trigger on table "public"."resume_content" to "authenticated";

grant truncate on table "public"."resume_content" to "authenticated";

grant update on table "public"."resume_content" to "authenticated";

grant delete on table "public"."resume_content" to "service_role";

grant insert on table "public"."resume_content" to "service_role";

grant references on table "public"."resume_content" to "service_role";

grant select on table "public"."resume_content" to "service_role";

grant trigger on table "public"."resume_content" to "service_role";

grant truncate on table "public"."resume_content" to "service_role";

grant update on table "public"."resume_content" to "service_role";

grant delete on table "public"."resume_profiles" to "anon";

grant insert on table "public"."resume_profiles" to "anon";

grant references on table "public"."resume_profiles" to "anon";

grant select on table "public"."resume_profiles" to "anon";

grant trigger on table "public"."resume_profiles" to "anon";

grant truncate on table "public"."resume_profiles" to "anon";

grant update on table "public"."resume_profiles" to "anon";

grant delete on table "public"."resume_profiles" to "authenticated";

grant insert on table "public"."resume_profiles" to "authenticated";

grant references on table "public"."resume_profiles" to "authenticated";

grant select on table "public"."resume_profiles" to "authenticated";

grant trigger on table "public"."resume_profiles" to "authenticated";

grant truncate on table "public"."resume_profiles" to "authenticated";

grant update on table "public"."resume_profiles" to "authenticated";

grant delete on table "public"."resume_profiles" to "service_role";

grant insert on table "public"."resume_profiles" to "service_role";

grant references on table "public"."resume_profiles" to "service_role";

grant select on table "public"."resume_profiles" to "service_role";

grant trigger on table "public"."resume_profiles" to "service_role";

grant truncate on table "public"."resume_profiles" to "service_role";

grant update on table "public"."resume_profiles" to "service_role";

grant delete on table "public"."resume_quiz_responses" to "anon";

grant insert on table "public"."resume_quiz_responses" to "anon";

grant references on table "public"."resume_quiz_responses" to "anon";

grant select on table "public"."resume_quiz_responses" to "anon";

grant trigger on table "public"."resume_quiz_responses" to "anon";

grant truncate on table "public"."resume_quiz_responses" to "anon";

grant update on table "public"."resume_quiz_responses" to "anon";

grant delete on table "public"."resume_quiz_responses" to "authenticated";

grant insert on table "public"."resume_quiz_responses" to "authenticated";

grant references on table "public"."resume_quiz_responses" to "authenticated";

grant select on table "public"."resume_quiz_responses" to "authenticated";

grant trigger on table "public"."resume_quiz_responses" to "authenticated";

grant truncate on table "public"."resume_quiz_responses" to "authenticated";

grant update on table "public"."resume_quiz_responses" to "authenticated";

grant delete on table "public"."resume_quiz_responses" to "service_role";

grant insert on table "public"."resume_quiz_responses" to "service_role";

grant references on table "public"."resume_quiz_responses" to "service_role";

grant select on table "public"."resume_quiz_responses" to "service_role";

grant trigger on table "public"."resume_quiz_responses" to "service_role";

grant truncate on table "public"."resume_quiz_responses" to "service_role";

grant update on table "public"."resume_quiz_responses" to "service_role";

grant delete on table "public"."resume_sections" to "anon";

grant insert on table "public"."resume_sections" to "anon";

grant references on table "public"."resume_sections" to "anon";

grant select on table "public"."resume_sections" to "anon";

grant trigger on table "public"."resume_sections" to "anon";

grant truncate on table "public"."resume_sections" to "anon";

grant update on table "public"."resume_sections" to "anon";

grant delete on table "public"."resume_sections" to "authenticated";

grant insert on table "public"."resume_sections" to "authenticated";

grant references on table "public"."resume_sections" to "authenticated";

grant select on table "public"."resume_sections" to "authenticated";

grant trigger on table "public"."resume_sections" to "authenticated";

grant truncate on table "public"."resume_sections" to "authenticated";

grant update on table "public"."resume_sections" to "authenticated";

grant delete on table "public"."resume_sections" to "service_role";

grant insert on table "public"."resume_sections" to "service_role";

grant references on table "public"."resume_sections" to "service_role";

grant select on table "public"."resume_sections" to "service_role";

grant trigger on table "public"."resume_sections" to "service_role";

grant truncate on table "public"."resume_sections" to "service_role";

grant update on table "public"."resume_sections" to "service_role";

grant delete on table "public"."resumes" to "anon";

grant insert on table "public"."resumes" to "anon";

grant references on table "public"."resumes" to "anon";

grant select on table "public"."resumes" to "anon";

grant trigger on table "public"."resumes" to "anon";

grant truncate on table "public"."resumes" to "anon";

grant update on table "public"."resumes" to "anon";

grant delete on table "public"."resumes" to "authenticated";

grant insert on table "public"."resumes" to "authenticated";

grant references on table "public"."resumes" to "authenticated";

grant select on table "public"."resumes" to "authenticated";

grant trigger on table "public"."resumes" to "authenticated";

grant truncate on table "public"."resumes" to "authenticated";

grant update on table "public"."resumes" to "authenticated";

grant delete on table "public"."resumes" to "service_role";

grant insert on table "public"."resumes" to "service_role";

grant references on table "public"."resumes" to "service_role";

grant select on table "public"."resumes" to "service_role";

grant trigger on table "public"."resumes" to "service_role";

grant truncate on table "public"."resumes" to "service_role";

grant update on table "public"."resumes" to "service_role";


  create policy "Affiliates can view clicks on their links"
  on "public"."affiliate_clicks"
  as permissive
  for select
  to public
using ((link_id IN ( SELECT affiliate_links.id
   FROM public.affiliate_links
  WHERE (affiliate_links.affiliate_id IN ( SELECT affiliates.id
           FROM public.affiliates
          WHERE (affiliates.user_id = auth.uid()))))));



  create policy "Affiliates can view own conversions"
  on "public"."affiliate_conversions"
  as permissive
  for select
  to public
using ((click_id IN ( SELECT affiliate_clicks.id
   FROM public.affiliate_clicks
  WHERE (affiliate_clicks.link_id IN ( SELECT affiliate_links.id
           FROM public.affiliate_links
          WHERE (affiliate_links.affiliate_id IN ( SELECT affiliates.id
                   FROM public.affiliates
                  WHERE (affiliates.user_id = auth.uid()))))))));



  create policy "Affiliates can manage own links"
  on "public"."affiliate_links"
  as permissive
  for all
  to public
using ((affiliate_id IN ( SELECT affiliates.id
   FROM public.affiliates
  WHERE (affiliates.user_id = auth.uid()))));



  create policy "Affiliates can view own links"
  on "public"."affiliate_links"
  as permissive
  for select
  to public
using ((affiliate_id IN ( SELECT affiliates.id
   FROM public.affiliates
  WHERE (affiliates.user_id = auth.uid()))));



  create policy "Affiliates can view own payments"
  on "public"."affiliate_payments"
  as permissive
  for select
  to public
using ((affiliate_id IN ( SELECT affiliates.id
   FROM public.affiliates
  WHERE (affiliates.user_id = auth.uid()))));



  create policy "Affiliates can update own data"
  on "public"."affiliates"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Affiliates can view own data"
  on "public"."affiliates"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert suggestions for their own resumes"
  on "public"."ai_suggestions"
  as permissive
  for insert
  to public
with check ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));



  create policy "Users can view suggestions for own resumes"
  on "public"."ai_suggestions"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.resumes
  WHERE ((resumes.id = ai_suggestions.resume_id) AND (resumes.user_id = auth.uid())))));



  create policy "Users can view their own resume suggestions"
  on "public"."ai_suggestions"
  as permissive
  for select
  to public
using ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));



  create policy "Allow anonymous submissions"
  on "public"."contact_submissions"
  as permissive
  for insert
  to anon
with check (true);



  create policy "Only authenticated users can view submissions"
  on "public"."contact_submissions"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users can delete own cover letters"
  on "public"."cover_letters"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own cover letters"
  on "public"."cover_letters"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own cover letters"
  on "public"."cover_letters"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own cover letters"
  on "public"."cover_letters"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can delete own job applications"
  on "public"."job_applications"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own job applications"
  on "public"."job_applications"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own job applications"
  on "public"."job_applications"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own job applications"
  on "public"."job_applications"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can read their own profile"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((auth.uid() = id));



  create policy "Users can update own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Users can update their own profile"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));



  create policy "Users can view own profile"
  on "public"."profiles"
  as permissive
  for select
  to public
using ((auth.uid() = id));



  create policy "Quiz questions are viewable by all users"
  on "public"."quiz_questions"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admins can see all redemption codes"
  on "public"."redemption_codes"
  as permissive
  for select
  to public
using ((auth.uid() IN ( SELECT users.id
   FROM auth.users
  WHERE ((auth.jwt() ->> 'role'::text) = 'admin'::text))));



  create policy "Users can see their own redemption codes"
  on "public"."redemption_codes"
  as permissive
  for select
  to public
using ((auth.uid() = redeemed_by));



  create policy "Users can delete their own resumes"
  on "public"."resume_content"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert their own resumes"
  on "public"."resume_content"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update their own resumes"
  on "public"."resume_content"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view their own resumes"
  on "public"."resume_content"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can create their own profiles"
  on "public"."resume_profiles"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can delete their own profiles"
  on "public"."resume_profiles"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can update their own profiles"
  on "public"."resume_profiles"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view their own profiles"
  on "public"."resume_profiles"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can create quiz responses"
  on "public"."resume_quiz_responses"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.resumes
  WHERE ((resumes.id = resume_quiz_responses.resume_id) AND (resumes.user_id = auth.uid())))));



  create policy "Users can delete their quiz responses"
  on "public"."resume_quiz_responses"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.resumes
  WHERE ((resumes.id = resume_quiz_responses.resume_id) AND (resumes.user_id = auth.uid())))));



  create policy "Users can update their quiz responses"
  on "public"."resume_quiz_responses"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.resumes
  WHERE ((resumes.id = resume_quiz_responses.resume_id) AND (resumes.user_id = auth.uid())))));



  create policy "Users can view their quiz responses"
  on "public"."resume_quiz_responses"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.resumes
  WHERE ((resumes.id = resume_quiz_responses.resume_id) AND (resumes.user_id = auth.uid())))));



  create policy "Users can create resume sections"
  on "public"."resume_sections"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.resumes
  WHERE ((resumes.id = resume_sections.resume_id) AND (resumes.user_id = auth.uid())))));



  create policy "Users can delete their resume sections"
  on "public"."resume_sections"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.resumes
  WHERE ((resumes.id = resume_sections.resume_id) AND (resumes.user_id = auth.uid())))));



  create policy "Users can update their resume sections"
  on "public"."resume_sections"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.resumes
  WHERE ((resumes.id = resume_sections.resume_id) AND (resumes.user_id = auth.uid())))));



  create policy "Users can view their resume sections"
  on "public"."resume_sections"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.resumes
  WHERE ((resumes.id = resume_sections.resume_id) AND (resumes.user_id = auth.uid())))));



  create policy "Users can delete own resumes"
  on "public"."resumes"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can delete their own resumes"
  on "public"."resumes"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own resumes"
  on "public"."resumes"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can insert their own resumes"
  on "public"."resumes"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can read their own resumes"
  on "public"."resumes"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can update own resumes"
  on "public"."resumes"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can update their own resumes"
  on "public"."resumes"
  as permissive
  for update
  to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Users can view own resumes"
  on "public"."resumes"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER update_affiliate_conversions_updated_at BEFORE UPDATE ON public.affiliate_conversions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affiliate_links_updated_at BEFORE UPDATE ON public.affiliate_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affiliate_payments_updated_at BEFORE UPDATE ON public.affiliate_payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON public.affiliates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_updated_at_cover_letters BEFORE UPDATE ON public.cover_letters FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_job_applications BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_profile_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER ensure_single_default_profile BEFORE INSERT OR UPDATE ON public.resume_profiles FOR EACH ROW EXECUTE FUNCTION public.set_default_profile();

CREATE TRIGGER update_profile_timestamp BEFORE UPDATE ON public.resume_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_resume_quiz_responses_updated_at BEFORE UPDATE ON public.resume_quiz_responses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_resume_sections_updated_at BEFORE UPDATE ON public.resume_sections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_resumes BEFORE UPDATE ON public.resumes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "Allow authenticated users to upload profile images"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'profile_images'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "Allow users to delete their own profile images"
  on "storage"."objects"
  as permissive
  for delete
  to public
using (((bucket_id = 'profile_images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



  create policy "Allow users to update their own profile images"
  on "storage"."objects"
  as permissive
  for update
  to public
using (((bucket_id = 'profile_images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



  create policy "Authenticated users can delete their temp_resumes"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((bucket_id = 'temp_resumes'::text));



  create policy "Authenticated users can update their temp_resumes"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'temp_resumes'::text));



  create policy "Authenticated users can upload temp_resumes"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'temp_resumes'::text));



  create policy "Public Access to Profile Images"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'profile_images'::text));



  create policy "Public access to temp_resumes"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'temp_resumes'::text));



