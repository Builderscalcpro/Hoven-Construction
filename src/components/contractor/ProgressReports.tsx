import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { FileText, Plus, Camera, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ProgressReport {
  id: string;
  report_date: string;
  work_completed: string;
  percentage_complete: number;
  issues_encountered?: string;
  next_steps?: string;
  review_status: string;
  job_assignment: any;
}

export default function ProgressReports({ contractorId }: { contractorId: string }) {
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newReport, setNewReport] = useState({
    job_assignment_id: '',
    report_date: format(new Date(), 'yyyy-MM-dd'),
    work_completed: '',
    percentage_complete: 0,
    materials_used: [],
    issues_encountered: '',
    next_steps: '',
    weather_conditions: '',
    crew_size: 1,
    safety_incidents: [],
  });
  const { toast } = useToast();

  useEffect(() => {
    if (contractorId) {
      fetchReports();
      fetchJobs();
    }
  }, [contractorId]);

  const fetchReports = async () => {
    const { data } = await supabase
      .from('progress_reports')
      .select('*, job_assignment:job_assignments(*)')
      .eq('contractor_id', contractorId)
      .order('report_date', { ascending: false });

    setReports(data || []);
  };

  const fetchJobs = async () => {
    const { data } = await supabase
      .from('job_assignments')
      .select('*')
      .eq('contractor_id', contractorId)
      .eq('status', 'in_progress');

    setJobs(data || []);
  };

  const submitReport = async () => {
    if (!newReport.job_assignment_id || !newReport.work_completed) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await supabase.from('progress_reports').insert({
        ...newReport,
        contractor_id: contractorId,
        submitted_by: (await supabase.auth.getUser()).data.user?.id,
      });

      toast({
        title: 'Report Submitted',
        description: 'Your progress report has been submitted successfully.',
      });

      setNewReport({
        job_assignment_id: '',
        report_date: format(new Date(), 'yyyy-MM-dd'),
        work_completed: '',
        percentage_complete: 0,
        materials_used: [],
        issues_encountered: '',
        next_steps: '',
        weather_conditions: '',
        crew_size: 1,
        safety_incidents: [],
      });
      setShowForm(false);
      fetchReports();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit progress report.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      needs_revision: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Progress Reports</CardTitle>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" /> New Report
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6 p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Job Assignment</Label>
                  <Select value={newReport.job_assignment_id}
                    onValueChange={(value) => setNewReport({ ...newReport, job_assignment_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Report Date</Label>
                  <Input type="date" value={newReport.report_date}
                    onChange={(e) => setNewReport({ ...newReport, report_date: e.target.value })} />
                </div>
              </div>

              <div>
                <Label>Work Completed</Label>
                <Textarea value={newReport.work_completed}
                  onChange={(e) => setNewReport({ ...newReport, work_completed: e.target.value })}
                  placeholder="Describe the work completed today..."
                  rows={3} />
              </div>

              <div>
                <Label>Percentage Complete: {newReport.percentage_complete}%</Label>
                <Slider
                  value={[newReport.percentage_complete]}
                  onValueChange={(value) => setNewReport({ ...newReport, percentage_complete: value[0] })}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Weather Conditions</Label>
                  <Input value={newReport.weather_conditions}
                    onChange={(e) => setNewReport({ ...newReport, weather_conditions: e.target.value })}
                    placeholder="e.g., Sunny, 75°F" />
                </div>

                <div>
                  <Label>Crew Size</Label>
                  <Input type="number" value={newReport.crew_size}
                    onChange={(e) => setNewReport({ ...newReport, crew_size: parseInt(e.target.value) })} />
                </div>
              </div>

              <div>
                <Label>Issues Encountered (Optional)</Label>
                <Textarea value={newReport.issues_encountered}
                  onChange={(e) => setNewReport({ ...newReport, issues_encountered: e.target.value })}
                  placeholder="Describe any issues or challenges..."
                  rows={2} />
              </div>

              <div>
                <Label>Next Steps</Label>
                <Textarea value={newReport.next_steps}
                  onChange={(e) => setNewReport({ ...newReport, next_steps: e.target.value })}
                  placeholder="What will be done next..."
                  rows={2} />
              </div>

              <div className="flex gap-2">
                <Button onClick={submitReport}>Submit Report</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{report.job_assignment?.title}</h4>
                    <p className="text-sm text-gray-600">
                      {format(new Date(report.report_date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(report.review_status)}>
                    {report.review_status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">Progress:</span>
                    <span className="text-sm">{report.percentage_complete}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${report.percentage_complete}%` }} />
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-2">{report.work_completed}</p>

                {report.issues_encountered && (
                  <div className="flex items-start gap-2 mt-2 p-2 bg-yellow-50 rounded">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-800">{report.issues_encountered}</p>
                  </div>
                )}

                {report.next_steps && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Next Steps:</p>
                    <p className="text-sm text-gray-600">{report.next_steps}</p>
                  </div>
                )}
              </div>
            ))}

            {reports.length === 0 && !showForm && (
              <p className="text-center text-gray-500 py-8">No progress reports submitted yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}