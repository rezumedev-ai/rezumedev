-- Manually grant premium subscription to user
UPDATE public.profiles
SET 
  subscription_status = 'active',
  subscription_plan = 'lifetime',
  subscription_end_date = now() + interval '100 years'
WHERE email = 'rewire.quit@gmail.com';
