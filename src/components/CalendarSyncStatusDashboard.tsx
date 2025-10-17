import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { bidirectionalCalendarSync } from '@/lib/bidirectionalCalendarSync';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function CalendarSyncStatusDashboard() {
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncHistory, setSyncHistory] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadSyncStatus();
    loadSyncHistory();
  }, []);

  const loadSyncStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('calendar_sync_status')
      .select('*')
      .eq('user_id', user.id)
      .order('last_sync', { ascending: false })
      .limit(1)
      .single();

    setSyncStatus(data);
  };

  const loadSyncHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('calendar_sync_status')
      .select('*')
      .eq('user_id', user.id)
      .order('last_sync', { ascending: false })
      .limit(10);

    setSyncHistory(data || []);
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const result = await bidirectionalCalendarSync.performFullSync(user.id);
      
      toast({
        title: 'Sync Complete',
        description: `Synced ${result.events_synced} events, resolved ${result.conflicts_resolved} conflicts`,
      });

      await loadSyncStatus();
      await loadSyncHistory();
    } catch (error: any) {
      toast({
        title: 'Sync Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'in_progress': return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendar Sync Status</CardTitle>
          <CardDescription>Bidirectional synchronization between Google Calendar and local database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {syncStatus && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(syncStatus.status)}
                <div>
                  <p className="font-medium">Last Sync: {new Date(syncStatus.last_sync).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {syncStatus.events_synced} events synced, {syncStatus.conflicts_resolved} conflicts resolved
                  </p>
                </div>
              </div>
              <Badge variant={syncStatus.status === 'success' ? 'default' : 'destructive'}>
                {syncStatus.status}
              </Badge>
            </div>
          )}

          <Button onClick={handleSync} disabled={syncing} className="w-full">
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Now'}
          </Button>

          {syncStatus?.error_message && (
            <Alert variant="destructive">
              <AlertDescription>{syncStatus.error_message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sync History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {syncHistory.map((sync) => (
              <div key={sync.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  {getStatusIcon(sync.status)}
                  <div>
                    <p className="text-sm">{new Date(sync.last_sync).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {sync.events_synced} events, {sync.conflicts_resolved} conflicts
                    </p>
                  </div>
                </div>
                <Badge variant={sync.status === 'success' ? 'outline' : 'destructive'}>
                  {sync.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
