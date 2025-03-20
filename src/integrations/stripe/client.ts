
// Client-side Stripe integration using the publishable key
import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe instance with the publishable key
// This key is safe to use in the browser as it's restricted to specific operations
export const getStripeInstance = async () => {
  // Use the environment variable for the publishable key
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    console.error('🔴 ERROR: Missing Stripe publishable key');
    throw new Error('Stripe publishable key is missing');
  }
  
  // Load and return the Stripe instance
  return await loadStripe(publishableKey);
};

// Log the availability of the Stripe publishable key
console.log('🔵 INFO: Stripe publishable key availability:', 
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Available' : 'Not available');

// Set test mode flag to true since we're using a test key
export const STRIPE_TEST_MODE = true;
