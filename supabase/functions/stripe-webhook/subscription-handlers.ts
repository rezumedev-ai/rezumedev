import { supabase } from './utils.ts';

// Handle Stripe subscription updated event
export async function handleSubscriptionUpdated(subscription: any) {
  const userId = subscription.metadata?.userId;
  let profileId = userId;
  
  if (!profileId) {
    // Try to find user by subscription ID
    console.log(`No userId in metadata, looking up profile by subscription_id: ${subscription.id}`);
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('subscription_id', subscription.id)
      .limit(1);
      
    if (error || !profiles || profiles.length === 0) {
      console.error('Could not find user for subscription:', subscription.id, error);
      return false;
    }
    
    profileId = profiles[0].id;
    console.log(`Found user ${profileId} for subscription ${subscription.id}`);
  }
  
  // Update subscription status
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      subscription_status: subscription.status,
      updated_at: new Date().toISOString()
    })
    .eq('id', profileId);
    
  if (updateError) {
    console.error('Error updating subscription status:', updateError);
    return false;
  }
  
  console.log(`Updated subscription status to ${subscription.status} for user ${profileId}`);
  return true;
}

// Handle subscription canceled
export async function handleSubscriptionCanceled(subscription: any) {
  // Find the user with this subscription ID
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('subscription_id', subscription.id)
    .limit(1);
    
  if (error || !profiles || profiles.length === 0) {
    console.error('Could not find user for subscription:', subscription.id, error);
    return false;
  }
  
  const userId = profiles[0].id;
  console.log(`Subscription canceled: ${subscription.id} for user: ${userId}`);
  
  // Mark as canceled but DO NOT remove the plan yet - they keep access until period ends
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'canceled',
      updated_at: new Date().toISOString()
      // Note: NOT removing subscription_plan here to maintain access
    })
    .eq('id', userId);
    
  if (updateError) {
    console.error('Error updating subscription status to canceled:', updateError);
    return false;
  }
  
  console.log(`Successfully marked subscription as canceled for user ${userId}`);
  return true;
}

// Handle subscription deleted
export async function handleSubscriptionDeleted(subscription: any) {
  // Find the user with this subscription ID
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('subscription_id', subscription.id)
    .limit(1);
    
  if (error || !profiles || profiles.length === 0) {
    console.error('Could not find user for subscription:', subscription.id, error);
    return false;
  }
  
  const userId = profiles[0].id;
  console.log(`Subscription deleted/ended: ${subscription.id} for user: ${userId}`);
  
  // Update subscription status to canceled and remove plan access
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'inactive',
      subscription_plan: null,  // Remove plan when subscription is completely ended
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
    
  if (updateError) {
    console.error('Error updating subscription status to inactive:', updateError);
    return false;
  }
  
  console.log(`Successfully removed subscription plan for user ${userId}`);
  return true;
}
