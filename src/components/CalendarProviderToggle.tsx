import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, Loader2 } from 'lucide-react';
import { googleCalendarService } from '@/lib/googleCalendarService';
import { outlookCalendarService } from '@/lib/outlookCalendarService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProviderStatus {
  google: boolean;
  outlook: boolean;
}

interface CalendarProviderToggleProps {
  onProviderChange?: (provider: 'google' | 'outlook', enabled: boolean) => void;
}

export default function CalendarProviderToggle({ onProviderChange }: CalendarProviderToggleProps) {

  const { user } = useAuth();
  const [providers, setProviders] = useState<ProviderStatus>({ google: false, outlook: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkProviders();
  }, [user]);

  const checkProviders = async () => {
    if (!user) return;
    
    try {
      const [googleConnected, outlookConnected] = await Promise.all([
        googleCalendarService.getStoredTokens(user.id).then(() => true).catch(() => false),
        outlookCalendarService.getStoredTokens(user.id).then(() => true).catch(() => false)
      ]);

      setProviders({ google: googleConnected, outlook: outlookConnected });
    } catch (error) {
      console.error('Error checking providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (provider: 'google' | 'outlook', enabled: boolean) => {
    if (!enabled) {
      toast.info(`${provider === 'google' ? 'Google' : 'Outlook'} Calendar events will be hidden`);
    } else {
      toast.success(`${provider === 'google' ? 'Google' : 'Outlook'} Calendar events now visible`);
    }
    
    if (onProviderChange) {
      onProviderChange(provider, enabled);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Active Calendar Providers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="google-toggle">Google Calendar</Label>
            <p className="text-sm text-muted-foreground">
              {providers.google ? 'Connected' : 'Not connected'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {providers.google && (
              <Badge variant="default">Active</Badge>
            )}
            <Switch
              id="google-toggle"
              checked={providers.google}
              onCheckedChange={(checked) => handleToggle('google', checked)}
              disabled={!providers.google}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="outlook-toggle">Outlook Calendar</Label>
            <p className="text-sm text-muted-foreground">
              {providers.outlook ? 'Connected' : 'Not connected'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {providers.outlook && (
              <Badge variant="default">Active</Badge>
            )}
            <Switch
              id="outlook-toggle"
              checked={providers.outlook}
              onCheckedChange={(checked) => handleToggle('outlook', checked)}
              disabled={!providers.outlook}
            />
          </div>
        </div>

        {!providers.google && !providers.outlook && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No calendar providers connected. Use the Connections tab to add calendars.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
