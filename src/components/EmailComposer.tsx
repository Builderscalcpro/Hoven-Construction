import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EmailComposer() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: custData } = await supabase.from('customers').select('*');
    const { data: templData } = await supabase.from('email_templates').select('*');
    if (custData) setCustomers(custData);
    if (templData) setTemplates(templData);
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template && selectedCustomer) {
      setSelectedTemplate(template);
      let sub = template.subject.replace('[Customer Name]', selectedCustomer.name);
      let bod = template.body.replace(/\[Customer Name\]/g, selectedCustomer.name);
      setSubject(sub);
      setBody(bod);
    }
  };

  const sendEmail = async () => {
    if (!selectedCustomer || !subject || !body) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { 
          to: selectedCustomer.email,
          subject: subject,
          html: body.replace(/\n/g, '<br>')
        }
      });

      if (error) throw error;

      await supabase.from('sent_emails').insert([{
        customer_id: selectedCustomer.id,
        template_id: selectedTemplate?.id,
        subject: subject,
        body: body,
        status: 'sent'
      }]);

      toast({ title: 'Success', description: 'Email sent successfully!' });
      setSubject('');
      setBody('');
      setSelectedCustomer(null);
      setSelectedTemplate(null);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Compose Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Select Customer</Label>
          <Select value={selectedCustomer?.id} onValueChange={(id) => setSelectedCustomer(customers.find(c => c.id === id))}>
            <SelectTrigger><SelectValue placeholder="Choose customer" /></SelectTrigger>
            <SelectContent>
              {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name} ({c.email})</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {selectedCustomer && (
          <>
            <div>
              <Label>Use Template (Optional)</Label>
              <Select onValueChange={applyTemplate}>
                <SelectTrigger><SelectValue placeholder="Choose template" /></SelectTrigger>
                <SelectContent>
                  {templates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject" />
            </div>

            <div>
              <Label>Message</Label>
              <Textarea rows={12} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Email body" />
            </div>

            <Button onClick={sendEmail} disabled={sending} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {sending ? 'Sending...' : 'Send Email'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
