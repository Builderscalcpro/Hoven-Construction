import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { sendgridService } from '@/lib/sendgridService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Send, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', subject: '', body: '', category: 'quotes' });
  const [testEmail, setTestEmail] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const { data } = await supabase.from('email_templates').select('*').order('category', { ascending: true });
    if (data) setTemplates(data);
  };

  const saveTemplate = async () => {
    if (editingTemplate) {
      await supabase.from('email_templates').update(formData).eq('id', editingTemplate.id);
    } else {
      await supabase.from('email_templates').insert([formData]);
    }
    setFormData({ name: '', subject: '', body: '', category: 'quotes' });
    setEditingTemplate(null);
    setDialogOpen(false);
    loadTemplates();
    toast({ title: 'Success', description: 'Template saved successfully' });
  };

  const deleteTemplate = async (id: string) => {
    await supabase.from('email_templates').delete().eq('id', id);
    loadTemplates();
    toast({ title: 'Deleted', description: 'Template deleted successfully' });
  };

  const sendTestEmail = async (template: any) => {
    if (!testEmail) {
      toast({ title: 'Error', description: 'Please enter a test email address', variant: 'destructive' });
      return;
    }

    const result = await sendgridService.sendEmail({
      to: testEmail,
      subject: template.subject,
      html: template.body
    });

    if (result.success) {
      toast({ title: 'Test email sent', description: `Sent to ${testEmail}` });
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    }
  };

  const categoryColors: any = {
    'quotes': 'bg-blue-100 text-blue-800',
    'follow-ups': 'bg-green-100 text-green-800',
    'project-updates': 'bg-purple-100 text-purple-800',
    'automated': 'bg-orange-100 text-orange-800'
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Email Templates</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => { 
              setEditingTemplate(null); 
              setFormData({ name: '', subject: '', body: '', category: 'quotes' }); 
            }}>
              <Plus className="h-4 w-4 mr-2" /> New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingTemplate ? 'Edit' : 'Create'} Template</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Template Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
              <div><Label>Category</Label>
                <select className="w-full border rounded-md p-2" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="quotes">Quotes</option>
                  <option value="follow-ups">Follow-ups</option>
                  <option value="project-updates">Project Updates</option>
                  <option value="automated">Automated</option>
                </select>
              </div>
              <div><Label>Subject Line</Label><Input value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} /></div>
              <div><Label>Email Body (HTML supported)</Label><Textarea rows={12} value={formData.body} onChange={(e) => setFormData({...formData, body: e.target.value})} placeholder="Use {{customer_name}}, {{project_type}}, {{amount}} as placeholders" /></div>
              <Button onClick={saveTemplate} className="w-full">Save Template</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Test email address"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <Badge className={`mt-2 ${categoryColors[template.category]}`}>{template.category}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => sendTestEmail(template)}>
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { 
                    setEditingTemplate(template); 
                    setFormData(template); 
                    setDialogOpen(true);
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteTemplate(template.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-700 mb-2">Subject: {template.subject}</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-3">{template.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

