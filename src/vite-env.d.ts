/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GOOGLE_API_KEY: string
  readonly VITE_MICROSOFT_CLIENT_ID: string
  readonly VITE_SENDGRID_API_KEY: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_GA4_MEASUREMENT_ID: string
  readonly VITE_GTM_ID: string
  readonly VITE_GOOGLE_BUSINESS_ACCOUNT_ID: string
  readonly VITE_GOOGLE_BUSINESS_LOCATION_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}