import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface JobAssignment {
  id: string;
  title: string;
  description: string;
  scope_of_work: string;
  start_date: string;
  end_date: string;
  budget: number;
  status: string;
  priority: string;
  location: string;
  requirements: any[];
  deliverables: any[];
  project: any;
}

export default function JobAssignments({ contractorId }: { contractorId: string }) {
  const [jobs, setJobs] = useState<JobAssignment[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (contractorId) fetchJobs();
  }, [contractorId]);

  const fetchJobs = async () => {
    try {
      const { data } = await supabase
        .from('job_assignments')
        .select('*, project:projects(*)')
        .eq('contractor_id', contractorId)
        .order('created_at', { ascending: false });

      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (jobId: string, status: string) => {
    try {
      await supabase
        .from('job_assignments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', jobId);

      toast({
        title: 'Status Updated',
        description: `Job ${status === 'accepted' ? 'accepted' : 'declined'} successfully.`,
      });

      fetchJobs();
      setSelectedJob(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update job status.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div>Loading job assignments...</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Job Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {jobs.map((job) => (
              <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedJob(job)}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(job.priority)}>
                        {job.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{job.start_date ? format(new Date(job.start_date), 'MMM d') : 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{job.end_date ? format(new Date(job.end_date), 'MMM d') : 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span>${job.budget?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{job.location || 'Remote'}</span>
                    </div>
                  </div>

                  {job.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" onClick={(e) => {
                        e.stopPropagation();
                        updateJobStatus(job.id, 'accepted');
                      }}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => {
                        e.stopPropagation();
                        updateJobStatus(job.id, 'cancelled');
                      }}>
                        <XCircle className="h-4 w-4 mr-1" /> Decline
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {jobs.length === 0 && (
              <p className="text-center text-gray-500 py-8">No job assignments yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedJob?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Scope of Work</h4>
              <p className="text-sm text-gray-600">{selectedJob?.scope_of_work}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Requirements</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {selectedJob?.requirements?.map((req: string, i: number) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Deliverables</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {selectedJob?.deliverables?.map((del: string, i: number) => (
                  <li key={i}>{del}</li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}