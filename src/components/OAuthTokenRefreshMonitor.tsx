import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RefreshLog {
  id: string;
  provider: string;
  account_id: string;
  refresh_status: 'success' | 'failed' | 'skipped';
  error_message?: string;
  old_expires_at?: string;
  new_expires_at?: string;
  created_at: string;
}

export function OAuthTokenRefreshMonitor() {
  const [logs, setLogs] = useState<RefreshLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('oauth_token_refresh_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching refresh logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerManualRefresh = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('refresh-oauth-tokens');

      if (error) throw error;

      toast({
        title: 'Token Refresh Complete',
        description: `Success: ${data.success}, Failed: ${data.failed}, Skipped: ${data.skipped}`,
      });

      fetchLogs();
    } catch (error) {
      toast({
        title: 'Refresh Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'> = {
      success: 'default',
      failed: 'destructive',
      skipped: 'secondary',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>OAuth Token Refresh Monitor</CardTitle>
            <CardDescription>
              Automatic token refresh history and manual refresh control
            </CardDescription>
          </div>
          <Button onClick={triggerManualRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Now
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading refresh history...</p>
        ) : logs.length === 0 ? (
          <p className="text-muted-foreground">No refresh history available</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 border-b pb-4 last:border-0">
                <div className="mt-1">{getStatusIcon(log.refresh_status)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">
                      {log.provider.replace('_', ' ')}
                    </span>
                    {getStatusBadge(log.refresh_status)}
                  </div>
                  {log.error_message && (
                    <p className="text-sm text-red-500">{log.error_message}</p>
                  )}
                  {log.new_expires_at && (
                    <p className="text-sm text-muted-foreground">
                      New expiry: {new Date(log.new_expires_at).toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}