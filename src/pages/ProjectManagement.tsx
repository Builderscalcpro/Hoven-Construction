import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Calendar, DollarSign, Users, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ProjectForm } from '@/components/ProjectForm';
import { TaskForm } from '@/components/TaskForm';
import { GanttChart } from '@/components/GanttChart';
import { MilestoneTracker } from '@/components/MilestoneTracker';
import { ResourceAllocation } from '@/components/ResourceAllocation';

export default function ProjectManagement() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchProjectDetails();
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*, customers(name)')
      .order('created_at', { ascending: false });
    if (data) {
      setProjects(data);
      if (!selectedProject && data.length > 0) {
        setSelectedProject(data[0]);
      }
    }
  };

  const fetchProjectDetails = async () => {
    const [tasksData, milestonesData, invoicesData] = await Promise.all([
      supabase.from('tasks').select('*').eq('project_id', selectedProject.id).order('start_date'),
      supabase.from('milestones').select('*').eq('project_id', selectedProject.id).order('due_date'),
      supabase.from('project_invoices').select('*, invoices(*)').eq('project_id', selectedProject.id),
    ]);
    if (tasksData.data) setTasks(tasksData.data);
    if (milestonesData.data) setMilestones(milestonesData.data);
    if (invoicesData.data) setInvoices(invoicesData.data.map(pi => pi.invoices));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'on_hold': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 pb-20 md:pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Project Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage projects, tasks, and resources</p>
        </div>
        <Button onClick={() => { setEditingProject(null); setShowProjectForm(true); }} size="sm" className="sm:size-default w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {projects.slice(0, 4).map((project) => (
          <Card
            key={project.id}
            className={`p-4 cursor-pointer hover:border-primary active:scale-95 transition ${selectedProject?.id === project.id ? 'border-primary' : ''}`}
            onClick={() => setSelectedProject(project)}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{project.name}</h3>
              <Badge className={`${getStatusColor(project.status)} text-xs`}>{project.status}</Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-1">{project.customers?.name}</p>
            <Progress value={project.progress || 0} className="mb-2" />
            <div className="text-xs text-muted-foreground">{project.progress || 0}% Complete</div>
          </Card>
        ))}
      </div>

      {selectedProject && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 overflow-x-auto h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="tasks" className="text-xs sm:text-sm">Tasks</TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs sm:text-sm">Timeline</TabsTrigger>
            <TabsTrigger value="resources" className="hidden sm:flex text-xs sm:text-sm">Resources</TabsTrigger>
            <TabsTrigger value="invoices" className="hidden sm:flex text-xs sm:text-sm">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Card className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Duration</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold">
                  {selectedProject.start_date && selectedProject.end_date
                    ? Math.ceil((new Date(selectedProject.end_date).getTime() - new Date(selectedProject.start_date).getTime()) / (1000 * 60 * 60 * 24))
                    : 0} days
                </div>
              </Card>
              <Card className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Budget</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold">${selectedProject.budget?.toLocaleString() || 0}</div>
              </Card>
              <Card className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Tasks</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold">{tasks.length}</div>
              </Card>
              <Card className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Milestones</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold">{milestones.filter(m => m.completed).length}/{milestones.length}</div>
              </Card>
            </div>
            <MilestoneTracker projectId={selectedProject.id} milestones={milestones} onUpdate={fetchProjectDetails} />
          </TabsContent>


          <TabsContent value="tasks">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Tasks</h3>
                <Button size="sm" onClick={() => setShowTaskForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />Add Task
                </Button>
              </div>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{task.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {task.start_date && task.end_date && `${new Date(task.start_date).toLocaleDateString()} - ${new Date(task.end_date).toLocaleDateString()}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{task.status}</Badge>
                      <Badge variant="outline">{task.priority}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <GanttChart tasks={tasks.filter(t => t.start_date && t.end_date)} />
          </TabsContent>

          <TabsContent value="resources">
            <ResourceAllocation projectId={selectedProject.id} tasks={tasks} />
          </TabsContent>

          <TabsContent value="invoices">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Linked Invoices</h3>
              <div className="space-y-2">
                {invoices.map((invoice: any) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Invoice #{invoice.invoice_number}</div>
                      <div className="text-sm text-muted-foreground">{new Date(invoice.issue_date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${invoice.total_amount?.toLocaleString()}</div>
                      <Badge>{invoice.status}</Badge>
                    </div>
                  </div>
                ))}
                {invoices.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">No invoices linked</div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'New Project'}</DialogTitle>
          </DialogHeader>
          <ProjectForm
            project={editingProject}
            onSuccess={() => {
              setShowProjectForm(false);
              fetchProjects();
            }}
            onCancel={() => setShowProjectForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            projectId={selectedProject?.id}
            onSuccess={() => {
              setShowTaskForm(false);
              fetchProjectDetails();
            }}
            onCancel={() => setShowTaskForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
