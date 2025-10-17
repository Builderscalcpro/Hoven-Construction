import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, User, LogOut, BookOpen } from 'lucide-react';

import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AdminQuickAccessMenu from './AdminQuickAccessMenu';


// SEO & Structure
import { EnhancedSEO } from './EnhancedSEO';
import { AEOOptimization } from './AEOOptimization';
import StructuredData, { getLocalBusinessSchema, getFAQSchema, getBreadcrumbSchema } from './StructuredData';

// Main Components
import HeroSection from './HeroSection';
import { TrustBadges } from './TrustBadges';
import AwardBadges from './AwardBadges';
import ServiceSelector from './ServiceSelector';
import ProjectGallery from './ProjectGallery';
import ConstructionEstimator from './ConstructionEstimator';
import MeetTheOwner from './MeetTheOwner';
import GoogleReviewsDisplay from './GoogleReviewsDisplay';
import ReviewsSection from './ReviewsSection';
import Testimonials from './Testimonials';
import { LocalSEO } from './LocalSEO';
import CTASection from './CTASection';
import FAQ from './FAQ';
import Footer from './Footer';

// Conversion Tools
import { ClickToCall } from './ClickToCall';
import AIChatbot from './AIChatbot';
import PWAInstallPrompt from './PWAInstallPrompt';

export default function AppLayout() {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // FAQ data for SEO
  const faqs = [
    {
      question: "How much does a kitchen remodel cost in Los Angeles?",
      answer: "A kitchen remodel in Los Angeles typically costs between $25,000 to $75,000 for a mid-range renovation, and $75,000 to $150,000+ for high-end projects."
    },
    {
      question: "How long does a bathroom renovation take?",
      answer: "A standard bathroom renovation takes 3-4 weeks from start to finish, including demolition, plumbing/electrical, installation, and finishing touches."
    },
    {
      question: "Do I need permits for home remodeling in Los Angeles?",
      answer: "Yes, most remodeling projects in Los Angeles require permits. We handle all permit applications and inspections for our clients."
    }
  ];

  // Breadcrumb data
  const breadcrumbs = [
    { name: "Home", url: "https://heinhoven.com" },
    { name: "Services", url: "https://heinhoven.com/services" },
    { name: "Los Angeles Remodeling", url: "https://heinhoven.com/los-angeles" }
  ];

  return (
    <div className="min-h-screen">
      {/* SEO & Structured Data */}
      <EnhancedSEO
        title="Los Angeles Home Remodeling & ADU Construction Expert"
        description="Transform your home with Hoven Construction - LA's premier remodeling contractor. Kitchen remodels from $25K, bathroom renovations, ADU construction. Licensed #1118018."
        keywords={['Los Angeles remodeling', 'kitchen remodel LA', 'bathroom renovation', 'ADU construction']}
        robots="index, follow, max-snippet:-1, max-image-preview:large"
      />
      
      <AEOOptimization faqs={faqs} speakable={true} />
      
      <StructuredData data={getLocalBusinessSchema()} />
      {/* FAQ schema is handled by FAQ component to avoid duplication */}
      <StructuredData data={getBreadcrumbSchema(breadcrumbs)} />


      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-amber-600">Hoven Construction</span>


            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-amber-500 font-medium transition-colors"
              >
                Services
              </button>
              <button 
                onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-amber-500 font-medium transition-colors"
              >
                Portfolio
              </button>
              <button 
                onClick={() => document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-amber-500 font-medium transition-colors"
              >
                Cost Estimator
              </button>
              <button 
                onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-amber-500 font-medium transition-colors"
              >
                Reviews
              </button>
              <button 
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-amber-500 font-medium transition-colors"
              >
                FAQ
              </button>
              
              {/* Blog Link */}
              <Link 
                to="/blog"
                className="flex items-center gap-2 text-gray-700 hover:text-amber-500 font-medium transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>Blog</span>
              </Link>

              
              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center gap-2">
                  {isAdmin && <AdminQuickAccessMenu />}
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="ghost" size="sm">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>

              ) : (
                <Link to="/auth">
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-3">
              <a 
                href="tel:+13108532131"
                className="text-amber-600 hover:text-amber-700"
              >
                <Phone className="h-5 w-5" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-amber-500 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              <button 
                onClick={() => {
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  closeMobileMenu();
                }}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md font-medium transition-colors"
              >
                Services
              </button>
              <button 
                onClick={() => {
                  document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                  closeMobileMenu();
                }}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md font-medium transition-colors"
              >
                Portfolio
              </button>
              <button 
                onClick={() => {
                  document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
                  closeMobileMenu();
                }}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md font-medium transition-colors"
              >
                Cost Estimator
              </button>
              <button 
                onClick={() => {
                  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                  closeMobileMenu();
                }}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md font-medium transition-colors"
              >
                Reviews
              </button>
              <button 
                onClick={() => {
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                  closeMobileMenu();
                }}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md font-medium transition-colors"
              >
                FAQ
              </button>
              
              {/* Blog Link in Mobile Menu */}
              <Link 
                to="/blog"
                onClick={closeMobileMenu}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md font-medium transition-colors"
              >
                Blog
              </Link>

              
              {/* Mobile Auth */}
              <div className="pt-3 border-t border-gray-100">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link 
                        to="/admin"
                        onClick={closeMobileMenu}
                        className="block w-full text-left px-4 py-3 text-amber-600 hover:bg-amber-50 rounded-md font-medium transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link 
                      to="/dashboard"
                      onClick={closeMobileMenu}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md font-medium transition-colors"
                    >
                      Dashboard
                    </Link>

                    <button 
                      onClick={() => {
                        handleSignOut();
                        closeMobileMenu();
                      }}
                      className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/auth"
                    onClick={closeMobileMenu}
                    className="block w-full text-left px-4 py-3 text-amber-600 hover:bg-amber-50 rounded-md font-semibold transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main id="main-content" className="pt-16" role="main" aria-label="Main content">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Trust Indicators */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <TrustBadges />
            <AwardBadges />
          </div>
        </section>
        
        {/* Services - WITH INTEGRATED BOOKING BUTTON */}
        <section id="services" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <ServiceSelector />
            {/* ServiceSelector already has the urgency button integrated */}
          </div>
        </section>
        
        {/* Portfolio */}
        <section id="portfolio" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <ProjectGallery />
          </div>
        </section>

        
        {/* Cost Estimator */}
        <section id="estimator" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <ConstructionEstimator />
          </div>
        </section>

        
        {/* About & Trust */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <MeetTheOwner />
          </div>
        </section>
        
        {/* Reviews & Testimonials */}
        <section id="reviews" className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
          <div className="max-w-7xl mx-auto px-4 space-y-20">
            <GoogleReviewsDisplay />
            <ReviewsSection />
            <Testimonials />
          </div>
        </section>
        
        {/* Local SEO */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <LocalSEO />
          </div>
        </section>
        
        {/* CTA Section */}
        <CTASection />
        
        {/* FAQ */}
        <section id="faq" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <FAQ />
          </div>
        </section>
        
        {/* Footer */}
        <Footer />
      </main>

      {/* Conversion Widgets */}
      <ClickToCall />
      <AIChatbot />
      <PWAInstallPrompt />
    </div>
  );
}