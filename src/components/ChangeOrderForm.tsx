import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface ChangeOrderFormProps {
  projectId: string;
  consultationId?: string;
  onSuccess: () => void;
}

export function ChangeOrderForm({ projectId, consultationId, onSuccess }: ChangeOrderFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderNumber = `CO-${Date.now()}`;
      const { error } = await supabase.from('change_orders').insert({
        project_id: projectId,
        consultation_id: consultationId,
        order_number: orderNumber,
        title: formData.title,
        description: formData.description,
        reason: formData.reason,
        requested_by: user?.id,
        status: 'pending'
      });
      if (error) throw error;
      toast({ title: 'Change order submitted' });
      setFormData({ title: '', description: '', reason: '' });
      onSuccess();
    } catch (error) {
      toast({ title: 'Error submitting change order', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Request Change Order</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />
        </div>
        <div>
          <Label>Reason for Change</Label>
          <Textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            rows={2}
          />
        </div>
        <Button type="submit" disabled={loading}>
          Submit Change Order
        </Button>
      </form>
    </Card>
  );
}
