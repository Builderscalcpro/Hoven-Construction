import { supabase } from './supabase';

export interface CalendarConnection {
  id: string;
  provider: 'google' | 'outlook' | 'apple' | 'caldav';
  provider_account_id: string;
  calendar_name: string;
  is_primary: boolean;
  is_active: boolean;
  sync_enabled: boolean;
  webhook_expiration?: string;
  last_sync_at?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  provider: string;
  accountId?: string;
}

export const multiCalendarService = {
  // Get aggregated availability across ALL accounts with sync enabled
  async getAggregatedAvailability(userId: string, startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    const allEvents: CalendarEvent[] = [];

    const { data: googleCals } = await supabase.from('google_calendar_tokens').select('*').eq('user_id', userId).eq('sync_enabled', true);
    const { data: outlookCals } = await supabase.from('outlook_calendar_tokens').select('*').eq('user_id', userId).eq('sync_enabled', true);
    const { data: appleCals } = await supabase.from('apple_calendar_tokens').select('*').eq('user_id', userId).eq('sync_enabled', true);

    // In production, call calendar APIs for each account and aggregate events
    return allEvents;
  },

  // Create event in specific account
  async createEventInAccount(accountId: string, provider: string, userId: string, eventData: {
    title: string;
    description?: string;
    startDateTime: string;
    endDateTime: string;
    location?: string;
    attendees?: string[];
  }) {
    const functionMap = {
      google: 'google-calendar-create-event',
      outlook: 'outlook-calendar-events',
      apple: 'apple-calendar-sync'
    };

    const { data, error } = await supabase.functions.invoke(functionMap[provider as keyof typeof functionMap], {
      body: {
        accountId,
        userId,
        action: 'create',
        event: provider === 'google' ? {
          summary: eventData.title,
          description: eventData.description,
          start: { dateTime: eventData.startDateTime },
          end: { dateTime: eventData.endDateTime },
          location: eventData.location,
          attendees: eventData.attendees?.map(email => ({ email }))
        } : provider === 'outlook' ? {
          subject: eventData.title,
          body: { contentType: 'Text', content: eventData.description || '' },
          start: { dateTime: eventData.startDateTime, timeZone: 'UTC' },
          end: { dateTime: eventData.endDateTime, timeZone: 'UTC' },
          location: { displayName: eventData.location || '' }
        } : {
          summary: eventData.title,
          description: eventData.description,
          dtstart: eventData.startDateTime,
          dtend: eventData.endDateTime,
          location: eventData.location
        }
      }
    });

    if (error) throw error;
    return data;
  },

  // Get all accounts for user
  async getAllAccounts(userId: string) {
    const accounts = [];
    const { data: google } = await supabase.from('google_calendar_tokens').select('*').eq('user_id', userId);
    const { data: outlook } = await supabase.from('outlook_calendar_tokens').select('*').eq('user_id', userId);
    const { data: apple } = await supabase.from('apple_calendar_tokens').select('*').eq('user_id', userId);
    
    if (google) accounts.push(...google.map(a => ({ ...a, provider: 'google' })));
    if (outlook) accounts.push(...outlook.map(a => ({ ...a, provider: 'outlook' })));
    if (apple) accounts.push(...apple.map(a => ({ ...a, provider: 'apple' })));
    
    return accounts;
  }
};
