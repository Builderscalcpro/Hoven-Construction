import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar, ChevronLeft, ChevronRight, Grid3x3, List, CalendarDays } from 'lucide-react';
import { unifiedCalendarService, UnifiedCalendarEvent, CalendarSource } from '@/lib/unifiedCalendarService';
import { toast } from 'sonner';

interface UnifiedCalendarViewProps {
  userId: string;
}

type ViewMode = 'day' | 'week' | 'month';

export default function UnifiedCalendarView({ userId }: UnifiedCalendarViewProps) {
  const [events, setEvents] = useState<UnifiedCalendarEvent[]>([]);
  const [sources, setSources] = useState<CalendarSource[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [draggedEvent, setDraggedEvent] = useState<UnifiedCalendarEvent | null>(null);

  useEffect(() => {
    loadData();
  }, [userId, currentDate, viewMode]);

  const loadData = async () => {
    try {
      const [eventsData, sourcesData] = await Promise.all([
        unifiedCalendarService.getAllEvents(userId, getStartDate(), getEndDate()),
        unifiedCalendarService.getCalendarSources(userId),
      ]);
      setEvents(eventsData);
      setSources(sourcesData);
    } catch (error: any) {
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = () => {
    const date = new Date(currentDate);
    if (viewMode === 'month') {
      date.setDate(1);
    } else if (viewMode === 'week') {
      date.setDate(date.getDate() - date.getDay());
    }
    return date;
  };

  const getEndDate = () => {
    const date = new Date(getStartDate());
    if (viewMode === 'day') {
      date.setDate(date.getDate() + 1);
    } else if (viewMode === 'week') {
      date.setDate(date.getDate() + 7);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    return date;
  };

  const toggleSource = (sourceId: string) => {
    setSources(sources.map(s => s.id === sourceId ? { ...s, enabled: !s.enabled } : s));
  };

  const filteredEvents = events.filter(e => 
    sources.find(s => s.id === e.calendar_id && s.enabled)
  );

  const handleDragStart = (event: UnifiedCalendarEvent) => {
    setDraggedEvent(event);
  };

  const handleDrop = async (newStartTime: Date) => {
    if (!draggedEvent) return;
    
    const duration = new Date(draggedEvent.end_time).getTime() - new Date(draggedEvent.start_time).getTime();
    const newEndTime = new Date(newStartTime.getTime() + duration);

    try {
      await unifiedCalendarService.updateEvent(
        draggedEvent.provider,
        draggedEvent.calendar_id,
        draggedEvent.id,
        { start_time: newStartTime.toISOString(), end_time: newEndTime.toISOString() }
      );
      toast.success('Event rescheduled');
      loadData();
    } catch (error) {
      toast.error('Failed to reschedule event');
    }
    setDraggedEvent(null);
  };

  if (loading) {
    return <div className="animate-pulse">Loading calendar...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button size="sm" variant={viewMode === 'day' ? 'default' : 'outline'} onClick={() => setViewMode('day')}>
            <List className="w-4 h-4 mr-2" />Day
          </Button>
          <Button size="sm" variant={viewMode === 'week' ? 'default' : 'outline'} onClick={() => setViewMode('week')}>
            <CalendarDays className="w-4 h-4 mr-2" />Week
          </Button>
          <Button size="sm" variant={viewMode === 'month' ? 'default' : 'outline'} onClick={() => setViewMode('month')}>
            <Grid3x3 className="w-4 h-4 mr-2" />Month
          </Button>
        </div>
        
        <div className="flex gap-2 items-center">
          <Button size="sm" variant="outline" onClick={() => {
            const date = new Date(currentDate);
            viewMode === 'month' ? date.setMonth(date.getMonth() - 1) : date.setDate(date.getDate() - (viewMode === 'week' ? 7 : 1));
            setCurrentDate(date);
          }}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-semibold">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          <Button size="sm" variant="outline" onClick={() => {
            const date = new Date(currentDate);
            viewMode === 'month' ? date.setMonth(date.getMonth() + 1) : date.setDate(date.getDate() + (viewMode === 'week' ? 7 : 1));
            setCurrentDate(date);
          }}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Calendar Sources
        </h3>
        <div className="flex flex-wrap gap-4">
          {sources.map(source => (
            <div key={source.id} className="flex items-center gap-2">
              <Checkbox checked={source.enabled} onCheckedChange={() => toggleSource(source.id)} id={source.id} />
              <Label htmlFor={source.id} className="flex items-center gap-2 cursor-pointer">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                {source.name}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-2">
          {filteredEvents.map(event => {
            const source = sources.find(s => s.id === event.calendar_id);
            return (
              <div
                key={`${event.provider}-${event.id}`}
                draggable
                onDragStart={() => handleDragStart(event)}
                className="p-3 rounded-lg border-l-4 cursor-move hover:shadow-md transition-shadow"
                style={{ borderLeftColor: source?.color }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{event.summary}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleTimeString()}
                    </p>
                    {event.location && <p className="text-sm text-muted-foreground">{event.location}</p>}
                  </div>
                  <Badge variant="outline">{event.provider}</Badge>
                </div>
              </div>
            );
          })}
          {filteredEvents.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No events found</p>
          )}
        </div>
      </Card>
    </div>
  );
}
