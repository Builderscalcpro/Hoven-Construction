import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ResourceAllocationProps {
  projectId: string;
  tasks: any[];
}

export function ResourceAllocation({ projectId, tasks }: ResourceAllocationProps) {
  const [open, setOpen] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    task_id: '',
    resource_id: '',
    quantity: '',
    allocated_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchResources();
    fetchAllocations();
  }, [projectId]);

  const fetchResources = async () => {
    const { data } = await supabase.from('resources').select('*').eq('available', true);
    if (data) setResources(data);
  };

  const fetchAllocations = async () => {
    const { data } = await supabase
      .from('resource_allocations')
      .select('*, resources(*), tasks(name)')
      .eq('project_id', projectId);
    if (data) setAllocations(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('resource_allocations').insert([{
        ...formData,
        project_id: projectId,
        quantity: parseFloat(formData.quantity),
      }]);
      if (error) throw error;
      toast.success('Resource allocated');
      setOpen(false);
      setFormData({ task_id: '', resource_id: '', quantity: '', allocated_date: new Date().toISOString().split('T')[0] });
      fetchAllocations();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteAllocation = async (id: string) => {
    try {
      const { error } = await supabase.from('resource_allocations').delete().eq('id', id);
      if (error) throw error;
      toast.success('Allocation removed');
      fetchAllocations();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Resource Allocation</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-2" />Allocate Resource</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Allocate Resource</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Task</Label>
                <Select value={formData.task_id} onValueChange={(value) => setFormData({ ...formData, task_id: value })}>
                  <SelectTrigger><SelectValue placeholder="Select task" /></SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>{task.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Resource</Label>
                <Select value={formData.resource_id} onValueChange={(value) => setFormData({ ...formData, resource_id: value })}>
                  <SelectTrigger><SelectValue placeholder="Select resource" /></SelectTrigger>
                  <SelectContent>
                    {resources.map((resource) => (
                      <SelectItem key={resource.id} value={resource.id}>
                        {resource.name} (${resource.cost_per_unit}/{resource.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity</Label>
                <Input type="number" step="0.01" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={formData.allocated_date} onChange={(e) => setFormData({ ...formData, allocated_date: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full">Allocate</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allocations.map((allocation) => (
            <TableRow key={allocation.id}>
              <TableCell>{allocation.tasks?.name}</TableCell>
              <TableCell>{allocation.resources?.name}</TableCell>
              <TableCell>{allocation.quantity} {allocation.resources?.unit}</TableCell>
              <TableCell>${(allocation.quantity * allocation.resources?.cost_per_unit).toFixed(2)}</TableCell>
              <TableCell>{new Date(allocation.allocated_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button size="sm" variant="ghost" onClick={() => deleteAllocation(allocation.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
