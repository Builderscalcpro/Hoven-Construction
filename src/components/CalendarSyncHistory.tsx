import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase';
import { Calendar, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';

interface SyncHistoryItem {
  id: string;
  event_id: string;
  action: 'created' | 'updated' | 'deleted' | 'conflict';
  source: 'local' | 'google';
  details: any;
  created_at: string;
}

export function CalendarSyncHistory() {
  const [history, setHistory] = useState<SyncHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('calendar_sync_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      setHistory(data || []);
    } catch (error) {
      console.error('Failed to load sync history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created': return <Plus className="h-4 w-4 text-green-500" />;
      case 'updated': return <Edit className="h-4 w-4 text-blue-500" />;
      case 'deleted': return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'conflict': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' => {
    switch (action) {
      case 'created': return 'default';
      case 'updated': return 'secondary';
      case 'deleted': return 'destructive';
      case 'conflict': return 'outline';
      default: return 'outline';
    }
  };


  if (loading) {
    return <div className="text-center py-8">Loading history...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync History</CardTitle>
        <CardDescription>Recent calendar synchronization activity</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No sync history yet</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="mt-1">{getActionIcon(item.action)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getActionColor(item.action)}>

                        {item.action}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.source}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Event ID: {item.event_id}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
