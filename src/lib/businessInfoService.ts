import { supabase } from './supabase';

export interface BusinessInfo {
  id?: string;
  user_id?: string;
  location_id: string;
  business_name: string;
  address: string;
  phone: string;
  website: string;
  business_hours: any;
  categories: string[];
  description: string;
  last_synced_at?: string;
}

export const businessInfoService = {
  async syncFromGoogle(accessToken: string, locationName: string): Promise<BusinessInfo> {
    const { data, error } = await supabase.functions.invoke('sync-business-info', {
      body: { accessToken, locationName },
    });

    if (error) throw error;
    return data;
  },

  async saveBusinessInfo(businessInfo: BusinessInfo): Promise<void> {
    const { error } = await supabase
      .from('business_info')
      .upsert({
        ...businessInfo,
        last_synced_at: new Date().toISOString(),
      });

    if (error) throw error;
  },

  async getBusinessInfo(userId: string): Promise<BusinessInfo[]> {
    const { data, error } = await supabase
      .from('business_info')
      .select('*')
      .eq('user_id', userId)
      .order('last_synced_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async deleteBusinessInfo(id: string): Promise<void> {
    const { error } = await supabase
      .from('business_info')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
