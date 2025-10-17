import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NotificationSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    project_status_updates: true,
    invoice_notifications: true,
    payment_confirmations: true,
    milestone_updates: true,
    marketing_emails: false
  });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setUserId(user.id);

    const { data } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('customer_id', user.id)
      .single();
    
    if (data) {
      setSettings({
        project_status_updates: data.project_status_updates,
        invoice_notifications: data.invoice_notifications,
        payment_confirmations: data.payment_confirmations,
        milestone_updates: data.milestone_updates,
        marketing_emails: data.marketing_emails
      });
    }
  };

  const saveSettings = async () => {
    if (!userId) {
      toast({ title: 'Error', description: 'Please log in to save settings', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('notification_settings')
      .upsert({
        customer_id: userId,
        ...settings
      }, {
        onConflict: 'customer_id'
      });
    
    setLoading(false);
    if (error) {
      console.error('Save error:', error);
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Notification preferences saved' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Email Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="project">Project Status Updates</Label>
            <p className="text-sm text-gray-500">Get notified when your project status changes</p>
          </div>
          <Switch
            id="project"
            checked={settings.project_status_updates}
            onCheckedChange={(v) => setSettings({...settings, project_status_updates: v})}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="invoice">Invoice Notifications</Label>
            <p className="text-sm text-gray-500">Receive alerts when new invoices are generated</p>
          </div>
          <Switch
            id="invoice"
            checked={settings.invoice_notifications}
            onCheckedChange={(v) => setSettings({...settings, invoice_notifications: v})}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="payment">Payment Confirmations</Label>
            <p className="text-sm text-gray-500">Get confirmation emails when payments are received</p>
          </div>
          <Switch
            id="payment"
            checked={settings.payment_confirmations}
            onCheckedChange={(v) => setSettings({...settings, payment_confirmations: v})}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="milestone">Milestone Updates</Label>
            <p className="text-sm text-gray-500">Be notified when project milestones are completed</p>
          </div>
          <Switch
            id="milestone"
            checked={settings.milestone_updates}
            onCheckedChange={(v) => setSettings({...settings, milestone_updates: v})}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="marketing">Marketing Emails</Label>
            <p className="text-sm text-gray-500">Receive tips, promotions, and company updates</p>
          </div>
          <Switch
            id="marketing"
            checked={settings.marketing_emails}
            onCheckedChange={(v) => setSettings({...settings, marketing_emails: v})}
          />
        </div>

        <Button onClick={saveSettings} disabled={loading} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
}
