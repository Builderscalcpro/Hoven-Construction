import { supabase } from './supabase';

export interface UnifiedCalendarEvent {
  id: string;
  summary: string;
  start_time: string;
  end_time: string;
  provider: 'google' | 'outlook' | 'apple';
  calendar_id: string;
  calendar_name: string;
  description?: string;
  location?: string;
  is_all_day?: boolean;
}

export interface CalendarSource {
  id: string;
  name: string;
  provider: 'google' | 'outlook' | 'apple';
  color: string;
  enabled: boolean;
}

const PROVIDER_COLORS = {
  google: '#4285F4',
  outlook: '#0078D4',
  apple: '#000000',
};

export const unifiedCalendarService = {
  async getAllEvents(userId: string, startDate: Date, endDate: Date): Promise<UnifiedCalendarEvent[]> {
    const { data, error } = await supabase.functions.invoke('unified-calendar-events', {
      body: {
        userId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });

    if (error) throw error;
    return data.events || [];
  },

  async getCalendarSources(userId: string): Promise<CalendarSource[]> {
    const sources: CalendarSource[] = [];

    const { data: google } = await supabase
      .from('google_calendar_tokens')
      .select('*')
      .eq('user_id', userId);

    const { data: outlook } = await supabase
      .from('outlook_calendar_tokens')
      .select('*')
      .eq('user_id', userId);

    const { data: apple } = await supabase
      .from('apple_calendar_tokens')
      .select('*')
      .eq('user_id', userId);

    if (google) {
      sources.push(...google.map(cal => ({
        id: cal.calendar_id,
        name: cal.calendar_name || 'Google Calendar',
        provider: 'google' as const,
        color: PROVIDER_COLORS.google,
        enabled: cal.sync_enabled,
      })));
    }

    if (outlook) {
      sources.push(...outlook.map(cal => ({
        id: cal.calendar_id,
        name: cal.calendar_name || 'Outlook Calendar',
        provider: 'outlook' as const,
        color: PROVIDER_COLORS.outlook,
        enabled: cal.sync_enabled,
      })));
    }

    if (apple) {
      sources.push(...apple.map(cal => ({
        id: cal.calendar_id,
        name: cal.calendar_name || 'Apple Calendar',
        provider: 'apple' as const,
        color: PROVIDER_COLORS.apple,
        enabled: cal.sync_enabled,
      })));
    }

    return sources;
  },

  async updateEvent(
    provider: string,
    calendarId: string,
    eventId: string,
    updates: { start_time: string; end_time: string }
  ) {
    const functionMap = {
      google: 'google-calendar-create-event',
      outlook: 'outlook-calendar-events',
    };

    const { data, error } = await supabase.functions.invoke(
      functionMap[provider as keyof typeof functionMap],
      {
        body: {
          action: 'update',
          calendarId,
          eventId,
          event: updates,
        },
      }
    );

    if (error) throw error;
    return data;
  },

  async getAvailableSlots(date: Date) {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({
        time,
        available: true,
        date: date.toISOString().split('T')[0]
      });
    }
    
    return slots;
  },
};

