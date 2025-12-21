-- Manually grant monthly premium subscription to user (Case-insensitive check)
UPDATE public.profiles
SET 
  subscription_status = 'active',
  subscription_plan = 'monthly',
  subscription_end_date = now() + interval '1 month'
WHERE lower(email) = 'rewire.quit@gmail.com';
