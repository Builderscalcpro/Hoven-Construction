import { supabase } from './supabase';

export interface AppleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
  attendees?: string[];
}

export const appleCalendarService = {
  async saveCredentials(appleId: string, appPassword: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('apple_calendar_tokens')
      .upsert({
        user_id: user.id,
        apple_id: appleId,
        app_specific_password: appPassword,
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getCredentials() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('apple_calendar_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async syncEvents() {
    const { data, error } = await supabase.functions.invoke('apple-calendar-sync', {
      body: { action: 'sync' }
    });

    if (error) throw error;
    return data;
  },

  async disconnect() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('apple_calendar_tokens')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
  }
};
