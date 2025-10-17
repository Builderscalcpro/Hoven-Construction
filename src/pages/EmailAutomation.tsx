import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AutomatedEmailRules from '@/components/admin/AutomatedEmailRules';
import AutomatedEmailLog from '@/components/AutomatedEmailLog';
import AppointmentStatusManager from '@/components/admin/AppointmentStatusManager';
import EmailTemplateManager from './EmailTemplateManager';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Mail, Clock, Users, Play } from 'lucide-react';

export default function EmailAutomation() {
  const [running, setRunning] = useState(false);

  const runAutomation = async () => {
    setRunning(true);
    toast.info('Running email automation...');
    
    try {
      const { data, error } = await supabase.functions.invoke('automated-email-scheduler');
      
      if (error) throw error;
      
      toast.success(`Automation completed! Sent ${data.sent?.length || 0} emails`);
    } catch (error: any) {
      toast.error('Failed to run automation: ' + error.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Email Automation</h1>
        <p className="text-gray-600">Manage automated follow-up emails and campaigns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thank You Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Auto-sent</div>
            <p className="text-xs text-muted-foreground">After appointment completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24h delay</div>
            <p className="text-xs text-muted-foreground">After completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Re-engagement</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90 days</div>
            <p className="text-xs text-muted-foreground">Inactive clients</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manual Trigger</CardTitle>
          <CardDescription>Run the email automation system manually for testing</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runAutomation} disabled={running}>
            <Play className="mr-2 h-4 w-4" />
            {running ? 'Running...' : 'Run Automation Now'}
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="logs">Email Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <AppointmentStatusManager />
        </TabsContent>


        <TabsContent value="rules">
          <AutomatedEmailRules />
        </TabsContent>

        <TabsContent value="templates">
          <EmailTemplateManager />
        </TabsContent>

        <TabsContent value="logs">
          <AutomatedEmailLog />
        </TabsContent>
      </Tabs>
    </div>
  );
}