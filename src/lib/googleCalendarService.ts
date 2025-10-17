import { supabase } from './supabase';

export interface CalendarTokens {
  access_token: string;
  refresh_token: string;
  token_expiry: string;
  calendar_id?: string;
}

export const googleCalendarService = {
  async getAuthUrl(): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
        body: { action: 'getAuthUrl' }
      });
      
      if (error) {
        console.error('Error getting auth URL:', error);
        throw new Error(error.message || 'Failed to get authorization URL');
      }
      
      if (!data || !data.authUrl) {
        throw new Error('No authorization URL returned');
      }
      
      return data.authUrl;
    } catch (error) {
      console.error('Exception in getAuthUrl:', error);
      throw error;
    }
  },

  async exchangeCode(code: string): Promise<CalendarTokens> {

    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'exchangeCode', code }
    });
    if (error) throw error;
    
    const expiry = new Date();
    expiry.setSeconds(expiry.getSeconds() + data.expires_in);
    
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_expiry: expiry.toISOString()
    };
  },

  async saveTokens(tokens: CalendarTokens): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('google_calendar_tokens')
      .upsert({
        user_id: user.id,
        ...tokens
      });
    
    if (error) throw error;
  },

  async getStoredTokens(userId: string) {
    const { data, error } = await supabase
      .from('google_calendar_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single();

    if (error) throw error;
    return data;
  },


  async getTokens(): Promise<CalendarTokens | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('google_calendar_tokens')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .single();

    if (error || !data) return null;

    // Check if token is expired
    if (new Date(data.token_expiry) <= new Date()) {
      return await this.refreshTokens(data.refresh_token);
    }

    return data;
  },

  async getAllCalendars(): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('google_calendar_tokens')
      .select('*')
      .eq('user_id', user.id)
      .eq('sync_enabled', true);

    return data || [];
  },


  async refreshTokens(refreshToken: string): Promise<CalendarTokens> {
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'refreshToken', refreshToken }
    });
    if (error) throw error;

    const expiry = new Date();
    expiry.setSeconds(expiry.getSeconds() + data.expires_in);

    const tokens = {
      access_token: data.access_token,
      refresh_token: refreshToken,
      token_expiry: expiry.toISOString()
    };

    await this.saveTokens(tokens);
    return tokens;
  },

  async getAvailability(date: string): Promise<any[]> {
    const tokens = await this.getTokens();
    if (!tokens) throw new Error('Not connected to Google Calendar');

    const { data, error } = await supabase.functions.invoke('google-calendar-availability', {
      body: {
        accessToken: tokens.access_token,
        date,
        calendarId: tokens.calendar_id || 'primary'
      }
    });

    if (error) throw error;
    return data.availability;
  },

  async createEvent(eventDetails: any): Promise<{ eventId: string; meetLink: string }> {
    const tokens = await this.getTokens();
    if (!tokens) throw new Error('Not connected to Google Calendar');

    const { data, error } = await supabase.functions.invoke('google-calendar-create-event', {
      body: {
        accessToken: tokens.access_token,
        calendarId: tokens.calendar_id || 'primary',
        event: eventDetails
      }
    });

    if (error) throw error;
    return data;
  },

  async syncEvents(): Promise<{ eventsSynced: number }> {
    const tokens = await this.getTokens();
    if (!tokens) throw new Error('Not connected to Google Calendar');

    const { data, error } = await supabase.functions.invoke('sync-google-calendar', {
      body: {
        accessToken: tokens.access_token,
        calendarId: tokens.calendar_id || 'primary'
      }
    });

    if (error) throw error;
    return data;
  },



  async subscribeToWebhook(calendarId: string = 'primary'): Promise<{ channelId: string; expiration: string }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('google-calendar-subscribe-webhook', {
      body: {
        userId: user.id,
        calendarId,
        action: 'subscribe'
      }
    });

    if (error) throw error;
    return data;
  },

  async unsubscribeFromWebhook(calendarId: string = 'primary'): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.functions.invoke('google-calendar-subscribe-webhook', {
      body: {
        userId: user.id,
        calendarId,
        action: 'unsubscribe'
      }
    });

    if (error) throw error;
  },

  async getWebhookStatus(): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('google_calendar_webhooks')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !data) return null;
    return data;
  }
};

