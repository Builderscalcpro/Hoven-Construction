import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailCampaignBuilder from '@/components/EmailCampaignBuilder';
import EmailDripAnalytics from '@/components/EmailDripAnalytics';
import EmailTemplates from '@/components/EmailTemplates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, BarChart3, Mail } from 'lucide-react';

export default function EmailDripCampaigns() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Email Drip Campaigns</h1>
        <p className="text-muted-foreground">Automated email sequences that nurture leads and drive conversions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              High-Value Leads
            </CardTitle>
            <CardDescription>Immediate personal email + 24hr follow-up</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              Medium-Value Leads
            </CardTitle>
            <CardDescription>Next-day email + 3-day follow-up</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              Standard Leads
            </CardTitle>
            <CardDescription>3-day email + weekly nurture sequence</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <EmailCampaignBuilder />
        </TabsContent>

        <TabsContent value="templates">
          <EmailTemplates />
        </TabsContent>

        <TabsContent value="analytics">
          <EmailDripAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
