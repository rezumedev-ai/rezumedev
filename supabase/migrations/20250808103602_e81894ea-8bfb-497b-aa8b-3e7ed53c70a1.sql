
-- Grant Premium access for 1 month to the specified user
UPDATE public.profiles
SET
  subscription_plan = 'premium',
  subscription_status = 'active',
  subscription_end_date = (now() AT TIME ZONE 'utc') + INTERVAL '1 month',
  updated_at = now()
WHERE email = 'gopal647862@gmail.com';
