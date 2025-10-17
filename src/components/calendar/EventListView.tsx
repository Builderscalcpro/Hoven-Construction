import { Calendar, Clock, MapPin, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarEvent } from '@/lib/multiCalendarService';

interface EventListViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const PROVIDER_COLORS = {
  google: 'bg-blue-100 text-blue-800',
  outlook: 'bg-purple-100 text-purple-800',
  apple: 'bg-gray-100 text-gray-800',
  caldav: 'bg-green-100 text-green-800'
};

export default function EventListView({ events, onEventClick }: EventListViewProps) {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No events scheduled</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sortedEvents.map(event => (
        <Card 
          key={event.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onEventClick(event)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{event.summary}</h3>
                  <Badge className={PROVIDER_COLORS[event.provider as keyof typeof PROVIDER_COLORS]}>
                    {event.provider}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.start_time)}
                  </div>
                  
                  {!event.is_all_day && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(event.start_time)} - {formatTime(event.end_time)}
                    </div>
                  )}
                  
                  {event.is_all_day && (
                    <Badge variant="outline">All Day</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
