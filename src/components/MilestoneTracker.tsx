import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle2, Circle, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface MilestoneTrackerProps {
  projectId: string;
  milestones: any[];
  onUpdate: () => void;
}

export function MilestoneTracker({ projectId, milestones, onUpdate }: MilestoneTrackerProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', due_date: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('milestones').insert([{ ...formData, project_id: projectId }]);
      if (error) throw error;
      toast.success('Milestone added');
      setOpen(false);
      setFormData({ name: '', description: '', due_date: '' });
      onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleComplete = async (milestone: any) => {
    try {
      const wasCompleted = milestone.completed;
      const { error } = await supabase
        .from('milestones')
        .update({ 
          completed: !milestone.completed,
          completed_at: !milestone.completed ? new Date().toISOString() : null
        })
        .eq('id', milestone.id);
      if (error) throw error;

      // Send notification if milestone was just completed
      if (!wasCompleted) {
        // Get project and customer details
        const { data: projectData } = await supabase
          .from('projects')
          .select('name, client_id, customers(name, email)')
          .eq('id', projectId)
          .single();

        if (projectData && projectData.customers) {
          await supabase.functions.invoke('send-notification', {
            body: {
              type: 'milestone',
              email: projectData.customers.email,
              name: projectData.customers.name,
              data: {
                milestone: milestone.name,
                project: projectData.name,
                notes: milestone.description || ''
              }
            }
          });

          // Log notification
          await supabase.from('email_notifications').insert([{
            customer_id: projectData.client_id,
            project_id: projectId,
            notification_type: 'milestone_completed',
            email_to: projectData.customers.email,
            subject: `Milestone Completed: ${milestone.name}`,
            body: `Milestone "${milestone.name}" completed for project ${projectData.name}`,
            metadata: { milestone_name: milestone.name }
          }]);
        }
      }

      toast.success(wasCompleted ? 'Milestone reopened' : 'Milestone completed');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    }
  };


  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Milestones</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Milestone</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Milestone</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full">Add Milestone</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {milestones.map((milestone) => (
          <div key={milestone.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer" onClick={() => toggleComplete(milestone)}>
            {milestone.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5" />
            )}
            <div className="flex-1">
              <div className={`font-medium ${milestone.completed ? 'line-through text-muted-foreground' : ''}`}>
                {milestone.name}
              </div>
              {milestone.description && (
                <div className="text-sm text-muted-foreground">{milestone.description}</div>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                Due: {new Date(milestone.due_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
        {milestones.length === 0 && (
          <div className="text-center text-muted-foreground py-8">No milestones yet</div>
        )}
      </div>
    </Card>
  );
}
