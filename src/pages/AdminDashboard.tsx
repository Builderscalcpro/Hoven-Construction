import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, CreditCard, BarChart3, Bot, Star, Image } from 'lucide-react';
import InvoiceManagement from '@/components/InvoiceManagement';
import ProjectManagement from '@/pages/ProjectManagement';
import EmailTemplates from '@/components/EmailTemplates';
import NotificationSettings from '@/components/NotificationSettings';
import PaymentTracking from '@/components/PaymentTracking';
import CRMDashboard from '@/components/CRMDashboard';
import AIChatbotConfig from '@/components/admin/AIChatbotConfig';
import ReviewsManagementDashboard from '@/components/ReviewsManagementDashboard';
import PortfolioImageManager from '@/components/admin/PortfolioImageManager';


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Manage your business operations and settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex w-auto min-w-full">
            <TabsTrigger value="overview" className="whitespace-nowrap">Overview</TabsTrigger>
            <TabsTrigger value="reviews" className="whitespace-nowrap">Reviews</TabsTrigger>
            <TabsTrigger value="crm" className="whitespace-nowrap">CRM</TabsTrigger>
            <TabsTrigger value="projects" className="whitespace-nowrap">Projects</TabsTrigger>
            <TabsTrigger value="invoices" className="whitespace-nowrap">Invoices</TabsTrigger>
            <TabsTrigger value="payments" className="whitespace-nowrap">Payments</TabsTrigger>
            <TabsTrigger value="communications" className="whitespace-nowrap">Comms</TabsTrigger>
            <TabsTrigger value="ai-chatbot" className="whitespace-nowrap">AI Bot</TabsTrigger>
            <TabsTrigger value="portfolio" className="whitespace-nowrap">Portfolio</TabsTrigger>
          </TabsList>
        </div>



        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">3 starting this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,350</div>
                <p className="text-xs text-muted-foreground">+180 new this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">AI chatbot conversations</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsManagementDashboard />
        </TabsContent>

        <TabsContent value="crm">
          <CRMDashboard />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectManagement />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoiceManagement />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentTracking />
        </TabsContent>

        <TabsContent value="communications">
          <div className="space-y-6">
            <EmailTemplates />
            <NotificationSettings />
          </div>
        </TabsContent>

        <TabsContent value="ai-chatbot">
          <AIChatbotConfig />
        </TabsContent>

        <TabsContent value="portfolio">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Portfolio Management</span>
                  <a 
                    href="/admin/portfolio" 
                    className="text-sm font-normal text-blue-600 hover:text-blue-700 underline"
                  >
                    Open Advanced Manager →
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Quick access to portfolio images. For advanced features like drag-and-drop reordering, 
                  bulk uploads, and image editing, use the Advanced Manager.
                </p>
              </CardContent>
            </Card>
            <PortfolioImageManager />
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
