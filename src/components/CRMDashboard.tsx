import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, Briefcase, MessageSquare, Plus, Search, Calendar, DollarSign, TrendingUp, FileText, Clock, CheckCircle2, Mail } from 'lucide-react';
import EmailTemplates from './EmailTemplates';
import EmailComposer from './EmailComposer';
import EmailTracking from './EmailTracking';
import EmailReminders from './EmailReminders';

export default function CRMDashboard() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [newNote, setNewNote] = useState('');
  const [newTask, setNewTask] = useState({ title: '', due_date: '', customer_id: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: custData } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    const { data: projData } = await supabase.from('projects').select('*, customers(name, email)').order('created_at', { ascending: false });
    const { data: notesData } = await supabase.from('notes').select('*, customers(name)').order('created_at', { ascending: false });
    const { data: tasksData } = await supabase.from('tasks').select('*, customers(name)').order('due_date', { ascending: true });
    if (custData) setCustomers(custData);
    if (projData) setProjects(projData);
    if (notesData) setNotes(notesData);
    if (tasksData) setTasks(tasksData);
  };

  const addNote = async () => {
    if (!selectedCustomer || !newNote) return;
    await supabase.from('notes').insert([{ customer_id: selectedCustomer.id, content: newNote }]);
    setNewNote('');
    loadData();
  };

  const addTask = async () => {
    await supabase.from('tasks').insert([newTask]);
    setNewTask({ title: '', due_date: '', customer_id: '' });
    loadData();
  };

  const toggleTask = async (id: string, completed: boolean) => {
    await supabase.from('tasks').update({ completed: !completed }).eq('id', id);
    loadData();
  };

  const totalRevenue = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const activeProjects = projects.filter(p => p.status === 'in-progress').length;
  const pendingTasks = tasks.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">CRM Dashboard</h1>
          <a href="/" className="text-sm text-gray-600 hover:text-amber-500">← Back to Site</a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
              <p className="text-xs text-gray-500 mt-1">{customers.filter(c => c.status === 'lead').length} new leads</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects}</div>
              <p className="text-xs text-gray-500 mt-1">{projects.length} total projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue Pipeline</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</div>
              <p className="text-xs text-gray-500 mt-1">Total project value</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
              <p className="text-xs text-gray-500 mt-1">{tasks.length} total tasks</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="customers">
          <TabsList>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="emails">
              <Mail className="h-4 w-4 mr-2" />
              Emails
            </TabsTrigger>
          </TabsList>

          
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Customer Management</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {customers.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((customer) => (
                    <div key={customer.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                      </div>
                      <Badge variant={customer.status === 'lead' ? 'default' : 'secondary'}>{customer.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Project Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {projects.map((project) => (
                    <div key={project.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{project.customers?.name}</p>
                        <p className="text-sm text-gray-600">{project.project_type} - ${project.budget?.toLocaleString() || 'TBD'}</p>
                      </div>
                      <Badge>{project.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Task Management</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Add Task</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Create New Task</DialogTitle></DialogHeader>
                      <div className="space-y-4">
                        <div><Label>Task Title</Label><Input value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} /></div>
                        <div><Label>Due Date</Label><Input type="date" value={newTask.due_date} onChange={(e) => setNewTask({...newTask, due_date: e.target.value})} /></div>
                        <div><Label>Customer</Label>
                          <Select value={newTask.customer_id} onValueChange={(v) => setNewTask({...newTask, customer_id: v})}>
                            <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                            <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <Button onClick={addTask}>Create Task</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <button onClick={() => toggleTask(task.id, task.completed)}>
                        <CheckCircle2 className={`h-5 w-5 ${task.completed ? 'text-green-500' : 'text-gray-300'}`} />
                      </button>
                      <div className="flex-1">
                        <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
                        <p className="text-sm text-gray-600">{task.customers?.name} • Due: {task.due_date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Activity Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCustomer && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium">Adding note for: {selectedCustomer.name}</p>
                    <div className="flex gap-2 mt-2">
                      <Textarea placeholder="Add a note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                      <Button onClick={addNote}>Add</Button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">{note.customers?.name}</p>
                      <p className="text-sm text-gray-700 mt-1">{note.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(note.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emails">
            <Tabs defaultValue="compose" className="space-y-4">
              <TabsList>
                <TabsTrigger value="compose">Compose</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="tracking">Tracking</TabsTrigger>
                <TabsTrigger value="reminders">Reminders</TabsTrigger>
              </TabsList>

              <TabsContent value="compose">
                <EmailComposer />
              </TabsContent>

              <TabsContent value="templates">
                <EmailTemplates />
              </TabsContent>

              <TabsContent value="tracking">
                <EmailTracking />
              </TabsContent>

              <TabsContent value="reminders">
                <EmailReminders />
              </TabsContent>
            </Tabs>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}