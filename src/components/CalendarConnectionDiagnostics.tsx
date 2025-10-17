import { useState } from 'react';
import { Activity, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface DiagnosticResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

export function CalendarConnectionDiagnostics() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [running, setRunning] = useState(false);

  const runDiagnostics = async () => {
    setRunning(true);
    const diagnostics: DiagnosticResult[] = [];

    // Check 1: User Authentication
    try {
      const { data: { user } } = await supabase.auth.getUser();
      diagnostics.push({
        name: 'User Authentication',
        status: user ? 'pass' : 'fail',
        message: user ? `Logged in as ${user.email}` : 'Not authenticated'
      });
    } catch (err) {
      diagnostics.push({
        name: 'User Authentication',
        status: 'fail',
        message: 'Failed to check auth status'
      });
    }

    // Check 2: Environment Variables
    const hasClientId = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const hasApiKey = !!import.meta.env.VITE_GOOGLE_API_KEY;
    diagnostics.push({
      name: 'Environment Variables',
      status: hasClientId && hasApiKey ? 'pass' : 'fail',
      message: `Client ID: ${hasClientId ? '✓' : '✗'}, API Key: ${hasApiKey ? '✓' : '✗'}`
    });

    // Check 3: Database Table
    try {
      const { error } = await supabase.from('google_calendar_tokens').select('count').limit(1);
      diagnostics.push({
        name: 'Database Table',
        status: error ? 'fail' : 'pass',
        message: error ? error.message : 'Table exists and accessible'
      });
    } catch (err) {
      diagnostics.push({
        name: 'Database Table',
        status: 'fail',
        message: 'Cannot access google_calendar_tokens table'
      });
    }

    // Check 4: Edge Function
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
        body: { action: 'getAuthUrl' }
      });
      diagnostics.push({
        name: 'Edge Function',
        status: error ? 'fail' : 'pass',
        message: error ? error.message : 'Function responding correctly'
      });
    } catch (err: any) {
      diagnostics.push({
        name: 'Edge Function',
        status: 'fail',
        message: err.message || 'Function not accessible'
      });
    }

    // Check 5: Stored Tokens
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('google_calendar_tokens')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          const isExpired = new Date(data.token_expiry) <= new Date();
          diagnostics.push({
            name: 'Stored Tokens',
            status: isExpired ? 'warning' : 'pass',
            message: isExpired ? 'Token expired, needs refresh' : 'Valid tokens found'
          });
        } else {
          diagnostics.push({
            name: 'Stored Tokens',
            status: 'warning',
            message: 'No tokens stored - connect calendar'
          });
        }
      }
    } catch (err) {
      diagnostics.push({
        name: 'Stored Tokens',
        status: 'warning',
        message: 'No tokens found'
      });
    }

    setResults(diagnostics);
    setRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default: return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Connection Diagnostics</h3>
        </div>
        <Button 
          onClick={runDiagnostics} 
          disabled={running}
          variant="outline"
        >
          {running ? (
            <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Running...</>
          ) : (
            <><Activity className="w-4 h-4 mr-2" /> Run Tests</>
          )}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              {getStatusIcon(result.status)}
              <div className="flex-1">
                <p className="font-medium text-sm">{result.name}</p>
                <p className="text-xs text-gray-600 mt-1">{result.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
