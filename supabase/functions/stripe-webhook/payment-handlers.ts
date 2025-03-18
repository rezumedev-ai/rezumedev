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

// Handle payment success
export async function handlePaymentSucceeded(invoice: any) {
  console.log(`Processing payment succeeded for invoice ${invoice.id}`);
  
  // Get the subscription ID or customer ID
  const subscriptionId = invoice.subscription;
  const customerId = invoice.customer;
  
  // First try to find by subscription ID if available
  if (subscriptionId) {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, subscription_status, subscription_plan')
      .eq('subscription_id', subscriptionId)
      .limit(1);
      
    if (!error && profiles && profiles.length > 0) {
      const userId = profiles[0].id;
      console.log(`Found user ${userId} by subscription ID ${subscriptionId}`);
      
      // If status is not already active, update it
      if (profiles[0].subscription_status !== 'active') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
          
        if (updateError) {
          console.error('Error updating subscription status to active:', updateError);
          return false;
        }
        
        console.log(`Successfully updated subscription status to active for user ${userId}`);
      } else {
        console.log(`Subscription already active for user ${userId}, no update needed`);
      }
      
      return true;
    }
    
    // If we couldn't find by subscription ID, log the error
    if (error) {
      console.error('Error querying profiles by subscription ID:', error);
    } else {
      console.log(`No profile found with subscription ID: ${subscriptionId}`);
    }
  }
  
  // If we have a customer ID, try to use that as a fallback
  if (customerId) {
    console.log(`Trying to find user by Stripe customer ID: ${customerId}`);
    
    // If your profiles table doesn't have a customer_id field, you might need to add it
    // For now we'll just use the subscription_id field as a fallback if available
    
    // Log that we couldn't find the user directly
    console.log(`Could not directly match payment to a user. Please check manually:
      Invoice ID: ${invoice.id}
      Customer ID: ${customerId}
      Subscription ID: ${subscriptionId || 'N/A'}
    `);
  }
  
  // Even if we couldn't find the user, we mark this as processed
  // You may want to implement a retry mechanism or manual check
  return true;
}
