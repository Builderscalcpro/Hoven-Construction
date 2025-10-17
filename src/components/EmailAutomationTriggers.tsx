import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { Zap, Mail, Clock, UserPlus, FileText, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutomationTrigger {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  template_id?: string;
  delay_hours?: number;
}

export default function EmailAutomationTriggers() {
  const [triggers, setTriggers] = useState<AutomationTrigger[]>([
    {
      id: 'new_lead',
      name: 'New Lead Received',
      description: 'Send welcome email when new lead submits form',
      icon: UserPlus,
      enabled: true,
      delay_hours: 0
    },
    {
      id: 'quote_sent',
      name: 'Quote Sent',
      description: 'Send follow-up after quote is sent',
      icon: FileText,
      enabled: true,
      delay_hours: 48
    },
    {
      id: 'project_started',
      name: 'Project Started',
      description: 'Notify client when project begins',
      icon: Zap,
      enabled: true,
      delay_hours: 0
    },
    {
      id: 'payment_received',
      name: 'Payment Received',
      description: 'Send receipt and thank you',
      icon: DollarSign,
      enabled: true,
      delay_hours: 0
    },
    {
      id: 'project_milestone',
      name: 'Project Milestone',
      description: 'Update client on project progress',
      icon: Clock,
      enabled: false,
      delay_hours: 0
    }
  ]);
  const [templates, setTemplates] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
    loadTriggerSettings();
  }, []);

  const loadTemplates = async () => {
    const { data } = await supabase.from('email_templates').select('id, name, category');
    if (data) setTemplates(data);
  };

  const loadTriggerSettings = async () => {
    const { data } = await supabase.from('email_automation_triggers').select('*');
    if (data && data.length > 0) {
      setTriggers(prev => prev.map(t => {
        const saved = data.find(d => d.trigger_type === t.id);
        return saved ? { ...t, ...saved } : t;
      }));
    }
  };

  const saveTrigger = async (trigger: AutomationTrigger) => {
    await supabase.from('email_automation_triggers').upsert({
      trigger_type: trigger.id,
      enabled: trigger.enabled,
      template_id: trigger.template_id,
      delay_hours: trigger.delay_hours,
      updated_at: new Date().toISOString()
    });
    
    toast({ title: 'Saved', description: `${trigger.name} automation updated` });
  };

  const toggleTrigger = (id: string) => {
    setTriggers(prev => prev.map(t => 
      t.id === id ? { ...t, enabled: !t.enabled } : t
    ));
  };

  const updateTriggerTemplate = (id: string, templateId: string) => {
    setTriggers(prev => prev.map(t => 
      t.id === id ? { ...t, template_id: templateId } : t
    ));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Email Automation Triggers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Configure automatic emails based on customer actions and project events
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {triggers.map((trigger) => {
          const Icon = trigger.icon;
          return (
            <Card key={trigger.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{trigger.name}</h4>
                      <p className="text-sm text-gray-600">{trigger.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={trigger.enabled}
                    onCheckedChange={() => toggleTrigger(trigger.id)}
                  />
                </div>

                {trigger.enabled && (
                  <div className="space-y-3 ml-14">
                    <div>
                      <Label className="text-xs">Email Template</Label>
                      <Select
                        value={trigger.template_id}
                        onValueChange={(value) => updateTriggerTemplate(trigger.id, value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {trigger.delay_hours !== undefined && trigger.delay_hours > 0 && (
                      <div>
                        <Label className="text-xs">Delay (hours)</Label>
                        <Select
                          value={trigger.delay_hours.toString()}
                          onValueChange={(value) => {
                            setTriggers(prev => prev.map(t => 
                              t.id === trigger.id ? { ...t, delay_hours: parseInt(value) } : t
                            ));
                          }}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Immediately</SelectItem>
                            <SelectItem value="1">1 hour</SelectItem>
                            <SelectItem value="24">24 hours</SelectItem>
                            <SelectItem value="48">48 hours</SelectItem>
                            <SelectItem value="72">72 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Button size="sm" onClick={() => saveTrigger(trigger)}>
                      Save Settings
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
