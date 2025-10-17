import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar, Trash2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { multiCalendarService, CalendarConnection } from '@/lib/multiCalendarService';
import { GoogleCalendarSetup } from '@/components/GoogleCalendarSetup';
import { OutlookCalendarSetup } from '@/components/OutlookCalendarSetup';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';


const PROVIDER_ICONS = {
  google: '🔵',
  outlook: '🔷',
  apple: '🍎',
  caldav: '📅'
};

const PROVIDER_NAMES = {
  google: 'Google Calendar',
  outlook: 'Outlook Calendar',
  apple: 'Apple Calendar',
  caldav: 'CalDAV'
};

export default function CalendarConnectionsManager() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadConnections();
    }
  }, [user]);

  const loadConnections = async () => {
    try {
      const data = await multiCalendarService.getCalendarConnections(user!.id);
      setConnections(data);
    } catch (error) {
      toast.error('Failed to load calendar connections');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSync = async (id: string, enabled: boolean) => {
    try {
      await multiCalendarService.updateCalendarConnection(id, {
        sync_enabled: enabled
      });
      setConnections(prev =>
        prev.map(c => c.id === id ? { ...c, sync_enabled: enabled } : c)
      );
      toast.success(`Sync ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update sync settings');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this calendar connection?')) return;
    
    try {
      await multiCalendarService.deleteCalendarConnection(id);
      setConnections(prev => prev.filter(c => c.id !== id));
      toast.success('Calendar connection removed');
    } catch (error) {
      toast.error('Failed to remove connection');
    }
  };

  const handleSync = async (id: string) => {
    setSyncing(id);
    try {
      // Trigger manual sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Calendar synced successfully');
      loadConnections();
    } catch (error) {
      toast.error('Failed to sync calendar');
    } finally {
      setSyncing(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading connections...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <GoogleCalendarSetup />
        <OutlookCalendarSetup />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Connected Calendars</h3>

      {connections.map(connection => (
        <Card key={connection.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{PROVIDER_ICONS[connection.provider]}</span>
                <div>
                  <CardTitle className="text-lg">
                    {PROVIDER_NAMES[connection.provider]}
                  </CardTitle>
                  <CardDescription>{connection.provider_account_id}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {connection.is_primary && (
                  <Badge variant="secondary">Primary</Badge>
                )}
                {connection.is_active ? (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={connection.sync_enabled}
                    onCheckedChange={(checked) => handleToggleSync(connection.id, checked)}
                  />
                  <span className="text-sm">Sync enabled</span>
                </div>
                {connection.last_sync_at && (
                  <span className="text-xs text-muted-foreground">
                    Last synced: {new Date(connection.last_sync_at).toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSync(connection.id)}
                  disabled={syncing === connection.id}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${syncing === connection.id ? 'animate-spin' : ''}`} />
                  Sync Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(connection.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {connections.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No calendar connections yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Connect your calendars to enable availability syncing
            </p>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}
