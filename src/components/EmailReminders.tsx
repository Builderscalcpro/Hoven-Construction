import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Bell, CheckCircle2, Clock } from 'lucide-react';

export default function EmailReminders() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [newReminder, setNewReminder] = useState({ customer_id: '', reminder_type: 'follow-up', reminder_date: '', notes: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: remData } = await supabase.from('email_reminders').select('*, customers(name, email)').order('reminder_date', { ascending: true });
    const { data: custData } = await supabase.from('customers').select('*');
    if (remData) setReminders(remData);
    if (custData) setCustomers(custData);
  };

  const addReminder = async () => {
    await supabase.from('email_reminders').insert([newReminder]);
    setNewReminder({ customer_id: '', reminder_type: 'follow-up', reminder_date: '', notes: '' });
    loadData();
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    await supabase.from('email_reminders').update({ completed: !completed }).eq('id', id);
    loadData();
  };

  const upcomingReminders = reminders.filter(r => !r.completed && new Date(r.reminder_date) >= new Date());
  const overdueReminders = reminders.filter(r => !r.completed && new Date(r.reminder_date) < new Date());

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Follow-up Reminders</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Add Reminder</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Reminder</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Customer</Label>
                <Select value={newReminder.customer_id} onValueChange={(v) => setNewReminder({...newReminder, customer_id: v})}>
                  <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                  <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Reminder Type</Label>
                <Select value={newReminder.reminder_type} onValueChange={(v) => setNewReminder({...newReminder, reminder_type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="quote-check">Quote Check-in</SelectItem>
                    <SelectItem value="project-update">Project Update</SelectItem>
                    <SelectItem value="satisfaction-check">Satisfaction Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Reminder Date</Label><Input type="date" value={newReminder.reminder_date} onChange={(e) => setNewReminder({...newReminder, reminder_date: e.target.value})} /></div>
              <div><Label>Notes</Label><Input value={newReminder.notes} onChange={(e) => setNewReminder({...newReminder, notes: e.target.value})} placeholder="Optional notes" /></div>
              <Button onClick={addReminder}>Create Reminder</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {overdueReminders.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Overdue ({overdueReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {overdueReminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <button onClick={() => toggleComplete(reminder.id, reminder.completed)}>
                  <CheckCircle2 className="h-5 w-5 text-gray-300" />
                </button>
                <div className="flex-1">
                  <p className="font-medium">{reminder.customers?.name}</p>
                  <p className="text-sm text-gray-600">{reminder.reminder_type} • {reminder.reminder_date}</p>
                  {reminder.notes && <p className="text-xs text-gray-500 mt-1">{reminder.notes}</p>}
                </div>
                <Badge variant="destructive">Overdue</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Upcoming Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {upcomingReminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <button onClick={() => toggleComplete(reminder.id, reminder.completed)}>
                <CheckCircle2 className="h-5 w-5 text-gray-300" />
              </button>
              <div className="flex-1">
                <p className="font-medium">{reminder.customers?.name}</p>
                <p className="text-sm text-gray-600">{reminder.reminder_type} • {reminder.reminder_date}</p>
                {reminder.notes && <p className="text-xs text-gray-500 mt-1">{reminder.notes}</p>}
              </div>
            </div>
          ))}
          {upcomingReminders.length === 0 && <p className="text-center text-gray-500 py-4">No upcoming reminders</p>}
        </CardContent>
      </Card>
    </div>
  );
}
