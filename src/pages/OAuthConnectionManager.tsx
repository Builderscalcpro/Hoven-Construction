import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Building2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { GoogleCalendarSetup } from '@/components/GoogleCalendarSetup';
import { OutlookCalendarSetup } from '@/components/OutlookCalendarSetup';
import AppleCalendarSetup from '@/components/AppleCalendarSetup';
import GoogleBusinessOAuthSetup from '@/components/GoogleBusinessOAuthSetup';
import { MultiAccountManager } from '@/components/MultiAccountManager';
import { OAuthTokenRefreshMonitor } from '@/components/OAuthTokenRefreshMonitor';


interface Account {
  id: string;
  email: string;
  account_label?: string;
  is_primary: boolean;
  sync_enabled: boolean;
  expires_at?: string;
  scope?: string;
  updated_at?: string;
}

export default function OAuthConnectionManager() {
  const { user } = useAuth();
  const [googleAccounts, setGoogleAccounts] = useState<Account[]>([]);
  const [outlookAccounts, setOutlookAccounts] = useState<Account[]>([]);
  const [appleAccounts, setAppleAccounts] = useState<Account[]>([]);
  const [googleBizAccounts, setGoogleBizAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddGoogle, setShowAddGoogle] = useState(false);
  const [showAddOutlook, setShowAddOutlook] = useState(false);
  const [showAddApple, setShowAddApple] = useState(false);
  const [showAddGoogleBiz, setShowAddGoogleBiz] = useState(false);

  useEffect(() => {
    if (user) loadAllAccounts();
  }, [user]);

  const loadAllAccounts = async () => {
    try {
      setLoading(true);
      
      // Load Google Calendar accounts
      const { data: google, error: googleError } = await supabase
        .from('google_calendar_tokens')
        .select('*')
        .eq('user_id', user!.id);
      
      if (googleError) {
        console.error('Error loading Google accounts:', googleError);
      }
      
      // Load Outlook accounts
      const { data: outlook, error: outlookError } = await supabase
        .from('outlook_calendar_tokens')
        .select('*')
        .eq('user_id', user!.id);
      
      if (outlookError) {
        console.error('Error loading Outlook accounts:', outlookError);
      }
      
      // Load Apple accounts
      const { data: apple, error: appleError } = await supabase
        .from('apple_calendar_tokens')
        .select('*')
        .eq('user_id', user!.id);
      
      if (appleError) {
        console.error('Error loading Apple accounts:', appleError);
      }
      
      // Load Google Business accounts
      const { data: googleBiz, error: googleBizError } = await supabase
        .from('google_business_tokens')
        .select('*')
        .eq('user_id', user!.id);
      
      if (googleBizError) {
        console.error('Error loading Google Business accounts:', googleBizError);
      }
      
      setGoogleAccounts(google || []);
      setOutlookAccounts(outlook || []);
      setAppleAccounts(apple || []);
      setGoogleBizAccounts(googleBiz || []);
      
      console.log('Loaded accounts:', { 
        google: google?.length || 0, 
        outlook: outlook?.length || 0, 
        apple: apple?.length || 0, 
        googleBiz: googleBiz?.length || 0 
      });
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <div className="container mx-auto p-6"><div className="text-center">Loading...</div></div>;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">OAuth Connection Manager</h1>
        <p className="text-muted-foreground">Manage multiple accounts for each calendar provider</p>
      </div>

      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="accounts">My Accounts</TabsTrigger>
          <TabsTrigger value="connect">Add New Account</TabsTrigger>
          <TabsTrigger value="monitor">Token Refresh Monitor</TabsTrigger>
        </TabsList>


        <TabsContent value="accounts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  <CardTitle>Google Calendar Accounts</CardTitle>
                </div>
                <Button size="sm" onClick={() => setShowAddGoogle(true)}><Plus className="w-4 h-4 mr-2" />Add Account</Button>
              </div>
            </CardHeader>
            <CardContent>
              {googleAccounts.length > 0 ? (
                <MultiAccountManager accounts={googleAccounts.map(a => ({ ...a, provider: 'google' }))} provider="Google Calendar" tableName="google_calendar_tokens" onUpdate={loadAllAccounts} />
              ) : <p className="text-sm text-muted-foreground">No Google Calendar accounts connected</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  <CardTitle>Outlook Calendar Accounts</CardTitle>
                </div>
                <Button size="sm" onClick={() => setShowAddOutlook(true)}><Plus className="w-4 h-4 mr-2" />Add Account</Button>
              </div>
            </CardHeader>
            <CardContent>
              {outlookAccounts.length > 0 ? (
                <MultiAccountManager accounts={outlookAccounts.map(a => ({ ...a, provider: 'outlook' }))} provider="Outlook Calendar" tableName="outlook_calendar_tokens" onUpdate={loadAllAccounts} />
              ) : <p className="text-sm text-muted-foreground">No Outlook accounts connected</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  <CardTitle>Apple Calendar Accounts</CardTitle>
                </div>
                <Button size="sm" onClick={() => setShowAddApple(true)}><Plus className="w-4 h-4 mr-2" />Add Account</Button>
              </div>
            </CardHeader>
            <CardContent>
              {appleAccounts.length > 0 ? (
                <MultiAccountManager accounts={appleAccounts.map(a => ({ ...a, email: a.apple_id || '', provider: 'apple' }))} provider="Apple Calendar" tableName="apple_calendar_tokens" onUpdate={loadAllAccounts} />
              ) : <p className="text-sm text-muted-foreground">No Apple Calendar accounts connected</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6" />
                  <CardTitle>Google Business Accounts</CardTitle>
                </div>
                <Button size="sm" onClick={() => setShowAddGoogleBiz(true)}><Plus className="w-4 h-4 mr-2" />Add Account</Button>
              </div>
            </CardHeader>
            <CardContent>
              {googleBizAccounts.length > 0 ? (
                <MultiAccountManager accounts={googleBizAccounts.map(a => ({ ...a, email: a.account_name || '', provider: 'google-business' }))} provider="Google Business" tableName="google_business_tokens" onUpdate={loadAllAccounts} />
              ) : <p className="text-sm text-muted-foreground">No Google Business accounts connected</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connect" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <GoogleCalendarSetup />
            <OutlookCalendarSetup />
            <Card>
              <CardHeader>
                <CardTitle>Google Business Profile</CardTitle>
                <CardDescription>Connect your Google Business Profile</CardDescription>
              </CardHeader>
              <CardContent>
                <GoogleBusinessOAuthSetup onConnected={loadAllAccounts} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Apple Calendar</CardTitle>
                <CardDescription>Connect using app-specific password</CardDescription>
              </CardHeader>
              <CardContent>
                <AppleCalendarSetup />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitor">
          <OAuthTokenRefreshMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
