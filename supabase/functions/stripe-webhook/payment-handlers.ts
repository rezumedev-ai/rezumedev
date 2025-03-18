import { supabase } from './utils.ts';

// Handle payment failure
export async function handlePaymentFailed(invoice: any) {
  const subscriptionId = invoice.subscription;
  
  if (!subscriptionId) {
    console.error('No subscription ID found in invoice');
    return false;
  }
  
  // Find the user with this subscription ID
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('subscription_id', subscriptionId)
    .limit(1);
    
  if (error || !profiles || profiles.length === 0) {
    console.error('Could not find user for subscription:', subscriptionId, error);
    return false;
  }
  
  const userId = profiles[0].id;
  console.log(`Payment failed for subscription: ${subscriptionId}, user: ${userId}`);
  
  // Update subscription status to past_due
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString()
      // Note: Keep subscription_plan to maintain access during grace period
    })
    .eq('id', userId);
    
  if (updateError) {
    console.error('Error updating subscription status to past_due:', updateError);
    return false;
  }
  
  console.log(`Successfully marked subscription as past_due for user ${userId}`);
  return true;
}
