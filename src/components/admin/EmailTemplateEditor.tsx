import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { EmailTemplatePreview } from './EmailTemplatePreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const appointmentTypes = [
  { value: 'default', label: 'Default' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'kitchen', label: 'Kitchen Remodeling' },
  { value: 'bathroom', label: 'Bathroom Renovation' },
  { value: 'addition', label: 'Home Addition' },
];

export function EmailTemplateEditor() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState('default');
  const [formData, setFormData] = useState({
    template_name: '',
    appointment_type: 'default',
    business_email: '',
    logo_url: '',
    primary_color: '#3B82F6',
    secondary_color: '#1E40AF',
    background_color: '#F3F4F6',
    subject_line: '',
    email_body: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    loadTemplate(selectedType);
  }, [selectedType]);

  const loadTemplates = async () => {
    const { data } = await supabase.from('email_templates').select('*');
    if (data) setTemplates(data);
  };

  const loadTemplate = async (type: string) => {
    const { data } = await supabase
      .from('email_templates')
      .select('*')
      .eq('appointment_type', type)
      .single();
    
    if (data) {
      setFormData(data);
    } else {
      setFormData({
        template_name: '',
        appointment_type: type,
        business_email: '',
        logo_url: '',
        primary_color: '#3B82F6',
        secondary_color: '#1E40AF',
        background_color: '#F3F4F6',
        subject_line: '',
        email_body: '',
      });
    }
  };

  const handleSave = async () => {
    const existing = templates.find(t => t.appointment_type === formData.appointment_type);
    
    if (existing) {
      const { error } = await supabase
        .from('email_templates')
        .update(formData)
        .eq('id', existing.id);
      
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    } else {
      const { error } = await supabase.from('email_templates').insert([formData]);
      
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    }

    toast({ title: 'Success', description: 'Template saved successfully' });
    loadTemplates();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Email Template Editor</h2>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {appointmentTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="editor">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label>Template Name</Label>
                <Input
                  value={formData.template_name}
                  onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                  placeholder="e.g., Kitchen Consultation Confirmation"
                />
              </div>

              <div>
                <Label>Business Email</Label>
                <Input
                  type="email"
                  value={formData.business_email}
                  onChange={(e) => setFormData({ ...formData, business_email: e.target.value })}
                  placeholder="appointments@yourbusiness.com"
                />
              </div>

              <div>
                <Label>Logo URL</Label>
                <Input
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://your-logo-url.com/logo.png"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Primary Color</Label>
                  <Input
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Secondary Color</Label>
                  <Input
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Background Color</Label>
                  <Input
                    type="color"
                    value={formData.background_color}
                    onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Subject Line</Label>
                <Input
                  value={formData.subject_line}
                  onChange={(e) => setFormData({ ...formData, subject_line: e.target.value })}
                  placeholder="Appointment Confirmation - {{date}} at {{time}}"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Variables: {'{'}{'{'} date {'}'}{'}'}, {'{'}{'{'} time {'}'}{'}'}, {'{'}{'{'} service {'}'}{'}'}, {'{'}{'{'} clientName {'}'}{'}'}
                </p>
              </div>

              <div>
                <Label>Email Body (HTML)</Label>
                <Textarea
                  value={formData.email_body}
                  onChange={(e) => setFormData({ ...formData, email_body: e.target.value })}
                  rows={10}
                  placeholder="<h2>Your Appointment is Confirmed!</h2><p>Details here...</p>"
                />
              </div>

              <Button onClick={handleSave} className="w-full">Save Template</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <EmailTemplatePreview template={formData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
