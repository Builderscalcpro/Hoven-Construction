import { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/button';
import { Card } from './ui/card';

export default function GoogleCalendarDiagnostics() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      checks: []
    };

    try {
      // Check 1: User Authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      diagnostics.checks.push({
        name: 'User Authentication',
        status: user && !authError ? 'pass' : 'fail',
        message: user ? `Logged in as ${user.email}` : authError?.message || 'Not authenticated',
        details: { userId: user?.id }
      });

      if (!user) {
        setResults(diagnostics);
        setLoading(false);
        return;
      }

      // Check 2: Token Storage
      const { data: tokens, error: tokenError } = await supabase
        .from('google_calendar_tokens')
        .select('*')
        .eq('user_id', user.id);

      diagnostics.checks.push({
        name: 'Token Storage',
        status: tokens && tokens.length > 0 && !tokenError ? 'pass' : 'fail',
        message: tokens?.length ? `Found ${tokens.length} calendar(s)` : tokenError?.message || 'No tokens found',
        details: tokens
      });

      // Check 3: Token Expiry
      if (tokens && tokens.length > 0) {
        const primaryToken = tokens.find(t => t.is_primary) || tokens[0];
        const isExpired = new Date(primaryToken.token_expiry) <= new Date();
        diagnostics.checks.push({
          name: 'Token Expiry',
          status: !isExpired ? 'pass' : 'warning',
          message: isExpired ? 'Token expired, needs refresh' : 'Token is valid',
          details: { expiry: primaryToken.token_expiry }
        });
      }

      // Check 4: Edge Function Connectivity
      try {
        const { data: authUrlData, error: authUrlError } = await supabase.functions.invoke('google-calendar-auth', {
          body: { action: 'getAuthUrl' }
        });
        diagnostics.checks.push({
          name: 'Edge Function (Auth)',
          status: authUrlData && !authUrlError ? 'pass' : 'fail',
          message: authUrlData ? 'Function responding' : authUrlError?.message || 'Function not responding',
          details: authUrlError
        });
      } catch (err: any) {
        diagnostics.checks.push({
          name: 'Edge Function (Auth)',
          status: 'fail',
          message: err.message,
          details: err
        });
      }

      // Check 5: Environment Variables
      const hasClientId = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;
      diagnostics.checks.push({
        name: 'Client ID Configuration',
        status: hasClientId ? 'pass' : 'fail',
        message: hasClientId ? 'VITE_GOOGLE_CLIENT_ID is set' : 'Missing VITE_GOOGLE_CLIENT_ID'
      });

    } catch (error: any) {
      diagnostics.checks.push({
        name: 'Diagnostic Error',
        status: 'fail',
        message: error.message,
        details: error
      });
    }

    setResults(diagnostics);
    setLoading(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Google Calendar Diagnostics</h3>
        <Button onClick={runDiagnostics} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Run Diagnostics
        </Button>
      </div>

      {results && (
        <div className="space-y-3">
          {results.checks.map((check: any, idx: number) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              {check.status === 'pass' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
              {check.status === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />}
              {check.status === 'fail' && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{check.name}</div>
                <div className="text-sm text-gray-600">{check.message}</div>
                {check.details && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-500 cursor-pointer">View Details</summary>
                    <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(check.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
