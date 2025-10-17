import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import GoogleBusinessReviews from './GoogleBusinessReviews';
import GoogleBusinessSync from './GoogleBusinessSync';
import GoogleBusinessInfo from './GoogleBusinessInfo';
import GoogleBusinessOAuthSetup from './GoogleBusinessOAuthSetup';
import BusinessInfoSync from './BusinessInfoSync';
import GoogleBusinessDebugger from './GoogleBusinessDebugger';
import GoogleBusinessReviewsDebug from './GoogleBusinessReviewsDebug';

import GoogleBusinessTokenMonitor from './GoogleBusinessTokenMonitor';
import { googleBusinessTokenService } from '@/services/googleBusinessTokenService';

export default function GoogleBusinessDashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
    // Start automatic token refresh monitoring
    googleBusinessTokenService.startTokenMonitoring();
    
    return () => {
      // Clean up monitoring when component unmounts
      googleBusinessTokenService.stopTokenMonitoring();
    };
  }, []);

  const checkConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('google_business_tokens')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setIsConnected(true);
        setTokenData(data);
        await fetchLocations(data.access_token);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async (accessToken: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('google-business-locations', {
        body: { accessToken },
      });
      if (data?.locations) {
        setLocations(data.locations);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };


  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!isConnected) {
    return <GoogleBusinessOAuthSetup onConnected={checkConnection} />;
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Google Business Profile</h1>
          <p className="text-muted-foreground">Manage your business presence on Google</p>
        </div>
        <Badge variant="outline" className="bg-green-50">Connected</Badge>
      </div>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="info">Business Info</TabsTrigger>
          <TabsTrigger value="sync">Sync Settings</TabsTrigger>
          <TabsTrigger value="auto-sync">Auto-Sync Info</TabsTrigger>
          <TabsTrigger value="token">Token Status</TabsTrigger>
          <TabsTrigger value="debug">Diagnostics</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <GoogleBusinessReviews tokenData={tokenData} />
        </TabsContent>

        <TabsContent value="info">
          <GoogleBusinessInfo tokenData={tokenData} />
        </TabsContent>

        <TabsContent value="sync">
          <GoogleBusinessSync tokenData={tokenData} onSync={checkConnection} />
        </TabsContent>

        <TabsContent value="auto-sync">
          <BusinessInfoSync accessToken={tokenData?.access_token} locations={locations} />
        </TabsContent>
        
        <TabsContent value="token">
          <GoogleBusinessTokenMonitor accountId={tokenData?.account_id} />
        </TabsContent>
        
        <TabsContent value="debug">
          <div className="space-y-4">
            <GoogleBusinessReviewsDebug tokenData={tokenData} />
            <GoogleBusinessDebugger />
          </div>
        </TabsContent>

      </Tabs>

    </div>
  );
}
