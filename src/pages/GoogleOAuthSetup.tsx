import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertCircle, Copy, ExternalLink, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import GoogleOAuthDiagnostics from '@/components/GoogleOAuthDiagnostics';


export default function GoogleOAuthSetup() {
  const { toast } = useToast();
  const [status, setStatus] = useState({
    envVarsSet: false,
    redirectUrisConfigured: false,
    oauthAuthorized: false,
    reviewsSyncing: false
  });
  const [loading, setLoading] = useState(false);

  const clientId = '309881425631-rlso29r8fj72194v07n1j5eo5sspa7ck';
  
  const redirectUris = {
    development: [
      'http://localhost:5173/google-business-callback',
      'http://localhost:5173/google-calendar-callback',
      'http://localhost:5173/calendar-callback'
    ],
    production: [
      'https://njxhcmqtbkzvqpbqxfpn.supabase.co/google-business-callback',
      'https://njxhcmqtbkzvqpbqxfpn.supabase.co/google-calendar-callback',
      'https://njxhcmqtbkzvqpbqxfpn.supabase.co/calendar-callback'
    ]
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    // Check if environment variables are set
    const hasClientId = !!import.meta.env.VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID;
    
    // Check if OAuth tokens exist in database
    const { data: tokens } = await supabase
      .from('oauth_tokens')
      .select('*')
      .eq('provider', 'google_business')
      .single();
    
    // Check if reviews exist
    const { data: reviews } = await supabase
      .from('google_reviews')
      .select('id')
      .limit(1);
    
    setStatus({
      envVarsSet: hasClientId,
      redirectUrisConfigured: false, // Manual check required
      oauthAuthorized: !!tokens,
      reviewsSyncing: !!reviews && reviews.length > 0
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "URI copied to clipboard"
    });
  };

  const startOAuthFlow = () => {
    setLoading(true);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUris.development[0])}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('https://www.googleapis.com/auth/business.manage')}&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    window.location.href = authUrl;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Diagnostics Card */}
      <GoogleOAuthDiagnostics />
      
      <Card>
        <CardHeader>
          <CardTitle>Google OAuth Setup Guide</CardTitle>
          <CardDescription>
            Complete setup for Google Business Profile integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Step 1: Environment Variables */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {status.envVarsSet ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <h3 className="font-semibold">Step 1: Environment Variables</h3>
            </div>
            <Alert className={status.envVarsSet ? 'border-green-500' : 'border-yellow-500'}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Client ID Configuration</AlertTitle>
              <AlertDescription>
                {status.envVarsSet ? (
                  <span className="text-green-600">✅ Client ID is configured in .env</span>
                ) : (
                  <span>Add VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID to your .env file</span>
                )}
              </AlertDescription>
            </Alert>
          </div>

          {/* Step 2: Add Redirect URIs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold">Step 2: Configure Redirect URIs</h3>
            </div>
            
            <Alert>
              <AlertTitle>Add these URIs to Google Cloud Console</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="space-y-2">
                  <p>Client ID: <code className="bg-gray-100 px-2 py-1 rounded">{clientId}</code></p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
                  >
                    Open Google Cloud Console <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Development URIs:</h4>
                <div className="space-y-1">
                  {redirectUris.development.map((uri) => (
                    <div key={uri} className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">{uri}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(uri)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Production URIs:</h4>
                <div className="space-y-1">
                  {redirectUris.production.map((uri) => (
                    <div key={uri} className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">{uri}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(uri)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Complete OAuth */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {status.oauthAuthorized ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <h3 className="font-semibold">Step 3: Authorize Google Business Profile</h3>
            </div>
            
            {status.oauthAuthorized ? (
              <Alert className="border-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Connected!</AlertTitle>
                <AlertDescription>
                  Google Business Profile is successfully connected
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                <Alert>
                  <AlertDescription>
                    After adding the redirect URIs, click the button below to connect your Google Business Profile
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={startOAuthFlow} 
                  disabled={loading}
                  className="w-full"
                >
                  Connect Google Business Profile <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Step 4: Verify Reviews Sync */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {status.reviewsSyncing ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-gray-400" />
              )}
              <h3 className="font-semibold">Step 4: Reviews Syncing</h3>
            </div>
            
            <Alert className={status.reviewsSyncing ? 'border-green-500' : ''}>
              <AlertDescription>
                {status.reviewsSyncing ? (
                  <span className="text-green-600">✅ Reviews are syncing successfully</span>
                ) : (
                  <span>Reviews will start syncing after OAuth authorization</span>
                )}
              </AlertDescription>
            </Alert>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/admin'}
              >
                Go to Admin Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={checkStatus}
              >
                Refresh Status
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}