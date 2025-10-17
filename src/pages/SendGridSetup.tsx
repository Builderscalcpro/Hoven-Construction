import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Copy, ExternalLink, Key, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SendGridSetup() {
  const [apiKey, setApiKey] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const testSendGrid = async () => {
    if (!testEmail) {
      setTestResult({ success: false, message: 'Please enter a test email address' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: testEmail,
          subject: 'SendGrid Test Email',
          html: '<h1>Success!</h1><p>Your SendGrid integration is working correctly.</p>',
        },
      });

      if (error) throw error;

      setTestResult({
        success: true,
        message: 'Test email sent successfully! Check your inbox.',
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.message || 'Failed to send test email',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SendGrid API Setup</h1>
        <p className="text-muted-foreground">
          Configure your SendGrid API key for email functionality
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1: Get API Key */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Step 1: Get Your SendGrid API Key
            </CardTitle>
            <CardDescription>
              Create or retrieve your SendGrid API key
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to SendGrid Dashboard</li>
              <li>Navigate to Settings → API Keys</li>
              <li>Click "Create API Key"</li>
              <li>Choose "Full Access" or "Restricted Access" with Mail Send permissions</li>
              <li>Copy the API key (you won't see it again!)</li>
            </ol>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open('https://app.sendgrid.com/settings/api_keys', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open SendGrid Dashboard
            </Button>
          </CardContent>
        </Card>

        {/* Step 2: Add to Supabase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Step 2: Add API Key to Supabase
            </CardTitle>
            <CardDescription>
              Store your API key securely in Supabase Edge Functions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Your SendGrid API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="SG.xxxxxxxxxxxxxxxxxxxxx"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(apiKey)}
                  disabled={!apiKey}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                <strong>Manual Setup Required:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Go to Supabase Dashboard</li>
                  <li>Navigate to Project Settings → Edge Functions</li>
                  <li>Click on "Secrets" tab</li>
                  <li>Add/Update secret: <code className="bg-muted px-1 py-0.5 rounded">SENDGRID_API_KEY</code></li>
                  <li>Paste your API key as the value</li>
                </ol>
              </AlertDescription>
            </Alert>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open('https://supabase.com/dashboard/project/_/settings/functions', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Supabase Secrets
            </Button>
          </CardContent>
        </Card>

        {/* Step 3: Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Step 3: Test Your Configuration
            </CardTitle>
            <CardDescription>
              Send a test email to verify everything works
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testEmail">Test Email Address</Label>
              <Input
                id="testEmail"
                type="email"
                placeholder="your@email.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>

            <Button
              onClick={testSendGrid}
              disabled={testing || !testEmail}
              className="w-full"
            >
              {testing ? 'Sending...' : 'Send Test Email'}
            </Button>

            {testResult && (
              <Alert variant={testResult.success ? 'default' : 'destructive'}>
                {testResult.success && <CheckCircle className="h-4 w-4" />}
                <AlertDescription>{testResult.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Recovery Info */}
        <Card>
          <CardHeader>
            <CardTitle>Recovery & Backup</CardTitle>
            <CardDescription>
              Important information for API key management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <strong>⚠️ Security Best Practices:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1 ml-2">
                <li>Never commit API keys to version control</li>
                <li>Store backup keys in a secure password manager</li>
                <li>Rotate keys regularly (every 90 days recommended)</li>
                <li>Use restricted access keys when possible</li>
              </ul>
            </div>
            <div>
              <strong>🔄 If You Lose Your Key:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1 ml-2">
                <li>Create a new API key in SendGrid</li>
                <li>Update the SENDGRID_API_KEY secret in Supabase</li>
                <li>Delete the old key from SendGrid</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
