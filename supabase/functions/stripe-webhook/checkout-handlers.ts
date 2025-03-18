
import { supabase } from './utils.ts';

// Handle Stripe checkout.session.completed event
export async function handleCheckoutSessionCompleted(session: any) {
  const userId = session.metadata?.userId || session.client_reference_id;
  const planType = session.metadata?.planType;
  
  console.log(`Processing checkout.session.completed:
    Session ID: ${session.id}
    User ID: ${userId || 'MISSING'}
    Plan Type: ${planType || 'MISSING'}
    Status: ${session.status}
    Subscription ID: ${session.subscription || 'MISSING'}`
  );
  
  if (!userId) {
    console.error('No user ID found in session metadata or client_reference_id');
    return false;
  }
  
  // Only update user profile if the session was successful
  if (session.status === 'expired') {
    console.log(`Checkout session ${session.id} has expired. No action taken.`);
    return true; // We successfully processed this event by taking no action
  }
  
  // If the session doesn't have a subscription ID but completed, check if it's a one-time payment
  if (!session.subscription && session.status === 'complete' && session.mode === 'payment') {
    // For one-time payments like lifetime subscriptions
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_plan: planType,
        subscription_status: 'active',
        subscription_id: session.id, // Use session ID as reference for one-time payments
        stripe_customer_id: session.customer, // Store the customer ID for future reference
        payment_method: 'card',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating profile after one-time payment:', error);
      return false;
    }
    
    console.log(`Successfully updated subscription for one-time payment, user ${userId}`);
    return true;
  }
  
  // Handle regular subscription checkout
  if (session.subscription) {
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_plan: planType,
        subscription_status: 'active',
        subscription_id: session.subscription,
        stripe_customer_id: session.customer, // Store the customer ID for future reference
        payment_method: 'card',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating profile after checkout:', error);
      return false;
    } 
    
    console.log(`Successfully updated subscription for user ${userId}`);
    return true;
  }
  
  console.log(`No subscription found in session and not a one-time payment. Session status: ${session.status}`);
  return true; // We successfully processed this event by understanding it doesn't need action
}

// Handle checkout.session.expired event
export async function handleCheckoutSessionExpired(session: any) {
  const userId = session.metadata?.userId || session.client_reference_id;
  
  console.log(`Processing checkout.session.expired:
    Session ID: ${session.id}
    User ID: ${userId || 'MISSING'}
    Created: ${new Date(session.created * 1000).toISOString()}
    Expired: ${new Date(session.expires_at * 1000).toISOString()}`
  );
  
  if (!userId) {
    console.log('No user ID found in expired session metadata or client_reference_id');
    return true; // Not an error, just nothing to do
  }
  
  // No database updates needed for expired sessions - just log it
  console.log(`Checkout session ${session.id} expired for user ${userId}. No action required.`);
  return true;
}
