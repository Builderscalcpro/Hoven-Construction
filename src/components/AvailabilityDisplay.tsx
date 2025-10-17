import { useState, useEffect } from 'react';
import { Clock, Loader2 } from 'lucide-react';
import { googleCalendarService } from '@/lib/googleCalendarService';
import { multiCalendarService } from '@/lib/multiCalendarService';
import { useAuth } from '@/contexts/AuthContext';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Props {
  selectedDate: string;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

export default function AvailabilityDisplay({ selectedDate, selectedTime, onTimeSelect }: Props) {
  const { user } = useAuth();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [useRealTime, setUseRealTime] = useState(false);
  const [calendarCount, setCalendarCount] = useState(0);

  // Default time slots
  const defaultTimeSlots: TimeSlot[] = [
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '01:00 PM', available: true },
    { time: '02:00 PM', available: true },
    { time: '03:00 PM', available: true },
    { time: '04:00 PM', available: true }
  ];

  useEffect(() => {
    if (selectedDate) {
      // If user is authenticated, try to fetch real availability
      if (user) {
        fetchAvailability();
      } else {
        // For non-authenticated users, use default slots immediately
        setTimeSlots(defaultTimeSlots);
        setUseRealTime(false);
        setLoading(false);
      }
    }
  }, [selectedDate, user]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      // Get all calendar connections
      const connections = await multiCalendarService.getCalendarConnections(user!.id);
      const activeConnections = connections.filter(c => c.is_active && c.sync_enabled);
      setCalendarCount(activeConnections.length);

      if (activeConnections.length === 0) {
        throw new Error('No active calendars');
      }

      // Generate time slots for the day
      const slots: TimeSlot[] = [];
      const times = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];
      
      for (const time of times) {
        const [timeStr, period] = time.split(' ');
        const [hours, minutes] = timeStr.split(':');
        let hour24 = parseInt(hours);
        if (period === 'PM' && hour24 !== 12) hour24 += 12;
        if (period === 'AM' && hour24 === 12) hour24 = 0;
        
        const startTime = new Date(`${selectedDate}T${hour24.toString().padStart(2, '0')}:${minutes}:00`);
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1);
        
        // Check if time slot is available across all calendars
        const available = await multiCalendarService.isTimeSlotAvailable(user!.id, startTime, endTime);
        slots.push({ time, available });
      }

      setTimeSlots(slots);
      setUseRealTime(true);
    } catch (error) {
      // Using default availability - calendar not connected
      // Fallback to default slots if calendar not connected
      setTimeSlots(defaultTimeSlots);
      setUseRealTime(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        <span className="ml-2 text-gray-600">Checking availability...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">Select Time *</label>
        {useRealTime && (
          <span className="text-xs text-green-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            Checking {calendarCount} calendar{calendarCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {timeSlots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            onClick={() => onTimeSelect(slot.time)}
            className={`p-3 border-2 rounded-lg text-sm font-medium transition ${
              selectedTime === slot.time
                ? 'border-amber-500 bg-amber-50 text-amber-700'
                : slot.available
                ? 'border-gray-200 hover:border-amber-300'
                : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Clock className="w-4 h-4 mx-auto mb-1" />
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
}
