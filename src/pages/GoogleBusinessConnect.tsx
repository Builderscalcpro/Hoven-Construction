import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Building2, ExternalLink, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function GoogleBusinessConnect() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionData, setConnectionData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const clientId = import.meta.env.VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/google-business-callback`;
  
  // Debug: Check if Client ID exists
  console.log('Client ID exists:', !!import.meta.env.VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID);
  console.log('Client ID value:', import.meta.env.VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID);
  console.log('All env vars:', import.meta.env);


  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setChecking(true);
    try {
      const { data } = await supabase
        .from('google_business_tokens')
        .select('*')
        .single();
      
      setConnectionData(data);
      setIsConnected(!!data);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setChecking(false);
    }
  };

  const handleConnect = () => {
    setLoading(true);
    const scope = 'https://www.googleapis.com/auth/business.manage';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent`;
    window.location.href = authUrl;
  };

  const handleDisconnect = async () => {
    try {
      const { error } = await supabase
        .from('google_business_tokens')
        .delete()
        .eq('id', connectionData.id);
      
      if (error) throw error;
      
      toast({ title: 'Disconnected', description: 'Google Business Profile disconnected successfully' });
      checkConnection();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to disconnect', variant: 'destructive' });
    }
  };

  if (checking) {
    return <div className="flex justify-center items-center min-h-screen"><RefreshCw className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Google Business Profile</h1>
        <p className="text-muted-foreground">Connect your Google Business Profile to manage reviews and business info</p>
      </div>

      {isConnected ? (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <CheckCircle className="w-6 h-6" />
              Connected Successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 text-sm">
              <div><strong>Account ID:</strong> {connectionData?.account_id}</div>
              <div><strong>Location ID:</strong> {connectionData?.location_id}</div>
              <div><strong>Last Sync:</strong> {new Date(connectionData?.last_sync).toLocaleString()}</div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/dashboard?tab=google-business')}>View Reviews Dashboard</Button>
              <Button variant="outline" onClick={handleDisconnect}>Disconnect</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-6 h-6" />
                Connect Your Account
              </CardTitle>
              <CardDescription>Sync reviews, manage responses, and update business information automatically</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Features You'll Get:</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Automatic review syncing</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> AI-powered review responses</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Business information updates</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Real-time notifications</li>
                </ul>
              </div>

              {!clientId ? (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>Client ID not configured. Add VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID to .env</AlertDescription>
                </Alert>
              ) : (
                <Button onClick={handleConnect} disabled={loading} size="lg" className="w-full">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  {loading ? 'Connecting...' : 'Connect with Google'}
                </Button>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
