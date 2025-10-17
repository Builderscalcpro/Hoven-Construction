import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Clock, MapPin, Phone, Globe, Calendar, Trash2 } from 'lucide-react';
import { businessInfoService, BusinessInfo } from '@/lib/businessInfoService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface BusinessInfoSyncProps {
  accessToken: string;
  locations: any[];
}

export default function BusinessInfoSync({ accessToken, locations }: BusinessInfoSyncProps) {
  const { user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [businessInfos, setBusinessInfos] = useState<BusinessInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinessInfos();
  }, [user]);

  const loadBusinessInfos = async () => {
    if (!user) return;
    try {
      const infos = await businessInfoService.getBusinessInfo(user.id);
      setBusinessInfos(infos);
    } catch (error: any) {
      console.error('Error loading business info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (locationName: string) => {
    setSyncing(true);
    try {
      const businessInfo = await businessInfoService.syncFromGoogle(accessToken, locationName);
      await businessInfoService.saveBusinessInfo(businessInfo);
      await loadBusinessInfos();
      toast({
        title: 'Success',
        description: 'Business information synced successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await businessInfoService.deleteBusinessInfo(id);
      await loadBusinessInfos();
      toast({ title: 'Success', description: 'Business info deleted' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sync Business Information</CardTitle>
          <CardDescription>Keep your website data consistent with Google Business Profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {locations.map((location) => (
            <div key={location.name} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{location.title}</h3>
                <p className="text-sm text-muted-foreground">{location.name}</p>
              </div>
              <Button onClick={() => handleSync(location.name)} disabled={syncing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                Sync Now
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {businessInfos.map((info) => (
        <Card key={info.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{info.business_name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Clock className="h-4 w-4" />
                  Last synced: {new Date(info.last_synced_at!).toLocaleString()}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(info.id!)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{info.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{info.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Website</p>
                  <p className="text-sm text-muted-foreground">{info.website}</p>
                </div>
              </div>
            </div>
            {info.categories && info.categories.length > 0 && (
              <div>
                <p className="font-medium mb-2">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {info.categories.map((cat, idx) => (
                    <Badge key={idx} variant="secondary">{cat}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
