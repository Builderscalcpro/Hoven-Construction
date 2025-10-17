import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';

interface Conflict {
  id: string;
  event_id: string;
  local_title: string;
  google_title: string;
  local_time: string;
  google_time: string;
  conflict_type: string;
  created_at: string;
}

export function CalendarSyncConflicts() {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [resolutions, setResolutions] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadConflicts();
  }, []);

  const loadConflicts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('calendar_sync_conflicts')
      .select('*')
      .eq('user_id', user.id)
      .is('resolved_at', null)
      .order('created_at', { ascending: false });

    setConflicts(data || []);
  };

  const handleResolve = async (conflictId: string) => {
    const resolution = resolutions[conflictId];
    if (!resolution) {
      toast({
        title: 'Select Resolution',
        description: 'Please choose how to resolve this conflict',
        variant: 'destructive',
      });
      return;
    }

    try {
      await supabase
        .from('calendar_sync_conflicts')
        .update({
          resolution,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', conflictId);

      toast({
        title: 'Conflict Resolved',
        description: 'The conflict has been resolved successfully',
      });

      await loadConflicts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleResolveAll = async () => {
    for (const conflict of conflicts) {
      if (resolutions[conflict.id]) {
        await handleResolve(conflict.id);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Sync Conflicts ({conflicts.length})
        </CardTitle>
        <CardDescription>
          Resolve conflicts between local and Google Calendar events
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {conflicts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No conflicts to resolve</p>
        ) : (
          <>
            {conflicts.map((conflict) => (
              <div key={conflict.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline">{conflict.conflict_type}</Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(conflict.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 p-3 bg-blue-50 rounded">
                    <p className="font-medium text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Local Version
                    </p>
                    <p className="text-sm">{conflict.local_title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(conflict.local_time).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2 p-3 bg-green-50 rounded">
                    <p className="font-medium text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Google Version
                    </p>
                    <p className="text-sm">{conflict.google_title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(conflict.google_time).toLocaleString()}
                    </p>
                  </div>
                </div>

                <RadioGroup
                  value={resolutions[conflict.id]}
                  onValueChange={(value) =>
                    setResolutions({ ...resolutions, [conflict.id]: value })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="use_local" id={`local-${conflict.id}`} />
                    <Label htmlFor={`local-${conflict.id}`}>Use Local Version</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="use_google" id={`google-${conflict.id}`} />
                    <Label htmlFor={`google-${conflict.id}`}>Use Google Version</Label>
                  </div>
                </RadioGroup>

                <Button
                  onClick={() => handleResolve(conflict.id)}
                  disabled={!resolutions[conflict.id]}
                  className="w-full"
                >
                  Resolve Conflict
                </Button>
              </div>
            ))}

            {conflicts.length > 1 && (
              <Button onClick={handleResolveAll} variant="outline" className="w-full">
                Resolve All Conflicts
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
