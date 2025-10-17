import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Calendar, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CalendarItem {
  id: string;
  name: string;
  description?: string;
  primary?: boolean;
  isDefaultCalendar?: boolean;
  backgroundColor?: string;
  color?: string;
  synced?: boolean;
  syncEnabled?: boolean;
  checkAvailability?: boolean;
}

interface CalendarPickerProps {
  provider: 'google' | 'outlook';
  userId: string;
}

export default function CalendarPicker({ provider, userId }: CalendarPickerProps) {

  const [calendars, setCalendars] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCalendars = async () => {
    setLoading(true);
    try {
      const table = provider === 'google' ? 'google_calendar_tokens' : 'outlook_calendar_tokens';
      const { data: tokens } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!tokens) {
        toast({ title: 'Please connect your calendar first', variant: 'destructive' });
        return;
      }

      const functionName = provider === 'google' ? 'google-calendar-list' : 'outlook-calendar-list';
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { accessToken: tokens.access_token },
      });

      if (error) throw error;

      const syncedCals = await supabase
        .from(table)
        .select('calendar_id, calendar_name, sync_enabled, check_availability')
        .eq('user_id', userId);

      const syncedMap = new Map(
        syncedCals.data?.map(c => [c.calendar_id, c]) || []
      );

      setCalendars(data.calendars.map((cal: any) => ({
        ...cal,
        synced: syncedMap.has(cal.id),
        syncEnabled: syncedMap.get(cal.id)?.sync_enabled ?? true,
        checkAvailability: syncedMap.get(cal.id)?.check_availability ?? true,
      })));
    } catch (error: any) {
      toast({ title: 'Failed to fetch calendars', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, [provider, userId]);

  const toggleSync = async (calendarId: string, calendarName: string, currentlySynced: boolean) => {
    const table = provider === 'google' ? 'google_calendar_tokens' : 'outlook_calendar_tokens';
    
    try {
      if (!currentlySynced) {
        const { data: mainToken } = await supabase
          .from(table)
          .select('access_token, refresh_token, token_expiry')
          .eq('user_id', userId)
          .limit(1)
          .single();

        await supabase.from(table).insert({
          user_id: userId,
          calendar_id: calendarId,
          calendar_name: calendarName,
          access_token: mainToken.access_token,
          refresh_token: mainToken.refresh_token,
          token_expiry: mainToken.token_expiry,
          sync_enabled: true,
          check_availability: true,
        });
      } else {
        await supabase.from(table).delete().eq('user_id', userId).eq('calendar_id', calendarId);
      }
      
      fetchCalendars();
      toast({ title: `Calendar ${currentlySynced ? 'removed' : 'added'}` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const updateSettings = async (calendarId: string, field: string, value: boolean) => {
    const table = provider === 'google' ? 'google_calendar_tokens' : 'outlook_calendar_tokens';
    
    try {
      await supabase
        .from(table)
        .update({ [field]: value })
        .eq('user_id', userId)
        .eq('calendar_id', calendarId);
      
      fetchCalendars();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {provider === 'google' ? 'Google' : 'Outlook'} Calendars
            </CardTitle>
            <CardDescription>Select which calendars to sync and check for availability</CardDescription>
          </div>
          <Button onClick={fetchCalendars} disabled={loading} size="sm" variant="outline">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {calendars.map((cal) => (
          <div key={cal.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{cal.name}</h4>
                  {(cal.primary || cal.isDefaultCalendar) && (
                    <Badge variant="secondary">Primary</Badge>
                  )}
                  {cal.synced && (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}
                </div>
                {cal.description && (
                  <p className="text-sm text-muted-foreground mt-1">{cal.description}</p>
                )}
              </div>
              <Switch
                checked={cal.synced}
                onCheckedChange={() => toggleSync(cal.id, cal.name, cal.synced || false)}
              />
            </div>
            
            {cal.synced && (
              <div className="flex gap-4 pt-2 border-t">
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={cal.syncEnabled}
                    onCheckedChange={(checked) => updateSettings(cal.id, 'sync_enabled', checked)}
                  />
                  Sync events
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={cal.checkAvailability}
                    onCheckedChange={(checked) => updateSettings(cal.id, 'check_availability', checked)}
                  />
                  Check availability
                </label>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
