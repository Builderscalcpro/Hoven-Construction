// Analytics utility functions for tracking events across platforms

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
  }
}

// Google Analytics 4 Event Tracking
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-KB485Y4Z44';

    window.gtag('config', measurementId, {
      page_path: url,
    });
  }
};


// Facebook Pixel Event Tracking
export const trackFBEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
};

// Common event tracking functions
export const analytics = {
  // Lead generation
  trackLeadSubmission: (leadType: string) => {
    trackEvent('generate_lead', { lead_type: leadType });
    trackFBEvent('Lead', { content_name: leadType });
  },

  // Quote requests
  trackQuoteRequest: (service: string, value?: number) => {
    trackEvent('request_quote', { service, value });
    trackFBEvent('InitiateCheckout', { content_name: service, value });
  },

  // Consultation bookings
  trackConsultationBooked: (consultationType: string) => {
    trackEvent('book_consultation', { consultation_type: consultationType });
    trackFBEvent('Schedule', { content_name: consultationType });
  },

  // Contact interactions
  trackContactClick: (method: string) => {
    trackEvent('contact', { method });
  },

  // Project gallery views
  trackProjectView: (projectId: string, projectType: string) => {
    trackEvent('view_project', { project_id: projectId, project_type: projectType });
  },

  // Service page views
  trackServiceView: (serviceName: string) => {
    trackEvent('view_service', { service_name: serviceName });
  },

  // Payment tracking
  trackPaymentInitiated: (amount: number, currency: string = 'USD') => {
    trackEvent('begin_checkout', { value: amount, currency });
    trackFBEvent('InitiateCheckout', { value: amount, currency });
  },

  trackPaymentCompleted: (amount: number, transactionId: string) => {
    trackEvent('purchase', {
      transaction_id: transactionId,
      value: amount,
      currency: 'USD',
    });
    trackFBEvent('Purchase', { value: amount, currency: 'USD' });
  },

  // Blog engagement tracking
  trackBlogPostView: (postSlug: string, postTitle: string, category: string) => {
    trackEvent('view_blog_post', { 
      post_slug: postSlug, 
      post_title: postTitle,
      category 
    });
  },

  trackRelatedArticleClick: (fromSlug: string, toSlug: string, position: number) => {
    trackEvent('related_article_click', { 
      from_slug: fromSlug, 
      to_slug: toSlug,
      position 
    });
  },
};
