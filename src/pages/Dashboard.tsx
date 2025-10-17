import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, FileText, Settings, LogOut, DollarSign, Receipt, FolderKanban, Mail, Building2, Star, Calendar, Menu, Link2 } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { MobileNav } from '@/components/MobileNav';

import InvoiceManagement from '@/components/InvoiceManagement';
import GoogleBusinessDashboard from '@/components/GoogleBusinessDashboard';
import ReviewsManagementDashboard from '@/components/ReviewsManagementDashboard';




export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showInvoices, setShowInvoices] = useState(false);
  const [showGoogleBusiness, setShowGoogleBusiness] = useState(false);
  const [showReviews, setShowReviews] = useState(false);


  useEffect(() => {
    if (searchParams.get('tab') === 'google-business') {
      setShowGoogleBusiness(true);
    }
  }, [searchParams]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };


  if (showGoogleBusiness) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Google Business Profile</h1>
            <div className="flex gap-2">
              <Button onClick={() => setShowGoogleBusiness(false)} variant="outline">
                Back to Dashboard
              </Button>
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <GoogleBusinessDashboard />
        </div>
      </div>
    );
  }

  if (showInvoices) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
            <div className="flex gap-2">
              <Button onClick={() => setShowInvoices(false)} variant="outline">
                Back to Dashboard
              </Button>
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <InvoiceManagement />
        </div>
      </div>
    );
  }

  if (showReviews) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
            <div className="flex gap-2">
              <Button onClick={() => setShowReviews(false)} variant="outline">
                Back to Dashboard
              </Button>
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <ReviewsManagementDashboard />
        </div>
      </div>
    );
  }


  return (
    <>
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <SEO
        title="Dashboard"
        description="Manage your construction projects, invoices, and account settings."
        keywords="dashboard, project management, construction management"
      />

      <div className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button onClick={handleSignOut} variant="outline" size="sm" className="sm:size-default">
            <LogOut className="mr-0 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>

        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Welcome back!</h2>
          <p className="text-sm sm:text-base text-gray-600">{user?.email}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition active:scale-95 min-h-[120px]" onClick={() => setShowInvoices(true)}>
            <CardHeader>
              <Receipt className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base sm:text-lg">Invoice Management</CardTitle>
              <CardDescription className="text-sm">Create, track, and manage invoices</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition active:scale-95 min-h-[120px]" onClick={() => navigate('/dashboard/account')}>
            <CardHeader>
              <User className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base sm:text-lg">Account Settings</CardTitle>
              <CardDescription className="text-sm">Manage your profile and preferences</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition active:scale-95 min-h-[120px]" onClick={() => navigate('/dashboard/quotes')}>
            <CardHeader>
              <FileText className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base sm:text-lg">Quote History</CardTitle>
              <CardDescription className="text-sm">View all your project quotes</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition active:scale-95 min-h-[120px]" onClick={() => navigate('/dashboard/preferences')}>
            <CardHeader>
              <Settings className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base sm:text-lg">Project Preferences</CardTitle>
              <CardDescription className="text-sm">Save and manage project details</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition active:scale-95 min-h-[120px]" onClick={() => navigate('/projects')}>
            <CardHeader>
              <FolderKanban className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base sm:text-lg">Project Management</CardTitle>
              <CardDescription className="text-sm">Manage projects, tasks, and resources</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition active:scale-95 min-h-[120px]" onClick={() => navigate('/email-automation')}>
            <CardHeader>
              <Mail className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base sm:text-lg">Email Automation</CardTitle>
              <CardDescription className="text-sm">Manage automated notifications and templates</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition active:scale-95 min-h-[120px]" onClick={() => setShowGoogleBusiness(true)}>
            <CardHeader>
              <Building2 className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base sm:text-lg">Google Business Profile</CardTitle>
              <CardDescription className="text-sm">Sync reviews, hours, and business info</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition active:scale-95 min-h-[120px]" onClick={() => setShowReviews(true)}>
            <CardHeader>
              <Star className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base sm:text-lg">Reviews Management</CardTitle>
              <CardDescription className="text-sm">View and respond to Google reviews</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition active:scale-95 min-h-[120px]" onClick={() => navigate('/consultations')}>
            <CardHeader>
              <Calendar className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base sm:text-lg">Virtual Consultations</CardTitle>
              <CardDescription className="text-sm">Book and manage video consultations</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition active:scale-95 min-h-[120px]" onClick={() => navigate('/calendar')}>
            <CardHeader>
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-base sm:text-lg">Calendar Management</CardTitle>
              <CardDescription className="text-sm">Sync calendars and manage availability</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition active:scale-95 min-h-[120px]" onClick={() => navigate('/oauth-connections')}>
            <CardHeader>
              <Link2 className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle className="text-base sm:text-lg">OAuth Connections</CardTitle>
              <CardDescription className="text-sm">Manage calendar and business integrations</CardDescription>
            </CardHeader>
          </Card>

        </div>
      </div>
    </div>
    <MobileNav />
    </>
  );
}

