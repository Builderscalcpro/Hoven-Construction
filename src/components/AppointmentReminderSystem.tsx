import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Phone, MessageSquare, Clock, CheckCircle, XCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SMSDeliveryStatus {
  id: string;
  appointment_id: string;
  phone_number: string;
  message_type: string;
  status: string;
  sent_at: string;
  delivered_at?: string;
}

interface SMSPreference {
  phone_number: string;
  opted_in: boolean;
  opted_in_at?: string;
  opted_out_at?: string;
}

export function AppointmentReminderSystem() {
  const [deliveryStatuses, setDeliveryStatuses] = useState<SMSDeliveryStatus[]>([]);
  const [preferences, setPreferences] = useState<SMSPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoReminders, setAutoReminders] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      // Load delivery statuses
      const { data: statuses } = await supabase
        .from('sms_delivery_status')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(50);

      if (statuses) setDeliveryStatuses(statuses);

      // Load SMS preferences
      const { data: prefs } = await supabase
        .from('sms_preferences')
        .select('*')
        .order('created_at', { ascending: false });

      if (prefs) setPreferences(prefs);

      setLoading(false);
    } catch (error) {
      console.error('Error loading SMS data:', error);
      setLoading(false);
    }
  };

  const triggerReminders = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('send-appointment-reminders');
      
      if (error) throw error;

      toast({
        title: 'Reminders Sent',
        description: `Successfully sent ${data.count} reminder(s)`,
      });

      await loadData();
    } catch (error) {
      console.error('Error triggering reminders:', error);
      toast({
        title: 'Error',
        description: 'Failed to send reminders',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'> = {
      'queued': 'default',
      'sent': 'secondary',
      'delivered': 'success',
      'failed': 'destructive',
      'undelivered': 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {status}
      </Badge>
    );
  };


  const getMessageTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'confirmation': 'Confirmation',
      'reminder_24h': '24-Hour Reminder',
      'reminder_1h': '1-Hour Reminder',
      'cancellation': 'Cancellation',
      'reschedule': 'Reschedule',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS Reminder Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Send reminders 24 hours and 1 hour before appointments
              </p>
            </div>
            <Switch
              checked={autoReminders}
              onCheckedChange={setAutoReminders}
            />
          </div>

          <Button 
            onClick={triggerReminders}
            className="w-full sm:w-auto"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Pending Reminders Now
          </Button>
        </CardContent>
      </Card>

      {/* Opt-in Status */}
      <Card>
        <CardHeader>
          <CardTitle>SMS Opt-in Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {preferences.map((pref) => (
              <div key={pref.phone_number} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono">{pref.phone_number}</span>
                </div>
                <Badge variant={pref.opted_in ? 'success' : 'secondary'}>
                  {pref.opted_in ? 'Opted In' : 'Opted Out'}
                </Badge>
              </div>
            ))}
            {preferences.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No SMS preferences recorded yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Status */}
      <Card>
        <CardHeader>
          <CardTitle>Recent SMS Delivery Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {deliveryStatuses.map((status) => (
              <div key={status.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{getMessageTypeLabel(status.message_type)}</span>
                    {getStatusBadge(status.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-mono">{status.phone_number}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(status.sent_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  {status.status === 'delivered' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : status.status === 'failed' || status.status === 'undelivered' ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
            {deliveryStatuses.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No SMS messages sent yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}