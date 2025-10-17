import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AutomatedEmailRules() {
  const [rules, setRules] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [editingRule, setEditingRule] = useState<any>(null);

  useEffect(() => {
    loadRules();
    loadTemplates();
  }, []);

  const loadRules = async () => {
    const { data } = await supabase
      .from('email_automation_rules')
      .select('*, email_templates(template_name)')
      .order('created_at', { ascending: false });
    setRules(data || []);
  };

  const loadTemplates = async () => {
    const { data } = await supabase.from('email_templates').select('*');
    setTemplates(data || []);
  };

  const saveRule = async () => {
    if (!editingRule.rule_name || !editingRule.rule_type) {
      toast.error('Please fill in all required fields');
      return;
    }

    const { error } = editingRule.id
      ? await supabase.from('email_automation_rules').update(editingRule).eq('id', editingRule.id)
      : await supabase.from('email_automation_rules').insert(editingRule);

    if (error) {
      toast.error('Failed to save rule');
    } else {
      toast.success('Rule saved successfully');
      setEditingRule(null);
      loadRules();
    }
  };

  const toggleRule = async (id: string, isActive: boolean) => {
    await supabase.from('email_automation_rules').update({ is_active: isActive }).eq('id', id);
    loadRules();
    toast.success(`Rule ${isActive ? 'activated' : 'deactivated'}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Email Automation Rules</h2>
        <Button onClick={() => setEditingRule({ rule_name: '', rule_type: 'thank_you', delay_hours: 0, is_active: true })}>
          Add New Rule
        </Button>
      </div>

      {editingRule && (
        <Card>
          <CardHeader>
            <CardTitle>{editingRule.id ? 'Edit Rule' : 'New Rule'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rule Name</Label>
              <Input value={editingRule.rule_name} onChange={(e) => setEditingRule({ ...editingRule, rule_name: e.target.value })} />
            </div>
            <div>
              <Label>Rule Type</Label>
              <Select value={editingRule.rule_type} onValueChange={(v) => setEditingRule({ ...editingRule, rule_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="thank_you">Thank You Email</SelectItem>
                  <SelectItem value="review_request">Review Request</SelectItem>
                  <SelectItem value="re_engagement">Re-engagement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Delay (hours)</Label>
              <Input type="number" value={editingRule.delay_hours} onChange={(e) => setEditingRule({ ...editingRule, delay_hours: parseInt(e.target.value) })} />
            </div>
            <div>
              <Label>Email Template</Label>
              <Select value={editingRule.template_id} onValueChange={(v) => setEditingRule({ ...editingRule, template_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
                <SelectContent>
                  {templates.map(t => <SelectItem key={t.id} value={t.id}>{t.template_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveRule}>Save Rule</Button>
              <Button variant="outline" onClick={() => setEditingRule(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {rules.map(rule => (
          <Card key={rule.id}>
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <h3 className="font-semibold">{rule.rule_name}</h3>
                <p className="text-sm text-gray-600">
                  Type: {rule.rule_type} | Delay: {rule.delay_hours}h | Template: {rule.email_templates?.template_name || 'None'}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Switch checked={rule.is_active} onCheckedChange={(checked) => toggleRule(rule.id, checked)} />
                <Button variant="outline" size="sm" onClick={() => setEditingRule(rule)}>Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}