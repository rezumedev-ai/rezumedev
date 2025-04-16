
/**
 * This is a client-side helper to load the Stripe.js script and initialize Stripe
 */

let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    // Load Stripe.js dynamically
    stripePromise = import("https://js.stripe.com/v3/")
      .then((module) => {
        const Stripe = (window as any).Stripe;
        const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_your_test_key";
        return Stripe(publishableKey);
      })
      .catch((error) => {
        console.error("Failed to load Stripe:", error);
        return null;
      });
  }
  return stripePromise;
};
