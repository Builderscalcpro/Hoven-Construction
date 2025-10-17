import { supabase } from './supabase';

export interface OutlookTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export const outlookCalendarService = {
  async getAuthUrl(userId: string): Promise<string> {
    const redirectUri = `${window.location.origin}/calendar`;
    
    const { data, error } = await supabase.functions.invoke('outlook-calendar-auth', {
      body: { action: 'getAuthUrl', userId, redirectUri }
    });

    if (error) throw error;
    return data.authUrl;
  },

  async exchangeCodeForTokens(code: string, userId: string): Promise<OutlookTokens> {
    const redirectUri = `${window.location.origin}/calendar`;
    
    const { data, error } = await supabase.functions.invoke('outlook-calendar-auth', {
      body: { action: 'exchangeCode', code, redirectUri, userId }
    });

    if (error) throw error;
    return data;
  },

  async saveTokens(userId: string, tokens: OutlookTokens) {
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + tokens.expires_in);

    const { error } = await supabase
      .from('outlook_calendar_tokens')
      .upsert({
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: expiryDate.toISOString()
      });

    if (error) throw error;
  },

  async getStoredTokens(userId: string) {
    const { data, error } = await supabase
      .from('outlook_calendar_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single();

    if (error) throw error;
    return data;
  },

  async getAllCalendars(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('outlook_calendar_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('sync_enabled', true);

    return data || [];
  },


  async refreshAccessToken(userId: string): Promise<string> {
    const tokens = await this.getStoredTokens(userId);
    
    const { data, error } = await supabase.functions.invoke('outlook-calendar-auth', {
      body: { action: 'refreshToken', refreshToken: tokens.refresh_token }
    });

    if (error) throw error;

    await this.saveTokens(userId, data);
    return data.access_token;
  },

  async getValidAccessToken(userId: string): Promise<string> {
    const tokens = await this.getStoredTokens(userId);
    const expiry = new Date(tokens.token_expiry);
    
    if (expiry <= new Date()) {
      return await this.refreshAccessToken(userId);
    }
    
    return tokens.access_token;
  },

  async getEvents(userId: string, startDate: Date, endDate: Date) {
    const accessToken = await this.getValidAccessToken(userId);
    
    const { data, error } = await supabase.functions.invoke('outlook-calendar-events', {
      body: {
        action: 'getEvents',
        accessToken,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });

    if (error) throw error;
    return data.value || [];
  },

  async createEvent(userId: string, eventData: any) {
    const accessToken = await this.getValidAccessToken(userId);
    
    const { data, error } = await supabase.functions.invoke('outlook-calendar-events', {
      body: { action: 'createEvent', accessToken, eventData }
    });

    if (error) throw error;
    return data;
  },

  async syncEvents(): Promise<{ eventsSynced: number }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const accessToken = await this.getValidAccessToken(user.id);
    
    const { data, error } = await supabase.functions.invoke('sync-outlook-calendar', {
      body: { accessToken }
    });

    if (error) throw error;
    return data;
  },

  async disconnect(userId: string) {
    const { error } = await supabase
      .from('outlook_calendar_tokens')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }
};
