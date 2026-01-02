-- Add Performance Indexes
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_link_id ON public.affiliate_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_click_id ON public.affiliate_conversions(click_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_resume_id ON public.ai_suggestions(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_sections_resume_id ON public.resume_sections(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_quiz_responses_resume_id ON public.resume_quiz_responses(resume_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON public.job_applications(user_id);

-- Validate Constraints (Ensure data integrity)
ALTER TABLE public.affiliate_clicks VALIDATE CONSTRAINT affiliate_clicks_link_id_fkey;
ALTER TABLE public.affiliate_conversions VALIDATE CONSTRAINT affiliate_conversions_click_id_fkey;
ALTER TABLE public.affiliate_conversions VALIDATE CONSTRAINT affiliate_conversions_conversion_type_check;
ALTER TABLE public.affiliate_conversions VALIDATE CONSTRAINT affiliate_conversions_status_check;
ALTER TABLE public.affiliate_conversions VALIDATE CONSTRAINT affiliate_conversions_user_id_fkey;
ALTER TABLE public.affiliate_links VALIDATE CONSTRAINT affiliate_links_affiliate_id_fkey;
ALTER TABLE public.affiliate_payments VALIDATE CONSTRAINT affiliate_payments_affiliate_id_fkey;
ALTER TABLE public.affiliate_payments VALIDATE CONSTRAINT affiliate_payments_status_check;
ALTER TABLE public.affiliates VALIDATE CONSTRAINT affiliates_status_check;
ALTER TABLE public.affiliates VALIDATE CONSTRAINT affiliates_user_id_fkey;
ALTER TABLE public.ai_suggestions VALIDATE CONSTRAINT ai_suggestions_resume_id_fkey;
ALTER TABLE public.cover_letters VALIDATE CONSTRAINT cover_letters_user_id_fkey;
ALTER TABLE public.job_applications VALIDATE CONSTRAINT job_applications_user_id_fkey;
ALTER TABLE public.profiles VALIDATE CONSTRAINT profiles_id_fkey;
ALTER TABLE public.redemption_codes VALIDATE CONSTRAINT redemption_codes_redeemed_by_fkey;
ALTER TABLE public.resume_content VALIDATE CONSTRAINT resume_content_user_id_fkey;
ALTER TABLE public.resume_profiles VALIDATE CONSTRAINT resume_profiles_user_id_fkey;
ALTER TABLE public.resume_quiz_responses VALIDATE CONSTRAINT resume_quiz_responses_resume_id_fkey;
ALTER TABLE public.resume_sections VALIDATE CONSTRAINT resume_sections_resume_id_fkey;
ALTER TABLE public.resumes VALIDATE CONSTRAINT resumes_completion_status_check;
ALTER TABLE public.resumes VALIDATE CONSTRAINT resumes_current_step_check;
ALTER TABLE public.resumes VALIDATE CONSTRAINT resumes_user_id_fkey;

-- Cleanup RLS on profiles (Remove redundant public policy)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
