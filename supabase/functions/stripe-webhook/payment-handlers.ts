
import { supabase, stripe } from './utils.ts';

// Handle payment failure
export async function handlePaymentFailed(invoice: any) {
  console.log(`Processing payment failed for invoice ${invoice.id}`);
  
  const subscriptionId = invoice.subscription;
  const customerId = invoice.customer;
  
  // Log detailed info for debugging
  console.log(`Payment failed: 
    Invoice ID: ${invoice.id}
    Customer ID: ${customerId}
    Subscription ID: ${subscriptionId || 'N/A'}
    Amount due: ${invoice.amount_due}
    Currency: ${invoice.currency}
    Status: ${invoice.status}
  `);
  
  if (!subscriptionId) {
    console.error('No subscription ID found in invoice');
    return true; // Still mark as processed
  }
  
  // Find the user with this subscription ID
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('subscription_id', subscriptionId)
    .limit(1);
    
  if (error || !profiles || profiles.length === 0) {
    console.error('Could not find user for subscription:', subscriptionId, error);
    
    // Try finding by customer ID as fallback
    if (customerId) {
      const { data: customerProfiles, error: customerError } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .limit(1);
        
      if (!customerError && customerProfiles && customerProfiles.length > 0) {
        const userId = customerProfiles[0].id;
        console.log(`Found user ${userId} by customer ID ${customerId}`);
        
        // Update subscription status to past_due
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'past_due',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
          
        if (updateError) {
          console.error('Error updating subscription status to past_due:', updateError);
        } else {
          console.log(`Successfully marked subscription as past_due for user ${userId}`);
        }
        
        return true;
      }
    }
    
    return true; // Mark as processed even if we couldn't find the user
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
  
  // Log detailed info for debugging
  console.log(`Payment succeeded: 
    Invoice ID: ${invoice.id}
    Customer ID: ${invoice.customer || 'N/A'}
    Subscription ID: ${invoice.subscription || 'N/A'}
    Amount paid: ${invoice.amount_paid}
    Currency: ${invoice.currency}
    Status: ${invoice.status}
  `);
  
  // Get the subscription ID or customer ID
  const subscriptionId = invoice.subscription;
  const customerId = invoice.customer;
  
  // If we have a subscription ID, use it to find the user
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
    
    // Try to find user by customer ID
    const { data: customerProfiles, error: customerError } = await supabase
      .from('profiles')
      .select('id, subscription_status, subscription_plan')
      .eq('stripe_customer_id', customerId)
      .limit(1);
      
    if (!customerError && customerProfiles && customerProfiles.length > 0) {
      const userId = customerProfiles[0].id;
      console.log(`Found user ${userId} by customer ID ${customerId}`);
      
      // If we found the user but they don't have a subscription ID yet, update it
      if (subscriptionId) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_id: subscriptionId,
            subscription_status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
          
        if (updateError) {
          console.error('Error updating subscription details:', updateError);
          return false;
        }
        
        console.log(`Successfully updated subscription details for user ${userId}`);
      } else {
        // Just update the status to active if we don't have a subscription ID
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
      }
      
      return true;
    }
    
    // Try to get customer details directly from Stripe as a last resort
    try {
      const customer = await stripe.customers.retrieve(customerId);
      console.log(`Retrieved customer from Stripe: ${customer.email}`);
      
      if (customer.email) {
        // Try to find user by email
        const { data: emailProfiles, error: emailError } = await supabase
          .from('profiles')
          .select('id, subscription_status, subscription_plan')
          .eq('email', customer.email)
          .limit(1);
          
        if (!emailError && emailProfiles && emailProfiles.length > 0) {
          const userId = emailProfiles[0].id;
          console.log(`Found user ${userId} by email ${customer.email}`);
          
          // Update subscription details
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              subscription_id: subscriptionId,
              stripe_customer_id: customerId,
              subscription_status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Error updating subscription details:', updateError);
            return false;
          }
          
          console.log(`Successfully updated subscription details for user ${userId}`);
          return true;
        }
      }
    } catch (e) {
      console.error('Error retrieving customer from Stripe:', e);
    }
    
    // Log that we couldn't find the user directly
    console.log(`Could not match payment to a user. Please check manually:
      Invoice ID: ${invoice.id}
      Customer ID: ${customerId}
      Subscription ID: ${subscriptionId || 'N/A'}
    `);
  }
  
  // Even if we couldn't find the user, we mark this as processed
  return true;
}
