import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Key, Building2, MapPin } from 'lucide-react';

interface GoogleBusinessAPISetupProps {
  onConnected: () => void;
}

export default function GoogleBusinessAPISetup({ onConnected }: GoogleBusinessAPISetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [accountId, setAccountId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Store API credentials
      const { error } = await supabase
        .from('google_business_tokens')
        .upsert({
          user_id: user.id,
          access_token: apiKey,
          account_id: accountId,
          location_id: locationId,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Connected Successfully',
        description: 'Your Google Business Profile is now connected'
      });

      onConnected();
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Unable to connect',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Connect Google Business Profile</CardTitle>
        <CardDescription>
          Enter your Google Business Profile API credentials to sync reviews and business information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleConnect} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">
              <Key className="w-4 h-4 inline mr-2" />
              API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Google Business Profile API Key"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountId">
              <Building2 className="w-4 h-4 inline mr-2" />
              Account ID
            </Label>
            <Input
              id="accountId"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="accounts/1234567890"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationId">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location ID
            </Label>
            <Input
              id="locationId"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              placeholder="locations/0987654321"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Connecting...' : 'Connect Google Business Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
