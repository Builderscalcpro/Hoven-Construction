import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminRoute } from '@/components/AdminRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import * as Sentry from '@sentry/react';
import { Suspense, useEffect, lazy } from 'react';
import { trackPageView } from '@/lib/analytics';
import { Loader2 } from 'lucide-react';

// ============= LAZY LOADED PAGES =============
// Public Pages
const Index = lazy(() => import('@/pages/Index'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Services = lazy(() => import('@/pages/Services'));
const KitchenRemodeling = lazy(() => import('@/pages/KitchenRemodeling'));
const BathroomRenovation = lazy(() => import('@/pages/BathroomRenovation'));
const HomeAdditions = lazy(() => import('@/pages/HomeAdditions'));
const CaseStudies = lazy(() => import('@/pages/CaseStudies'));
const LocationPage = lazy(() => import('@/pages/LocationPage'));
const Blog = lazy(() => import('@/pages/BlogUpdated'));

const BlogPost = lazy(() => import('@/pages/BlogPostUpdated'));

const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const CostEstimator = lazy(() => import('@/components/CostEstimator'));
const CDNTest = lazy(() => import('@/pages/CDNTest'));
const PublicConsultation = lazy(() => import('@/pages/PublicConsultation'));

// Protected Pages (Client Access)
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ClientPortal = lazy(() => import('@/pages/ClientPortal'));
const AccountSettings = lazy(() => import('@/pages/AccountSettings'));
const QuoteHistory = lazy(() => import('@/pages/QuoteHistory'));
const ProjectPreferences = lazy(() => import('@/pages/ProjectPreferences'));
const ProjectManagement = lazy(() => import('@/pages/ProjectManagement'));
const Consultations = lazy(() => import('@/pages/Consultations'));
const CalendarDashboard = lazy(() => import('@/pages/CalendarDashboard'));
const OAuthConnectionManager = lazy(() => import('@/pages/OAuthConnectionManager'));
const ContractorPortal = lazy(() => import('@/pages/ContractorPortal'));
const ContractorOnboarding = lazy(() => import('@/pages/ContractorOnboarding'));

// Admin-Only Pages (Business Management)
const EmailAutomation = lazy(() => import('@/pages/EmailAutomation'));
const EmailDripCampaigns = lazy(() => import('@/pages/EmailDripCampaigns'));
const AIDashboard = lazy(() => import('@/pages/AIDashboard'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const AdminSetup = lazy(() => import('@/pages/AdminSetup'));
const BlogCMS = lazy(() => import('@/pages/BlogCMS'));
const SendGridSetup = lazy(() => import('@/pages/SendGridSetup'));
const APIKeysManagement = lazy(() => import('@/pages/APIKeysManagement'));
const APITestingDashboard = lazy(() => import('@/pages/APITestingDashboard'));
const GoogleOAuthTest = lazy(() => import('@/pages/GoogleOAuthTest'));
const ChatbotTraining = lazy(() => import('@/pages/ChatbotTraining'));
const ChatbotTestPage = lazy(() => import('@/pages/ChatbotTestPage'));
const CredentialsSetup = lazy(() => import('@/pages/CredentialsSetup'));
const CRMDashboard = lazy(() => import('@/components/CRMDashboard'));
const DatabaseHealthDashboard = lazy(() => import('@/components/DatabaseHealthDashboard'));
const ProductionAudit = lazy(() => import('@/pages/ProductionAudit'));
const AdvancedPortfolioManager = lazy(() => import('@/pages/AdvancedPortfolioManager'));
const SecretsManagement = lazy(() => import('@/pages/SecretsManagement'));
const GoogleBusinessConnect = lazy(() => import('@/pages/GoogleBusinessConnect'));
const GoogleBusinessDemo = lazy(() => import('@/pages/GoogleBusinessDemo'));
const GoogleBusinessTestPage = lazy(() => import('@/pages/GoogleBusinessTestPage'));
const EmailTemplateManager = lazy(() => import('@/pages/EmailTemplateManager'));

// OAuth Callbacks
const GoogleBusinessCallback = lazy(() => import('@/pages/GoogleBusinessCallback'));
const GoogleCalendarCallback = lazy(() => import('@/pages/GoogleCalendarCallback'));
const CalendarCallback = lazy(() => import('@/pages/CalendarCallback'));
const EmbedCalendar = lazy(() => import('./pages/EmbedCalendar'));

// ============= QUERY CLIENT CONFIGURATION =============
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// ============= SENTRY INTEGRATION =============
const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

// ============= ANALYTICS TRACKER =============
const AnalyticsTracker = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
  return null;
};

// ============= LOADING COMPONENT =============
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// ============= UNAUTHORIZED PAGE =============
const Unauthorized = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Access Denied</h1>
        <p className="text-xl text-muted-foreground">
          You don't have permission to access this page.
        </p>
      </div>
      <div className="flex gap-4 justify-center">
        <a 
          href="/dashboard" 
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Go to Dashboard
        </a>
        <a 
          href="/" 
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Return Home
        </a>
      </div>
    </div>
  </div>
);

// ============= MAIN APP COMPONENT =============
const App = () => (
  <ErrorBoundary>
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnalyticsTracker />
            <AuthProvider>
              {/* Skip to main content link for accessibility */}
              <a 
                href="#main-content" 
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Skip to main content"
              >
                Skip to main content
              </a>
              <Suspense fallback={<PageLoader />}>
                <SentryRoutes>
                  {/* ========== PUBLIC ROUTES (No Auth Required) ========== */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  
                  {/* Public Marketing Pages */}
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/kitchen-remodeling" element={<KitchenRemodeling />} />
                  <Route path="/services/bathroom-renovation" element={<BathroomRenovation />} />
                  <Route path="/services/home-additions" element={<HomeAdditions />} />
                  
                  {/* Public Content Pages */}
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/case-studies" element={<CaseStudies />} />
                  <Route path="/location/:location" element={<LocationPage />} />
                  <Route path="/cost-estimator" element={<CostEstimator />} />
                  <Route path="/cdn-test" element={<CDNTest />} />
                  <Route path="/book-consultation" element={<PublicConsultation />} />
                  
                  {/* Legal Pages */}
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  
                  {/* OAuth Callback Routes */}
                  <Route path="/google-business-callback" element={<GoogleBusinessCallback />} />
                  <Route path="/google-calendar-callback" element={<GoogleCalendarCallback />} />
                  <Route path="/calendar-callback" element={<CalendarCallback />} />
                  
                  {/* ========== CLIENT ROUTES (Login Required) ========== */}
                  {/* Dashboard & Account Management */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/dashboard/account" element={
                    <ProtectedRoute>
                      <AccountSettings /> {/* Clients update email here */}
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/dashboard/quotes" element={
                    <ProtectedRoute>
                      <QuoteHistory />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/dashboard/preferences" element={
                    <ProtectedRoute>
                      <ProjectPreferences />
                    </ProtectedRoute>
                  } />
                  
                  {/* Client Portal & Projects */}
                  <Route path="/client-portal" element={
                    <ProtectedRoute>
                      <ClientPortal />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/projects" element={
                    <ProtectedRoute>
                      <ProjectManagement />
                    </ProtectedRoute>
                  } />
                  
                  {/* Scheduling & Calendar */}
                  <Route path="/consultations" element={
                    <ProtectedRoute>
                      <Consultations />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/calendar" element={
                    <ProtectedRoute>
                      <CalendarDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/oauth-connections" element={
                    <ProtectedRoute>
                      <OAuthConnectionManager />
                    </ProtectedRoute>
                  } />
                  
                  {/* Contractor Portal */}
                  <Route path="/contractor" element={
                    <ProtectedRoute>
                      <ContractorPortal />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/contractor/onboarding" element={
                    <ProtectedRoute>
                      <ContractorOnboarding />
                    </ProtectedRoute>
                  } />
                  
                  {/* ========== ADMIN ROUTES (Admin Role Required) ========== */}
                  {/* Main Admin Dashboard */}
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } />
                  
                  {/* Email Marketing (MOVED TO ADMIN) */}
                  <Route path="/email-automation" element={
                    <AdminRoute>
                      <EmailAutomation />
                    </AdminRoute>
                  } />
                  
                  <Route path="/email-drip-campaigns" element={
                    <AdminRoute>
                      <EmailDripCampaigns />
                    </AdminRoute>
                  } />
                  
                  {/* AI Management (MOVED TO ADMIN) */}
                  <Route path="/ai-dashboard" element={
                    <AdminRoute>
                      <AIDashboard />
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/chatbot-training" element={
                    <AdminRoute>
                      <ChatbotTraining />
                    </AdminRoute>
                  } />
                  
                  <Route path="/chatbot-test" element={
                    <AdminRoute>
                      <ChatbotTestPage />
                    </AdminRoute>
                  } />
                  
                  {/* CRM & Customer Management */}
                  <Route path="/crm" element={
                    <AdminRoute>
                      <CRMDashboard />
                    </AdminRoute>
                  } />
                  
                  {/* Content Management */}
                  <Route path="/admin/blog" element={
                    <AdminRoute>
                      <BlogCMS />
                    </AdminRoute>
                  } />
                  
                  {/* System Configuration */}
                  <Route path="/sendgrid-setup" element={
                    <AdminRoute>
                      <SendGridSetup />
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/api-keys" element={
                    <AdminRoute>
                      <APIKeysManagement />
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/api-testing" element={
                    <AdminRoute>
                      <APITestingDashboard />
                    </AdminRoute>
                  } />
                  
                  <Route path="/google-oauth-test" element={
                    <AdminRoute>
                      <GoogleOAuthTest />
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/database-health" element={
                    <AdminRoute>
                      <DatabaseHealthDashboard />
                    </AdminRoute>
                  } />
                  
                  <Route path="/production-audit" element={
                    <AdminRoute>
                      <ProductionAudit />
                    </AdminRoute>
                  } />
                  
                  {/* Portfolio Management */}
                  <Route path="/admin/portfolio" element={
                    <AdminRoute>
                      <AdvancedPortfolioManager />
                    </AdminRoute>
                  } />

                  {/* Secrets Management */}
                  <Route path="/admin/secrets" element={
                    <AdminRoute>
                      <SecretsManagement />
                    </AdminRoute>
                  } />

                  {/* Google Business Connection */}
                  <Route path="/google-business-connect" element={
                    <AdminRoute>
                      <GoogleBusinessConnect />
                    </AdminRoute>
                  } />

                  {/* Google Business Demo/Test Page */}
                  <Route path="/google-business-demo" element={
                    <AdminRoute>
                      <GoogleBusinessDemo />
                    </AdminRoute>
                  } />

                  {/* Google Business Test Page */}
                  <Route path="/google-business-test" element={
                    <AdminRoute>
                      <GoogleBusinessTestPage />
                    </AdminRoute>
                  } />

                  {/* Email Template Manager */}
                  <Route path="/admin/email-templates" element={
                    <AdminRoute>
                      <EmailTemplateManager />
                    </AdminRoute>
                  } />


                  
                  {/* Credentials Setup (Public Access for Initial Setup) */}
                  <Route path="/credentials-setup" element={<CredentialsSetup />} />
                  
                  {/* Special Setup Route (No Protection) */}
                  <Route path="/setup-admin" element={<AdminSetup />} />
                  
                  {/* Embeddable Calendar Widget */}
                  <Route path="/embed/calendar" element={<EmbedCalendar />} />
                  
                  {/* 404 Catch-All */}
                  <Route path="*" element={<NotFound />} />
                </SentryRoutes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);


export default App;