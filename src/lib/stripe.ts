
/**
 * This is a client-side helper to load the Stripe.js script and initialize Stripe
 */

declare const Stripe: any;

let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = new Promise((resolve, reject) => {
      // Add Stripe.js script to the document
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      script.onload = () => {
        const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_your_test_key";
        resolve(Stripe(publishableKey));
      };
      script.onerror = (error) => {
        console.error("Failed to load Stripe:", error);
        reject(error);
      };
      document.body.appendChild(script);
    });
  }
  return stripePromise;
};
