import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Copy, ExternalLink, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function GoogleBusinessQuickConnect() {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const { toast } = useToast();
  
  const clientId = import.meta.env.VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/google-business-callback`;
  
  // Debug: Check if Client ID exists
  console.log('Client ID exists:', !!import.meta.env.VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID);
  console.log('Client ID value:', import.meta.env.VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID);


  const copyToClipboard = (text: string, type: 'id' | 'env') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    }
    toast({ title: 'Copied!', description: 'Text copied to clipboard' });
  };

  const steps = [
    {
      title: 'Enable Google Business API',
      description: 'Open Google Cloud Console and enable the API',
      action: () => window.open('https://console.cloud.google.com/apis/library/mybusinessbusinessinformation.googleapis.com', '_blank'),
      buttonText: 'Open Console'
    },
    {
      title: 'Create OAuth Credentials',
      description: 'Set up OAuth 2.0 client with redirect URI',
      code: redirectUri,
      copyable: true
    },
    {
      title: 'Add Client ID to Environment',
      description: 'Copy this to your .env file',
      code: `VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID=${clientId || 'your-client-id-here'}`,
      copyable: true
    },
    {
      title: 'Connect Your Account',
      description: 'Click below to connect with Google',
      action: () => window.location.href = '/google-business-connect',
      buttonText: 'Connect Now'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Quick Connect Google Business</h1>
        <p className="text-muted-foreground">Complete setup in under 5 minutes</p>
      </div>

      {!clientId && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Client ID not configured. Complete steps 1-3 first.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {steps.map((step, index) => (
          <Card key={index} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">
                  {index + 1}
                </span>
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">{step.description}</p>
              
              {step.code && (
                <div className="bg-muted p-3 rounded-md font-mono text-sm flex items-center justify-between">
                  <span className="break-all">{step.code}</span>
                  {step.copyable && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(step.code!, index === 2 ? 'env' : 'id')}
                    >
                      {(index === 2 ? copiedEnv : copiedId) ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              )}
              
              {step.action && (
                <Button onClick={step.action} className="mt-3">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {step.buttonText}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">✅ Success Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              API enabled in Google Cloud Console
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              OAuth credentials created with correct redirect URI
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Client ID added to .env file
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Successfully connected and reviews syncing
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}