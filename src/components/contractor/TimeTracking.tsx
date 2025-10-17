import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, Calendar as CalendarIcon, Play, Pause, Save } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface TimeEntry {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  hours_worked: number;
  break_duration: number;
  description: string;
  status: string;
  job_assignment: any;
}

export default function TimeTracking({ contractorId }: { contractorId: string }) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({
    job_assignment_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '',
    end_time: '',
    hours_worked: 0,
    break_duration: 0,
    description: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (contractorId) {
      fetchTimeEntries();
      fetchJobs();
    }
  }, [contractorId, selectedDate]);

  const fetchTimeEntries = async () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const { data } = await supabase
      .from('time_entries')
      .select('*, job_assignment:job_assignments(*)')
      .eq('contractor_id', contractorId)
      .gte('date', format(startOfWeek, 'yyyy-MM-dd'))
      .lte('date', format(endOfWeek, 'yyyy-MM-dd'))
      .order('date', { ascending: false });

    setTimeEntries(data || []);
  };

  const fetchJobs = async () => {
    const { data } = await supabase
      .from('job_assignments')
      .select('*')
      .eq('contractor_id', contractorId)
      .in('status', ['accepted', 'in_progress']);

    setJobs(data || []);
  };

  const startTracking = () => {
    setIsTracking(true);
    setCurrentEntry({
      ...currentEntry,
      start_time: format(new Date(), 'HH:mm'),
    });
  };

  const stopTracking = () => {
    setIsTracking(false);
    const endTime = format(new Date(), 'HH:mm');
    const start = new Date(`2000-01-01 ${currentEntry.start_time}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60) - currentEntry.break_duration;
    
    setCurrentEntry({
      ...currentEntry,
      end_time: endTime,
      hours_worked: Math.round(hours * 100) / 100,
    });
  };

  const saveTimeEntry = async () => {
    if (!currentEntry.job_assignment_id || !currentEntry.hours_worked) {
      toast({
        title: 'Error',
        description: 'Please select a job and enter hours worked.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await supabase.from('time_entries').insert({
        ...currentEntry,
        contractor_id: contractorId,
      });

      toast({
        title: 'Time Entry Saved',
        description: 'Your time has been logged successfully.',
      });

      setCurrentEntry({
        job_assignment_id: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        start_time: '',
        end_time: '',
        hours_worked: 0,
        break_duration: 0,
        description: '',
      });
      fetchTimeEntries();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save time entry.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      disputed: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Track Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Job Assignment</Label>
                <Select value={currentEntry.job_assignment_id}
                  onValueChange={(value) => setCurrentEntry({ ...currentEntry, job_assignment_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job" />
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
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(new Date(currentEntry.date), 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(currentEntry.date)}
                      onSelect={(date) => date && setCurrentEntry({ 
                        ...currentEntry, 
                        date: format(date, 'yyyy-MM-dd') 
                      })}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input type="time" value={currentEntry.start_time}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, start_time: e.target.value })} />
              </div>
              <div>
                <Label>End Time</Label>
                <Input type="time" value={currentEntry.end_time}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, end_time: e.target.value })} />
              </div>
              <div>
                <Label>Hours Worked</Label>
                <Input type="number" step="0.25" value={currentEntry.hours_worked}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, hours_worked: parseFloat(e.target.value) })} />
              </div>
              <div>
                <Label>Break (hours)</Label>
                <Input type="number" step="0.25" value={currentEntry.break_duration}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, break_duration: parseFloat(e.target.value) })} />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea value={currentEntry.description}
                onChange={(e) => setCurrentEntry({ ...currentEntry, description: e.target.value })}
                placeholder="Describe the work performed..." />
            </div>

            <div className="flex gap-2">
              {!isTracking ? (
                <Button onClick={startTracking}>
                  <Play className="h-4 w-4 mr-2" /> Start Timer
                </Button>
              ) : (
                <Button onClick={stopTracking} variant="destructive">
                  <Pause className="h-4 w-4 mr-2" /> Stop Timer
                </Button>
              )}
              <Button onClick={saveTimeEntry}>
                <Save className="h-4 w-4 mr-2" /> Save Entry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Time Entries This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {timeEntries.map((entry) => (
              <div key={entry.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{entry.job_assignment?.title}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(entry.date), 'MMM d')} • {entry.hours_worked} hours
                  </p>
                  {entry.description && (
                    <p className="text-sm text-gray-500 mt-1">{entry.description}</p>
                  )}
                </div>
                <Badge className={getStatusColor(entry.status)}>
                  {entry.status}
                </Badge>
              </div>
            ))}

            {timeEntries.length === 0 && (
              <p className="text-center text-gray-500 py-4">No time entries this week.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}