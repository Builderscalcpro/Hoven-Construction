import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Preferences {
  working_hours_start?: string;
  working_hours_end?: string;
  timezone?: string;
  buffer_time_minutes?: number;
  auto_decline_conflicts?: boolean;
  notification_email?: boolean;
  notification_sms?: boolean;
}

export default function WorkingHoursSettings() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Preferences>({
    working_hours_start: '09:00',
    working_hours_end: '17:00',
    timezone: 'America/New_York',
    buffer_time_minutes: 15,
    auto_decline_conflicts: true,
    notification_email: true,
    notification_sms: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) loadPreferences();
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_calendar_preferences')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setPreferences(data);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_calendar_preferences')
        .upsert({
          user_id: user!.id,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Preferences saved successfully');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
          <CardDescription>Set your default working hours for scheduling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Time</Label>
              <Input
                type="time"
                value={preferences.working_hours_start}
                onChange={(e) => setPreferences({ ...preferences, working_hours_start: e.target.value })}
              />
            </div>
            <div>
              <Label>End Time</Label>
              <Input
                type="time"
                value={preferences.working_hours_end}
                onChange={(e) => setPreferences({ ...preferences, working_hours_end: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Buffer Time (minutes)</Label>
            <Input
              type="number"
              value={preferences.buffer_time_minutes}
              onChange={(e) => setPreferences({ ...preferences, buffer_time_minutes: parseInt(e.target.value) })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Email Notifications</Label>
            <Switch
              checked={preferences.notification_email}
              onCheckedChange={(checked) => setPreferences({ ...preferences, notification_email: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>SMS Notifications</Label>
            <Switch
              checked={preferences.notification_sms}
              onCheckedChange={(checked) => setPreferences({ ...preferences, notification_sms: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Auto-decline Conflicts</Label>
            <Switch
              checked={preferences.auto_decline_conflicts}
              onCheckedChange={(checked) => setPreferences({ ...preferences, auto_decline_conflicts: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={savePreferences} disabled={saving} className="w-full">
        {saving ? 'Saving...' : 'Save Preferences'}
      </Button>
    </div>
  );
}
