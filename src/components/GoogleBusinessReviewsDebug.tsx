import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, XCircle, PlayCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DiagnosticResult {
  label: string;
  status: boolean | null;
  message?: string;
}

export default function GoogleBusinessReviewsDebug({ tokenData }: any) {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setTesting(true);
    setError(null);
    const diagnostics: DiagnosticResult[] = [];

    // Check 1: Token Data Present
    diagnostics.push({
      label: 'Google Business Token Data',
      status: !!tokenData,
      message: tokenData ? 'Token data found in database' : 'No token data found'
    });

    // Check 2: Access Token
    diagnostics.push({
      label: 'Access Token',
      status: !!tokenData?.access_token,
      message: tokenData?.access_token ? 'Access token present' : 'Missing access token'
    });

    // Check 3: Account ID
    diagnostics.push({
      label: 'Account ID',
      status: !!tokenData?.account_id,
      message: tokenData?.account_id ? `Account ID: ${tokenData.account_id}` : 'Missing account ID'
    });

    // Check 4: Location ID
    diagnostics.push({
      label: 'Location ID',
      status: !!tokenData?.location_id,
      message: tokenData?.location_id ? `Location ID: ${tokenData.location_id}` : 'Missing location ID'
    });

    // Check 5: Token Expiry
    if (tokenData?.expires_at) {
      const expiresAt = new Date(tokenData.expires_at);
      const now = new Date();
      const isExpired = expiresAt < now;
      diagnostics.push({
        label: 'Token Expiry',
        status: !isExpired,
        message: isExpired ? `Token expired on ${expiresAt.toLocaleString()}` : `Valid until ${expiresAt.toLocaleString()}`
      });
    }

    // Check 6: API Connection Test
    if (tokenData?.access_token && tokenData?.account_id && tokenData?.location_id) {
      try {
        const response = await fetch(
          `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${tokenData.account_id}/locations/${tokenData.location_id}`,
          { headers: { 'Authorization': `Bearer ${tokenData.access_token}` } }
        );
        
        diagnostics.push({
          label: 'Google API Connection',
          status: response.ok,
          message: response.ok ? 'Successfully connected to Google API' : `API returned ${response.status}: ${response.statusText}`
        });

        if (!response.ok) {
          const errorText = await response.text();
          setError(`API Error: ${errorText}`);
        }
      } catch (err: any) {
        diagnostics.push({
          label: 'Google API Connection',
          status: false,
          message: `Connection failed: ${err.message}`
        });
        setError(err.message);
      }
    } else {
      diagnostics.push({
        label: 'Google API Connection',
        status: null,
        message: 'Cannot test - missing required credentials'
      });
    }

    // Check 7: Reviews Table
    try {
      const { count, error: reviewsError } = await supabase
        .from('google_reviews')
        .select('*', { count: 'exact', head: true });
      
      diagnostics.push({
        label: 'Reviews Database Table',
        status: !reviewsError,
        message: reviewsError ? `Error: ${reviewsError.message}` : `${count || 0} reviews in database`
      });
    } catch (err: any) {
      diagnostics.push({
        label: 'Reviews Database Table',
        status: false,
        message: `Database error: ${err.message}`
      });
    }

    setResults(diagnostics);
    setTesting(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Google Reviews Diagnostics
        </CardTitle>
        <CardDescription>
          Run comprehensive diagnostics to troubleshoot Google Business reviews integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button 
          onClick={runDiagnostics} 
          disabled={testing}
          size="lg"
          className="w-full"
        >
          {testing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            <>
              <PlayCircle className="w-5 h-5 mr-2" />
              Run Diagnostics
            </>
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Diagnostic Results</h3>
            {results.map((result, index) => (
              <DiagnosticItem key={index} result={result} />
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              <strong>Error Details:</strong>
              <pre className="mt-2 text-xs overflow-auto">{error}</pre>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function DiagnosticItem({ result }: { result: DiagnosticResult }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
      <div className="mt-0.5">
        {result.status === true && <CheckCircle className="w-5 h-5 text-green-500" />}
        {result.status === false && <XCircle className="w-5 h-5 text-red-500" />}
        {result.status === null && <AlertCircle className="w-5 h-5 text-gray-400" />}
      </div>
      <div className="flex-1">
        <p className="font-medium">{result.label}</p>
        <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
      </div>
    </div>
  );
}
