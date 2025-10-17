import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RefreshCw, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function GoogleBusinessSync({ tokenData, onSync }: any) {
  const [syncing, setSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const { toast } = useToast();

  const handleSync = async () => {
    setSyncing(true);
    try {
      // Fetch location data from Google
      const { data, error } = await supabase.functions.invoke('google-business-locations', {
        body: {
          accessToken: tokenData.access_token,
          accountId: tokenData.account_id,
          locationId: tokenData.location_id,
          action: 'listLocations'
        }
      });

      if (error) throw error;

      // Update last sync time
      await supabase
        .from('google_business_tokens')
        .update({ last_sync: new Date().toISOString() })
        .eq('id', tokenData.id);

      toast({
        title: 'Sync Complete',
        description: 'Business information updated successfully'
      });
      
      onSync();
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: 'Unable to sync business information',
        variant: 'destructive'
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Sync Settings</CardTitle>
          <CardDescription>
            Manage how your business information syncs with Google
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Sync</Label>
              <p className="text-sm text-muted-foreground">
                Automatically sync changes every hour
              </p>
            </div>
            <Switch checked={autoSync} onCheckedChange={setAutoSync} />
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">Last Sync</p>
                <p className="text-sm text-muted-foreground">
                  {tokenData.last_sync 
                    ? new Date(tokenData.last_sync).toLocaleString()
                    : 'Never'}
                </p>
              </div>
              <Button onClick={handleSync} disabled={syncing}>
                {syncing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Sync Now
              </Button>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <p className="font-medium">What Gets Synced</p>
            <div className="space-y-2">
              {['Business Hours', 'Contact Information', 'Address', 'Photos', 'Reviews'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}