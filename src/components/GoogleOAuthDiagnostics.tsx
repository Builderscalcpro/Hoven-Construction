import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function GoogleOAuthDiagnostics() {
  const clientId = import.meta.env.VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/google-business-callback`;
  
  const checks = [
    {
      name: 'Client ID Configured',
      status: !!clientId,
      value: clientId || 'Not set',
      fix: 'Add VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID to .env and restart dev server'
    },
    {
      name: 'Client ID Format',
      status: clientId?.includes('.apps.googleusercontent.com'),
      value: clientId?.includes('.apps.googleusercontent.com') ? 'Valid format' : 'Invalid or missing',
      fix: 'Client ID should end with .apps.googleusercontent.com (not an API key starting with AIza)'
    },
    {
      name: 'Redirect URI',
      status: true,
      value: redirectUri,
      fix: 'Add this URL to Google Cloud Console Authorized redirect URIs'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>OAuth Configuration Diagnostics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {checks.map((check) => (
          <Alert key={check.name} variant={check.status ? 'default' : 'destructive'}>
            <div className="flex items-start gap-3">
              {check.status ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-semibold">{check.name}</div>
                <AlertDescription className="mt-1">
                  <div className="text-sm mb-2">
                    <strong>Value:</strong> <code className="bg-muted px-1 py-0.5 rounded">{check.value}</code>
                  </div>
                  {!check.status && (
                    <div className="text-sm">
                      <strong>Fix:</strong> {check.fix}
                    </div>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        ))}
        
        <Alert>
          <AlertCircle className="w-5 h-5" />
          <AlertDescription>
            <strong>Important:</strong> After adding or changing environment variables, you must restart your dev server for changes to take effect.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
