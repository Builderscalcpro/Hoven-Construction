import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function GoogleBusinessCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        throw new Error('No authorization code received');
      }

      setStatus('Exchanging authorization code...');

      // Exchange code for tokens
      const { data: tokens, error: tokenError } = await supabase.functions.invoke('google-business-auth', {
        body: { action: 'exchangeCode', code }
      });

      if (tokenError) throw tokenError;

      setStatus('Fetching account information...');

      // Get account and location IDs
      const { data: accounts, error: accountError } = await supabase.functions.invoke('google-business-locations', {
        body: {
          accessToken: tokens.access_token,
          action: 'listAccounts'
        }
      });

      if (accountError) throw accountError;

      const accountId = accounts.accounts?.[0]?.name;
      
      const { data: locations, error: locationError } = await supabase.functions.invoke('google-business-locations', {
        body: {
          accessToken: tokens.access_token,
          accountId,
          action: 'listLocations'
        }
      });

      if (locationError) throw locationError;

      const locationId = locations.locations?.[0]?.name;

      setStatus('Saving connection...');

      // Save tokens to database
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error: saveError } = await supabase
        .from('google_business_tokens')
        .upsert({
          user_id: user?.id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expiry: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
          account_id: accountId,
          location_id: locationId,
          last_sync: new Date().toISOString()
        });

      if (saveError) throw saveError;

      toast({
        title: 'Success!',
        description: 'Google Business Profile connected successfully'
      });

      navigate('/dashboard?tab=google-business');
    } catch (error: any) {
      toast({
        title: 'Connection Failed',
        description: error.message || 'Unable to connect to Google Business Profile',
        variant: 'destructive'
      });
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-lg">{status}</p>
      </div>
    </div>
  );
}