import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, CheckCircle, XCircle, Mail, Phone, TrendingUp, Activity } from 'lucide-react';
import AutoResponseSettings from './AutoResponseSettings';

export default function ReviewSyncDashboard() {
  const [config, setConfig] = useState<any>(null);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0 });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
    loadSyncLogs();
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: logs } = await supabase
      .from('review_sync_logs')
      .select('reviews_synced, synced_at')
      .eq('user_id', user.id)
      .eq('status', 'success');

    const now = new Date();
    const today = logs?.filter(l => 
      new Date(l.synced_at).toDateString() === now.toDateString()
    ).reduce((sum, l) => sum + (l.reviews_synced || 0), 0) || 0;

    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = logs?.filter(l => 
      new Date(l.synced_at) >= weekAgo
    ).reduce((sum, l) => sum + (l.reviews_synced || 0), 0) || 0;

    const total = logs?.reduce((sum, l) => sum + (l.reviews_synced || 0), 0) || 0;

    setStats({ total, today, thisWeek });
  };

  const loadConfig = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('review_sync_config')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        const { data: newConfig } = await supabase
          .from('review_sync_config')
          .insert({ user_id: user.id })
          .select()
          .single();
        setConfig(newConfig);
      } else {
        setConfig(data);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadSyncLogs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('review_sync_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('synced_at', { ascending: false })
      .limit(20);

    setSyncLogs(data || []);
  };

  const updateConfig = async (updates: any) => {
    try {
      const { error } = await supabase
        .from('review_sync_config')
        .update(updates)
        .eq('id', config.id);

      if (error) throw error;
      setConfig({ ...config, ...updates });
      toast({ title: 'Success', description: 'Settings updated' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const triggerManualSync = async () => {
    setSyncing(true);
    try {
      const { error } = await supabase.functions.invoke('automated-review-sync');
      if (error) throw error;
      toast({ title: 'Success', description: 'Review sync completed' });
      loadSyncLogs();
      loadConfig();
      loadStats();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Synced</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeek}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="config">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config">Sync Settings</TabsTrigger>
          <TabsTrigger value="auto-response">AI Responses</TabsTrigger>
          <TabsTrigger value="history">Sync History</TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Sync Configuration</CardTitle>
              <CardDescription>Configure automatic review syncing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Sync Enabled</Label>
                  <p className="text-sm text-muted-foreground">Sync reviews automatically</p>
                </div>
                <Switch
                  checked={config?.auto_sync_enabled}
                  onCheckedChange={(checked) => updateConfig({ auto_sync_enabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Sync Frequency</Label>
                <Select
                  value={config?.sync_frequency_minutes?.toString()}
                  onValueChange={(value) => updateConfig({ sync_frequency_minutes: parseInt(value) })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">Every hour</SelectItem>
                    <SelectItem value="120">Every 2 hours</SelectItem>
                    <SelectItem value="360">Every 6 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <Button onClick={triggerManualSync} disabled={syncing} className="w-full">
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync Now'}
                </Button>
              </div>

              {config?.last_sync_at && (
                <p className="text-sm text-muted-foreground">
                  Last: {new Date(config.last_sync_at).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auto-response">
          <AutoResponseSettings />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Sync History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Synced</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {log.status === 'success' ? (
                          <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Success</Badge>
                        ) : (
                          <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(log.synced_at).toLocaleString()}</TableCell>
                      <TableCell>{log.reviews_synced || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
