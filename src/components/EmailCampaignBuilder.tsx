import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Sequence {
  id?: string;
  template_id: string;
  sequence_order: number;
  delay_hours: number;
  subject: string;
}

export default function EmailCampaignBuilder() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [leadScoreType, setLeadScoreType] = useState<'high' | 'medium' | 'standard'>('high');
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadCampaigns();
    loadTemplates();
  }, []);

  const loadCampaigns = async () => {
    const { data } = await supabase.from('email_campaigns').select('*').order('created_at', { ascending: false });
    if (data) setCampaigns(data);
  };

  const loadTemplates = async () => {
    const { data } = await supabase.from('email_templates').select('*');
    if (data) setTemplates(data);
  };

  const loadCampaignDetails = async (campaignId: string) => {
    const { data } = await supabase
      .from('email_sequences')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('sequence_order');
    if (data) setSequences(data);
  };

  const addSequence = () => {
    setSequences([...sequences, {
      template_id: '',
      sequence_order: sequences.length + 1,
      delay_hours: 24,
      subject: ''
    }]);
  };

  const removeSequence = (index: number) => {
    setSequences(sequences.filter((_, i) => i !== index));
  };

  const updateSequence = (index: number, field: string, value: any) => {
    const updated = [...sequences];
    updated[index] = { ...updated[index], [field]: value };
    setSequences(updated);
  };

  const saveCampaign = async () => {
    try {
      // Save campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('email_campaigns')
        .upsert({
          id: selectedCampaign || undefined,
          name: campaignName,
          description,
          lead_score_type: leadScoreType,
          is_active: isActive
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Delete existing sequences
      if (selectedCampaign) {
        await supabase.from('email_sequences').delete().eq('campaign_id', selectedCampaign);
      }

      // Save sequences
      const sequencesData = sequences.map((seq, idx) => ({
        campaign_id: campaign.id,
        template_id: seq.template_id,
        sequence_order: idx + 1,
        delay_hours: seq.delay_hours,
        subject: seq.subject
      }));

      const { error: seqError } = await supabase.from('email_sequences').insert(sequencesData);
      if (seqError) throw seqError;

      toast.success('Campaign saved successfully!');
      loadCampaigns();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Drip Campaign Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Campaign Name</Label>
              <Input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="High-Value Lead Sequence" />
            </div>
            <div>
              <Label>Lead Score Type</Label>
              <Select value={leadScoreType} onValueChange={(v: any) => setLeadScoreType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Value (70+)</SelectItem>
                  <SelectItem value="medium">Medium Value (50-69)</SelectItem>
                  <SelectItem value="standard">Standard (0-49)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Email Sequence</h3>
              <Button onClick={addSequence} size="sm"><Plus className="w-4 h-4 mr-2" />Add Email</Button>
            </div>

            {sequences.map((seq, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Email #{idx + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeSequence(idx)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Template</Label>
                      <Select value={seq.template_id} onValueChange={(v) => updateSequence(idx, 'template_id', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Delay (hours)</Label>
                      <Input type="number" value={seq.delay_hours} onChange={(e) => updateSequence(idx, 'delay_hours', parseInt(e.target.value))} />
                    </div>
                  </div>
                  <div>
                    <Label>Subject Line</Label>
                    <Input value={seq.subject} onChange={(e) => updateSequence(idx, 'subject', e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button onClick={saveCampaign} className="w-full"><Save className="w-4 h-4 mr-2" />Save Campaign</Button>
        </CardContent>
      </Card>
    </div>
  );
}
