import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, MapPin, Users, Plus, X } from 'lucide-react';
import { format, parse } from 'date-fns';
import { CalendarEvent } from '@/lib/multiCalendarService';

interface EventEditFormProps {
  event: CalendarEvent & { description?: string; location?: string; attendees?: string[] };
  onSubmit: (eventData: any) => Promise<void>;
  onCancel: () => void;
}

export function EventEditForm({ event, onSubmit, onCancel }: EventEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [attendees, setAttendees] = useState<string[]>(['']);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    if (event) {
      const start = new Date(event.start_time);
      const end = new Date(event.end_time);
      
      setStartDate(start);
      setEndDate(end);
      setFormData({
        title: event.summary || '',
        description: event.description || '',
        location: event.location || '',
        startTime: format(start, 'HH:mm'),
        endTime: format(end, 'HH:mm')
      });
      setAttendees(event.attendees && event.attendees.length > 0 ? event.attendees : ['']);
    }
  }, [event]);

  const handleAddAttendee = () => setAttendees([...attendees, '']);
  const handleRemoveAttendee = (index: number) => {
    setAttendees(attendees.filter((_, i) => i !== index));
  };
  const handleAttendeeChange = (index: number, value: string) => {
    const updated = [...attendees];
    updated[index] = value;
    setAttendees(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const eventData = {
        ...formData,
        startDateTime: `${format(startDate, 'yyyy-MM-dd')}T${formData.startTime}`,
        endDateTime: `${format(endDate, 'yyyy-MM-dd')}T${formData.endTime}`,
        attendees: attendees.filter(email => email.trim())
      };
      await onSubmit(eventData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title *</Label>
        <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{startDate ? format(startDate, 'PPP') : 'Pick date'}</Button>
            </PopoverTrigger>
            <PopoverContent><Calendar mode="single" selected={startDate} onSelect={setStartDate} /></PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="startTime">Start Time *</Label>
          <div className="relative"><Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input id="startTime" type="time" className="pl-10" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} required /></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>End Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{endDate ? format(endDate, 'PPP') : 'Pick date'}</Button>
            </PopoverTrigger>
            <PopoverContent><Calendar mode="single" selected={endDate} onSelect={setEndDate} /></PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="endTime">End Time *</Label>
          <div className="relative"><Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input id="endTime" type="time" className="pl-10" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} required /></div>
        </div>
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <div className="relative"><MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input id="location" className="pl-10" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Add location" /></div>
      </div>
      <div>
        <Label className="flex items-center gap-2"><Users className="h-4 w-4" />Attendees</Label>
        {attendees.map((email, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Input value={email} onChange={(e) => handleAttendeeChange(index, e.target.value)} placeholder="email@example.com" type="email" />
            {attendees.length > 1 && <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveAttendee(index)}><X className="h-4 w-4" /></Button>}
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={handleAddAttendee} className="mt-2"><Plus className="h-4 w-4 mr-2" />Add Attendee</Button>
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">{loading ? 'Updating...' : 'Update Event'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
