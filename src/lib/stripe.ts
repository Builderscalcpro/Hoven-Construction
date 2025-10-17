// Stripe integration utility
// Note: For production, use @stripe/stripe-js package

export const getStripePublishableKey = (): string => {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!key || key === 'pk_test_your_stripe_key_here') {
    console.warn('Stripe publishable key not configured. Payment features will not work.');
    return '';
  }
  
  return key;
};

export const isStripeConfigured = (): boolean => {
  const key = getStripePublishableKey();
  return key !== '' && key.startsWith('pk_');
};

// Initialize Stripe (placeholder for when @stripe/stripe-js is added)
export const initializeStripe = async () => {
  const key = getStripePublishableKey();
  
  if (!key) {
    throw new Error('Stripe publishable key is not configured');
  }
  
  // When adding @stripe/stripe-js:
  // import { loadStripe } from '@stripe/stripe-js';
  // return await loadStripe(key);
  
  console.log('Stripe would be initialized with key:', key.substring(0, 10) + '...');
  return null;
};
