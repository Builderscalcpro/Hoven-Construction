import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, User, Calendar, Building2, Key, Shield, Link2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function GoogleOAuthTest() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>({
    auth: null,
    calendar: null,
    business: null,
    config: null
  });
  const [diagnostics, setDiagnostics] = useState<any>({});

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    const config = {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      hasClientId: !!import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirectUri: `${window.location.origin}/auth/callback`,
      currentUser: user?.email,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
    };

    setDiagnostics(config);
    setTestResults(prev => ({ ...prev, config }));
  };

  const testGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/google-oauth-test`,
          scopes: 'email profile',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) throw error;

      setTestResults(prev => ({
        ...prev,
        auth: { success: true, message: 'OAuth initiated successfully', data }
      }));
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        auth: { success: false, message: error.message, error }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testCalendarConnection = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/google-oauth-test`,
          scopes: 'email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) throw error;

      setTestResults(prev => ({
        ...prev,
        calendar: { success: true, message: 'Calendar OAuth initiated', data }
      }));
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        calendar: { success: false, message: error.message, error }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testBusinessProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/google-oauth-test`,
          scopes: 'email profile https://www.googleapis.com/auth/business.manage',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) throw error;

      setTestResults(prev => ({
        ...prev,
        business: { success: true, message: 'Business Profile OAuth initiated', data }
      }));
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        business: { success: false, message: error.message, error }
      }));
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentSession = async () => {
    setLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      const sessionInfo = {
        hasSession: !!session,
        provider: session?.user?.app_metadata?.provider,
        email: session?.user?.email,
        expiresAt: session?.expires_at,
        accessToken: session?.access_token ? 'Present' : 'Missing',
        refreshToken: session?.refresh_token ? 'Present' : 'Missing',
        providerToken: session?.provider_token ? 'Present' : 'Missing',
        providerRefreshToken: session?.provider_refresh_token ? 'Present' : 'Missing'
      };

      setDiagnostics(prev => ({ ...prev, session: sessionInfo }));
    } catch (error: any) {
      setDiagnostics(prev => ({ 
        ...prev, 
        session: { error: error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = ({ status }: { status: any }) => {
    if (!status) return <AlertCircle className="h-5 w-5 text-gray-400" />;
    return status.success ? 
      <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
      <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Google OAuth Integration Test</h1>
        <p className="text-muted-foreground">Test and diagnose Google OAuth, Calendar, and Business Profile integrations</p>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Configuration Status
            </CardTitle>
            <CardDescription>Current environment and configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Google Client ID</span>
                <Badge variant={diagnostics.hasClientId ? "success" : "destructive"}>
                  {diagnostics.hasClientId ? 'Configured' : 'Missing'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Supabase Connection</span>
                <Badge variant={diagnostics.hasSupabaseKey ? "success" : "destructive"}>
                  {diagnostics.hasSupabaseKey ? 'Connected' : 'Not Connected'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current User</span>
                <span className="text-sm text-muted-foreground">
                  {diagnostics.currentUser || 'Not signed in'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Redirect URI</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {diagnostics.redirectUri}
                </code>
              </div>
            </div>
            <Button 
              onClick={checkCurrentSession} 
              className="w-full mt-4"
              disabled={loading}
            >
              {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
              Check Current Session
            </Button>
          </CardContent>
        </Card>

        {diagnostics.session && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Session Information</AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-1 text-xs">
                <div>Provider: {diagnostics.session.provider || 'None'}</div>
                <div>Email: {diagnostics.session.email || 'None'}</div>
                <div>Access Token: {diagnostics.session.accessToken}</div>
                <div>Refresh Token: {diagnostics.session.refreshToken}</div>
                <div>Provider Token: {diagnostics.session.providerToken}</div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Tabs defaultValue="auth" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="business">Business Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Google Sign-In Test
              </CardTitle>
              <CardDescription>Test basic Google OAuth authentication</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testGoogleSignIn} 
                className="w-full"
                disabled={loading}
              >
                {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
                Test Google Sign-In
              </Button>
              
              {testResults.auth && (
                <Alert className="mt-4" variant={testResults.auth.success ? "default" : "destructive"}>
                  <StatusIcon status={testResults.auth} />
                  <AlertTitle>{testResults.auth.success ? 'Success' : 'Failed'}</AlertTitle>
                  <AlertDescription>{testResults.auth.message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Google Calendar Connection
              </CardTitle>
              <CardDescription>Test calendar API permissions and connection</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testCalendarConnection} 
                className="w-full"
                disabled={loading}
              >
                {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
                Connect Google Calendar
              </Button>
              
              {testResults.calendar && (
                <Alert className="mt-4" variant={testResults.calendar.success ? "default" : "destructive"}>
                  <StatusIcon status={testResults.calendar} />
                  <AlertTitle>{testResults.calendar.success ? 'Success' : 'Failed'}</AlertTitle>
                  <AlertDescription>{testResults.calendar.message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Google Business Profile
              </CardTitle>
              <CardDescription>Test Business Profile API access</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testBusinessProfile} 
                className="w-full"
                disabled={loading}
              >
                {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
                Connect Business Profile
              </Button>
              
              {testResults.business && (
                <Alert className="mt-4" variant={testResults.business.success ? "default" : "destructive"}>
                  <StatusIcon status={testResults.business} />
                  <AlertTitle>{testResults.business.success ? 'Success' : 'Failed'}</AlertTitle>
                  <AlertDescription>{testResults.business.message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}