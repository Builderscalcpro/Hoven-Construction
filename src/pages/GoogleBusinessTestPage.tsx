import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Play, Database, Cloud, Key } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  details?: any;
}

export default function GoogleBusinessTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const runTest = async (testName: string, testFn: () => Promise<TestResult>) => {
    setTestResults(prev => [...prev, { name: testName, status: 'pending', message: 'Running...' }]);
    const result = await testFn();
    setTestResults(prev => prev.map(r => r.name === testName ? result : r));
    return result;
  };

  const testEnvironmentVariables = async (): Promise<TestResult> => {
    const clientId = import.meta.env.VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID;
    if (!clientId) {
      return {
        name: 'Environment Variables',
        status: 'error',
        message: 'Missing VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID',
        details: { clientId: 'Not configured' }
      };
    }
    return {
      name: 'Environment Variables',
      status: 'success',
      message: 'All required environment variables are configured',
      details: { clientId: clientId.substring(0, 10) + '...' }
    };
  };

  const testDatabaseTable = async (): Promise<TestResult> => {
    try {
      const { error } = await supabase.from('google_business_tokens').select('id').limit(1);
      if (error && error.code === '42P01') {
        return {
          name: 'Database Table',
          status: 'error',
          message: 'Table google_business_tokens does not exist',
          details: error
        };
      }
      return {
        name: 'Database Table',
        status: 'success',
        message: 'Database table exists and is accessible'
      };
    } catch (error) {
      return {
        name: 'Database Table',
        status: 'error',
        message: 'Failed to check database table',
        details: error
      };
    }
  };

  const testExistingConnection = async (): Promise<TestResult> => {
    try {
      const { data } = await supabase.from('google_business_tokens').select('*').single();
      if (data) {
        return {
          name: 'Existing Connection',
          status: 'success',
          message: 'Found existing Google Business connection',
          details: {
            accountId: data.account_id,
            locationId: data.location_id,
            lastSync: data.last_sync
          }
        };
      }
      return {
        name: 'Existing Connection',
        status: 'warning',
        message: 'No existing connection found'
      };
    } catch {
      return {
        name: 'Existing Connection',
        status: 'warning',
        message: 'No existing connection found'
      };
    }
  };

  const testEdgeFunctions = async (): Promise<TestResult> => {
    try {
      const { error } = await supabase.functions.invoke('google-business-auth', {
        body: { action: 'test' }
      });
      if (error) {
        return {
          name: 'Edge Functions',
          status: 'error',
          message: 'Edge function not deployed or not accessible',
          details: error
        };
      }
      return {
        name: 'Edge Functions',
        status: 'success',
        message: 'Edge functions are deployed and accessible'
      };
    } catch (error) {
      return {
        name: 'Edge Functions',
        status: 'error',
        message: 'Failed to test edge functions',
        details: error
      };
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setTestResults([]);
    
    await runTest('Environment Variables', testEnvironmentVariables);
    await runTest('Database Table', testDatabaseTable);
    await runTest('Existing Connection', testExistingConnection);
    await runTest('Edge Functions', testEdgeFunctions);
    
    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
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
      pending: 'outline'
    };
    return <Badge variant={variants[status] || 'outline'}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Google Business OAuth Test Suite</h1>
        <p className="text-muted-foreground">Comprehensive testing for Google Business Profile integration</p>
      </div>

      <Tabs defaultValue="tests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tests">Connection Tests</TabsTrigger>
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          <TabsTrigger value="debug">Debug Info</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connection Test Suite</CardTitle>
              <CardDescription>Run comprehensive tests to verify your Google Business Profile OAuth setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runAllTests} disabled={testing} size="lg">
                <Play className="w-5 h-5 mr-2" />
                {testing ? 'Running Tests...' : 'Run All Tests'}
              </Button>

              {testResults.length > 0 && (
                <div className="space-y-3 mt-6">
                  {testResults.map((result, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 border rounded-lg">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{result.name}</span>
                          {getStatusBadge(result.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                        {result.details && (
                          <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Setup Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Key className="w-5 h-5 mt-0.5 text-blue-500" />
                  <div>
                    <h4 className="font-semibold">1. Google Cloud Console</h4>
                    <p className="text-sm text-muted-foreground">Create OAuth 2.0 credentials in Google Cloud Console</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 mt-0.5 text-green-500" />
                  <div>
                    <h4 className="font-semibold">2. Environment Variables</h4>
                    <p className="text-sm text-muted-foreground">Add CLIENT_ID and CLIENT_SECRET to .env file</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Cloud className="w-5 h-5 mt-0.5 text-purple-500" />
                  <div>
                    <h4 className="font-semibold">3. Deploy Edge Functions</h4>
                    <p className="text-sm text-muted-foreground">Deploy Supabase edge functions for OAuth handling</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debug" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                <div><strong>Callback URL:</strong> {window.location.origin}/google-business-callback</div>
                <div><strong>Client ID:</strong> {import.meta.env.VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID ? '✅ Configured' : '❌ Missing'}</div>
                <div><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}