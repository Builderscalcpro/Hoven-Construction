import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CalendarCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing calendar connection...');
  const [details, setDetails] = useState<string[]>([]);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const provider = searchParams.get('provider') || 'google';

      setDetails(prev => [...prev, `Provider: ${provider}`]);
      setDetails(prev => [...prev, `Code received: ${code ? 'Yes' : 'No'}`]);
      setDetails(prev => [...prev, `State: ${state || 'None'}`]);

      if (error) {
        throw new Error(`OAuth error: ${error}`);
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      if (!user) {
        throw new Error('User not authenticated');
      }

      setMessage(`Connecting to ${provider} calendar...`);
      setDetails(prev => [...prev, 'Exchanging code for tokens...']);

      const redirectUri = `${window.location.origin}/calendar-callback`;

      if (provider === 'google') {
        const { data, error: funcError } = await supabase.functions.invoke('google-calendar-auth', {
          body: { action: 'handleCallback', code, redirectUri, userId: user.id }
        });

        if (funcError) throw funcError;
        setDetails(prev => [...prev, 'Google Calendar connected successfully']);
      } else if (provider === 'outlook') {
        const { data, error: funcError } = await supabase.functions.invoke('outlook-calendar-auth', {
          body: { action: 'handleCallback', code, redirectUri, userId: user.id }
        });

        if (funcError) throw funcError;
        setDetails(prev => [...prev, 'Outlook Calendar connected successfully']);
      }

      setStatus('success');
      setMessage('Calendar connected successfully!');
      
      setTimeout(() => {
        navigate('/calendar');
      }, 2000);

    } catch (error: any) {
      console.error('Calendar callback error:', error);
      setStatus('error');
      setMessage('Failed to connect calendar');
      setDetails(prev => [...prev, `Error: ${error.message}`]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            {status === 'loading' && <Loader2 className="h-8 w-8 animate-spin text-blue-600" />}
            {status === 'success' && <CheckCircle className="h-8 w-8 text-green-600" />}
            {status === 'error' && <XCircle className="h-8 w-8 text-red-600" />}
            <div>
              <CardTitle>Calendar Connection</CardTitle>
              <CardDescription>{message}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {details.map((detail, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                • {detail}
              </p>
            ))}
          </div>
          {status === 'error' && (
            <Button onClick={() => navigate('/calendar')} className="w-full mt-4">
              Return to Calendar
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
