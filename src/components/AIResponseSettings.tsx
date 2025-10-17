import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function AIResponseSettings() {
  const [settings, setSettings] = useState({
    default_tone: 'professional',
    auto_generate: false,
    require_approval: true,
    business_name: '',
    business_description: '',
    custom_instructions: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_response_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('ai_response_settings')
        .upsert({ ...settings, user_id: user.id });

      if (error) throw error;

      toast({
        title: 'Settings saved',
        description: 'Your AI response settings have been updated.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Response Settings</CardTitle>
        <CardDescription>Configure how AI generates responses to reviews</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tone">Default Tone</Label>
          <Select value={settings.default_tone} onValueChange={(value) => setSettings({ ...settings, default_tone: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_name">Business Name</Label>
          <Input
            id="business_name"
            value={settings.business_name}
            onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
            placeholder="Your Business Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_description">Business Description</Label>
          <Textarea
            id="business_description"
            value={settings.business_description}
            onChange={(e) => setSettings({ ...settings, business_description: e.target.value })}
            placeholder="Brief description of your business..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom_instructions">Custom Instructions</Label>
          <Textarea
            id="custom_instructions"
            value={settings.custom_instructions}
            onChange={(e) => setSettings({ ...settings, custom_instructions: e.target.value })}
            placeholder="Any specific guidelines for AI responses..."
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="require_approval">Require Approval</Label>
            <p className="text-sm text-muted-foreground">Review responses before posting</p>
          </div>
          <Switch
            id="require_approval"
            checked={settings.require_approval}
            onCheckedChange={(checked) => setSettings({ ...settings, require_approval: checked })}
          />
        </div>

        <Button onClick={saveSettings} disabled={saving} className="w-full">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
}
