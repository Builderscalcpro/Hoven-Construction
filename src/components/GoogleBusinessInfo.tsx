import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Clock, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function GoogleBusinessInfo({ tokenData }: any) {
  const [locationData, setLocationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('google-business-locations', {
        body: {
          accessToken: tokenData.access_token,
          accountId: tokenData.account_id,
          action: 'listLocations'
        }
      });

      if (error) throw error;
      if (data.locations && data.locations.length > 0) {
        setLocationData(data.locations[0]);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch location data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading business information...</div>;
  if (!locationData) return <div>No location data available</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{locationData.locationName || 'Business Name'}</CardTitle>
              <CardDescription>Your Google Business Profile information</CardDescription>
            </div>
            <Badge variant={locationData.locationState?.isVerified ? 'default' : 'secondary'}>
              {locationData.locationState?.isVerified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <Label>Address</Label>
                <p className="text-sm">641 S Ridgeley Dr, Los Angeles, CA 90036</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <Label>Phone</Label>
                <p className="text-sm">(310) 853-2131</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <Label>Hours</Label>
                <div className="text-sm space-y-1">
                  <p>Mon-Fri: 8AM-6PM</p>
                  <p>Sat: 9AM-4PM</p>
                  <p>Sun: Closed</p>
                </div>
              </div>
            </div>

            {locationData.websiteUrl && (
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label>Website</Label>
                  <p className="text-sm">{locationData.websiteUrl}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <Button onClick={() => setEditing(!editing)} variant="outline">
              {editing ? 'Cancel' : 'Edit Information'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}