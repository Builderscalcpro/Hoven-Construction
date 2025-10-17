import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { 
  CheckCircle2, XCircle, AlertTriangle, ExternalLink, 
  RefreshCw, Mail, CreditCard, Calendar, Brain, Building2,
  Clock, Shield, Key, BarChart3, Bug
} from 'lucide-react';

import { toast } from 'sonner';

interface APIService {
  id: string;
  name: string;
  icon: any;
  description: string;
  dashboardUrl: string;
  testEndpoint?: string;
  secretNames: string[];
  rotationDays: number;
}

const services: APIService[] = [
  {
    id: 'sendgrid',
    name: 'SendGrid',
    icon: Mail,
    description: 'Email delivery service',
    dashboardUrl: 'https://app.sendgrid.com',
    testEndpoint: 'send-email',
    secretNames: ['SENDGRID_API_KEY'],
    rotationDays: 90
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: CreditCard,
    description: 'Payment processing',
    dashboardUrl: 'https://dashboard.stripe.com',
    testEndpoint: 'stripe-create-payment-intent',
    secretNames: ['STRIPE_SECRET_KEY', 'VITE_STRIPE_PUBLISHABLE_KEY'],
    rotationDays: 365
  },
  {
    id: 'google',
    name: 'Google APIs',
    icon: Calendar,
    description: 'Calendar & Business Profile',
    dashboardUrl: 'https://console.cloud.google.com',
    secretNames: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'VITE_GOOGLE_CLIENT_ID', 'VITE_GOOGLE_API_KEY'],
    rotationDays: 180
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: Brain,
    description: 'AI-powered responses',
    dashboardUrl: 'https://platform.openai.com',
    testEndpoint: 'generate-ai-review-response',
    secretNames: ['OPENAI_API_KEY'],
    rotationDays: 90
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    icon: Building2,
    description: 'Outlook Calendar integration',
    dashboardUrl: 'https://portal.azure.com',
    secretNames: ['MICROSOFT_CLIENT_ID'],
    rotationDays: 180
  },
  {
    id: 'sentry',
    name: 'Sentry',
    icon: Bug,
    description: 'Error tracking & monitoring',
    dashboardUrl: 'https://sentry.io',
    secretNames: ['VITE_SENTRY_DSN'],
    rotationDays: 365
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    icon: BarChart3,
    description: 'Website analytics & insights',
    dashboardUrl: 'https://analytics.google.com',
    secretNames: ['VITE_GA_MEASUREMENT_ID'],
    rotationDays: 365
  }
];


export default function APIKeysManagement() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [lastTested, setLastTested] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem('api_test_results');
    if (stored) {
      const data = JSON.parse(stored);
      setLastTested(data);
    }
  }, []);

  const testService = async (service: APIService) => {
    if (!service.testEndpoint) {
      toast.info(`${service.name} doesn't have automated testing yet`);
      return;
    }

    setTesting(prev => ({ ...prev, [service.id]: true }));

    try {
      let result;
      
      if (service.id === 'sendgrid') {
        result = await supabase.functions.invoke('send-email', {
          body: {
            to: 'test@example.com',
            subject: 'API Test',
            html: '<p>Test email</p>',
            test: true
          }
        });
      } else if (service.id === 'stripe') {
        result = await supabase.functions.invoke('stripe-create-payment-intent', {
          body: { amount: 100, test: true }
        });
      } else if (service.id === 'openai') {
        result = await supabase.functions.invoke('generate-ai-review-response', {
          body: { 
            reviewText: 'Great service!', 
            rating: 5,
            test: true 
          }
        });
      }

      const success = !result.error;
      setTestResults(prev => ({ ...prev, [service.id]: { success, error: result.error } }));
      
      const now = new Date().toISOString();
      const updated = { ...lastTested, [service.id]: now };
      setLastTested(updated);
      localStorage.setItem('api_test_results', JSON.stringify(updated));

      toast.success(`${service.name} test ${success ? 'passed' : 'failed'}`);
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, [service.id]: { success: false, error: error.message } }));
      toast.error(`${service.name} test failed`);
    } finally {
      setTesting(prev => ({ ...prev, [service.id]: false }));
    }
  };

  const getStatusBadge = (serviceId: string) => {
    const result = testResults[serviceId];
    const lastTest = lastTested[serviceId];

    if (!lastTest) {
      return <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" />Not Tested</Badge>;
    }

    if (result?.success) {
      return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Active</Badge>;
    }

    return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
  };

  const needsRotation = (serviceId: string) => {
    const lastTest = lastTested[serviceId];
    if (!lastTest) return false;

    const service = services.find(s => s.id === serviceId);
    if (!service) return false;

    const daysSince = Math.floor((Date.now() - new Date(lastTest).getTime()) / (1000 * 60 * 60 * 24));
    return daysSince > service.rotationDays;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">API Keys Management</h1>
        <p className="text-muted-foreground">Monitor and test all API integrations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {services.map(service => {
          const Icon = service.icon;
          const lastTest = lastTested[service.id];
          const needsRot = needsRotation(service.id);

          return (
            <Card key={service.id} className="relative">
              {needsRot && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive" className="gap-1">
                    <Shield className="w-3 h-3" />
                    Rotate Key
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                  </div>
                </div>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(service.id)}
                </div>

                {lastTest && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Last tested: {new Date(lastTest).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium">Configured Keys:</p>
                  <div className="flex flex-wrap gap-1">
                    {service.secretNames.map(secret => (
                      <Badge key={secret} variant="secondary" className="text-xs">
                        <Key className="w-3 h-3 mr-1" />
                        {secret.replace('VITE_', '')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {service.testEndpoint && (
                    <Button
                      onClick={() => testService(service)}
                      disabled={testing[service.id]}
                      size="sm"
                      className="flex-1"
                    >
                      {testing[service.id] ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Test
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(service.dashboardUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>

                {testResults[service.id]?.error && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-xs">
                      {testResults[service.id].error}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Rotate API keys every 90-180 days</li>
            <li>• Never commit keys to version control</li>
            <li>• Use environment variables for all secrets</li>
            <li>• Monitor API usage for unusual activity</li>
            <li>• Test keys regularly to ensure they're working</li>
            <li>• Keep backup keys in secure password manager</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
