import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Database, Key, Globe, Server } from 'lucide-react';

interface DebugInfo {
  status: 'success' | 'error' | 'warning' | 'checking';
  message: string;
  details?: any;
}

export default function GoogleBusinessDebugger() {
  const [debugInfo, setDebugInfo] = useState<Record<string, DebugInfo>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);
    const results: Record<string, DebugInfo> = {};

    // Check environment variables
    const clientId = import.meta.env.VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID;
    results.clientId = {
      status: clientId ? 'success' : 'error',
      message: clientId ? 'Client ID configured' : 'Client ID missing',
      details: clientId ? `${clientId.substring(0, 10)}...` : 'Not set'
    };

    // Check database connection
    try {
      const { data: { user } } = await supabase.auth.getUser();
      results.auth = {
        status: user ? 'success' : 'warning',
        message: user ? 'User authenticated' : 'Not authenticated',
        details: user?.email
      };

      if (user) {
        // Check tokens table
        const { data: tokens, error: tokenError } = await supabase
          .from('google_business_tokens')
          .select('*')
          .eq('user_id', user.id)
          .single();

        results.tokens = {
          status: tokens ? 'success' : tokenError ? 'error' : 'warning',
          message: tokens ? 'Tokens found' : tokenError ? 'Database error' : 'No tokens stored',
          details: tokens ? {
            hasAccessToken: !!tokens.access_token,
            hasRefreshToken: !!tokens.refresh_token,
            accountId: tokens.account_id,
            locationId: tokens.location_id,
            expiresAt: tokens.expires_at
          } : tokenError?.message
        };

        // Test edge function
        if (tokens?.access_token) {
          try {
            const { data, error } = await supabase.functions.invoke('google-business-reviews', {
              body: {
                accessToken: tokens.access_token,
                accountId: tokens.account_id,
                locationId: tokens.location_id,
                action: 'listReviews'
              }
            });

            results.edgeFunction = {
              status: error ? 'error' : 'success',
              message: error ? 'Edge function failed' : 'Edge function working',
              details: error || data
            };
          } catch (err) {
            results.edgeFunction = {
              status: 'error',
              message: 'Edge function error',
              details: err.message
            };
          }
        }
      }
    } catch (error) {
      results.database = {
        status: 'error',
        message: 'Database connection failed',
        details: error.message
      };
    }

    // Check Google API endpoint
    try {
      const response = await fetch('https://mybusiness.googleapis.com/$discovery/rest?version=v4');
      results.googleApi = {
        status: response.ok ? 'success' : 'warning',
        message: response.ok ? 'Google API accessible' : 'Google API unreachable',
        details: `Status: ${response.status}`
      };
    } catch (error) {
      results.googleApi = {
        status: 'error',
        message: 'Cannot reach Google API',
        details: error.message
      };
    }

    setDebugInfo(results);
    setLoading(false);
  };

  const getIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <RefreshCw className="w-5 h-5 animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      success: 'default',
      error: 'destructive',
      warning: 'secondary',
      checking: 'outline'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Google Business Profile Diagnostics
          <Button onClick={runDiagnostics} disabled={loading} size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(debugInfo).map(([key, info]) => (
          <Alert key={key}>
            <div className="flex items-start gap-3">
              {getIcon(info.status)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  {getStatusBadge(info.status)}
                </div>
                <AlertDescription>
                  <p>{info.message}</p>
                  {info.details && (
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {typeof info.details === 'object' 
                        ? JSON.stringify(info.details, null, 2) 
                        : info.details}
                    </pre>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        ))}

        {Object.keys(debugInfo).length === 0 && !loading && (
          <Alert>
            <AlertCircle className="w-5 h-5" />
            <AlertDescription>
              Click "Refresh" to run diagnostics
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}