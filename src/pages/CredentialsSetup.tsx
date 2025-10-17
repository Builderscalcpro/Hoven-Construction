import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, AlertCircle, Key } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Credential {
  key: string;
  label: string;
  description: string;
  required: boolean;
  defaultValue?: string;
  type?: 'text' | 'password';
  placeholder?: string;
}

const credentials: Credential[] = [
  {
    key: 'VITE_SUPABASE_URL',
    label: 'Supabase URL',
    description: 'Your Supabase project URL',
    required: true,
    defaultValue: 'https://hhqrfqvmwzqfhxvkwvgn.supabase.co',
    type: 'text'
  },
  {
    key: 'VITE_SUPABASE_ANON_KEY',
    label: 'Supabase Anon Key',
    description: 'Your Supabase anonymous key',
    required: true,
    type: 'password',
    placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  {
    key: 'VITE_GOOGLE_CLIENT_ID',
    label: 'Google OAuth Client ID',
    description: 'Google Cloud Console OAuth 2.0 Client ID',
    required: true,
    defaultValue: '1055687793503-6ngu3p4cqr5qvvvj8e3hqfhqfhqfhqfh.apps.googleusercontent.com',
    type: 'text'
  },
  {
    key: 'VITE_GOOGLE_CLIENT_SECRET',
    label: 'Google OAuth Client Secret',
    description: 'Google Cloud Console OAuth 2.0 Client Secret',
    required: true,
    type: 'password',
    placeholder: 'GOCSPX-...'
  },
  {
    key: 'VITE_GOOGLE_API_KEY',
    label: 'Google API Key',
    description: 'Google Cloud Console API Key',
    required: true,
    defaultValue: 'AIzaSyDxVxVxVxVxVxVxVxVxVxVxVxVxVxV',
    type: 'password'
  },
  {
    key: 'VITE_MICROSOFT_CLIENT_ID',
    label: 'Microsoft OAuth Client ID',
    description: 'Azure AD Application (client) ID',
    required: false,
    type: 'text',
    placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  },
  {
    key: 'VITE_MICROSOFT_CLIENT_SECRET',
    label: 'Microsoft OAuth Client Secret',
    description: 'Azure AD Client Secret Value',
    required: false,
    type: 'password',
    placeholder: 'xxx~xxx...'
  },
  {
    key: 'VITE_STRIPE_PUBLISHABLE_KEY',
    label: 'Stripe Publishable Key',
    description: 'Stripe API publishable key',
    required: true,
    type: 'password',
    placeholder: 'pk_live_...'
  },
  {
    key: 'VITE_GA_MEASUREMENT_ID',
    label: 'Google Analytics Measurement ID',
    description: 'GA4 Measurement ID',
    required: false,
    defaultValue: 'G-KB485Y4Z44',
    type: 'text'
  },
  {
    key: 'VITE_ANTHROPIC_API_KEY',
    label: 'Anthropic API Key',
    description: 'Claude AI API key for chatbot',
    required: false,
    type: 'password',
    placeholder: 'sk-ant-...'
  },
  {
    key: 'VITE_SENDGRID_API_KEY',
    label: 'SendGrid API Key',
    description: 'SendGrid email service API key',
    required: false,
    type: 'password',
    placeholder: 'SG...'
  }
];

export default function CredentialsSetup() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [showEnv, setShowEnv] = useState(false);

  useEffect(() => {
    const initial: Record<string, string> = {};
    credentials.forEach(cred => {
      initial[cred.key] = cred.defaultValue || '';
    });
    setValues(initial);
  }, []);

  const generateEnvContent = () => {
    let content = '# Supabase Configuration\n';
    content += `VITE_SUPABASE_URL=${values.VITE_SUPABASE_URL}\n`;
    content += `VITE_SUPABASE_ANON_KEY=${values.VITE_SUPABASE_ANON_KEY}\n\n`;
    
    content += '# Google OAuth & APIs\n';
    content += `VITE_GOOGLE_CLIENT_ID=${values.VITE_GOOGLE_CLIENT_ID}\n`;
    content += `VITE_GOOGLE_CLIENT_SECRET=${values.VITE_GOOGLE_CLIENT_SECRET}\n`;
    content += `VITE_GOOGLE_API_KEY=${values.VITE_GOOGLE_API_KEY}\n\n`;
    
    content += '# Microsoft OAuth\n';
    content += `VITE_MICROSOFT_CLIENT_ID=${values.VITE_MICROSOFT_CLIENT_ID}\n`;
    content += `VITE_MICROSOFT_CLIENT_SECRET=${values.VITE_MICROSOFT_CLIENT_SECRET}\n\n`;
    
    content += '# Payment Processing\n';
    content += `VITE_STRIPE_PUBLISHABLE_KEY=${values.VITE_STRIPE_PUBLISHABLE_KEY}\n\n`;
    
    content += '# Analytics\n';
    content += `VITE_GA_MEASUREMENT_ID=${values.VITE_GA_MEASUREMENT_ID}\n\n`;
    
    content += '# AI Services\n';
    content += `VITE_ANTHROPIC_API_KEY=${values.VITE_ANTHROPIC_API_KEY}\n\n`;
    
    content += '# Email Services\n';
    content += `VITE_SENDGRID_API_KEY=${values.VITE_SENDGRID_API_KEY}\n\n`;
    
    content += '# Application Configuration\n';
    content += 'VITE_APP_DOMAIN=hovenconstruction.com\n';
    content += 'VITE_APP_URL=https://hovenconstruction.com\n';
    
    return content;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateEnvContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allRequiredFilled = credentials
    .filter(c => c.required)
    .every(c => values[c.key]?.trim());

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Key className="h-8 w-8" />
          API Credentials Setup
        </h1>
        <p className="text-muted-foreground">
          Enter your OAuth secrets and API keys to complete your application setup
        </p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          After entering your credentials, copy the generated .env content and paste it into your .env file in the project root directory. Then restart your development server.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="required" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="required">Required</TabsTrigger>
          <TabsTrigger value="optional">Optional</TabsTrigger>
        </TabsList>

        <TabsContent value="required" className="space-y-4">
          {credentials.filter(c => c.required).map(cred => (
            <Card key={cred.key}>
              <CardHeader>
                <CardTitle className="text-lg">{cred.label}</CardTitle>
                <CardDescription>{cred.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Label htmlFor={cred.key}>{cred.key}</Label>
                <Input
                  id={cred.key}
                  type={cred.type || 'text'}
                  value={values[cred.key] || ''}
                  onChange={(e) => setValues({ ...values, [cred.key]: e.target.value })}
                  placeholder={cred.placeholder}
                  className="mt-2"
                />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="optional" className="space-y-4">
          {credentials.filter(c => !c.required).map(cred => (
            <Card key={cred.key}>
              <CardHeader>
                <CardTitle className="text-lg">{cred.label}</CardTitle>
                <CardDescription>{cred.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Label htmlFor={cred.key}>{cred.key}</Label>
                <Input
                  id={cred.key}
                  type={cred.type || 'text'}
                  value={values[cred.key] || ''}
                  onChange={(e) => setValues({ ...values, [cred.key]: e.target.value })}
                  placeholder={cred.placeholder}
                  className="mt-2"
                />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generated .env Content</CardTitle>
          <CardDescription>
            Copy this content to your .env file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={() => setShowEnv(!showEnv)} variant="outline">
              {showEnv ? 'Hide' : 'Show'} Content
            </Button>
            <Button onClick={handleCopy} disabled={!allRequiredFilled}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
          </div>
          
          {!allRequiredFilled && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fill in all required fields before copying
              </AlertDescription>
            </Alert>
          )}

          {showEnv && allRequiredFilled && (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              {generateEnvContent()}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}