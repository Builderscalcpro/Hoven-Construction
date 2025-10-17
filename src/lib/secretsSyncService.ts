import { supabase } from './supabase';

export interface SecretStatus {
  name: string;
  githubConfigured: boolean;
  supabaseConfigured: boolean;
  lastSynced?: string;
  status: 'synced' | 'missing' | 'partial';
}

export interface SyncHistory {
  id: string;
  syncType: 'scheduled' | 'manual' | 'webhook';
  platform: 'github' | 'supabase' | 'both';
  status: 'success' | 'failed' | 'partial';
  secretsSynced: string[];
  secretsMissing: string[];
  secretsFailed: string[];
  errorMessage?: string;
  triggeredBy?: string;
  createdAt: string;
}

export interface PlatformStatus {
  status: SecretStatus[];
  total: number;
  configured: number;
}


const REQUIRED_SECRETS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_STRIPE_PUBLISHABLE_KEY',
  'VITE_GOOGLE_MAPS_API_KEY',
  'VITE_GOOGLE_CALENDAR_CLIENT_ID',
  'VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID',
  'VITE_MICROSOFT_CLIENT_ID',
  'VITE_GA4_MEASUREMENT_ID',
  'VITE_GTM_ID',
  'VITE_FACEBOOK_PIXEL_ID',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'STRIPE_SECRET_KEY',
  'SENDGRID_API_KEY',
  'GITHUB_TOKEN'
];

export const checkGitHubSecrets = async (owner: string, repo: string): Promise<PlatformStatus> => {
  try {
    const { data, error } = await supabase.functions.invoke('check-github-secrets', {
      body: { owner, repo, requiredSecrets: REQUIRED_SECRETS }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error checking GitHub secrets:', error);
    throw error;
  }
};

export const checkSupabaseSecrets = async (): Promise<PlatformStatus> => {
  try {
    const { data, error } = await supabase.functions.invoke('check-supabase-secrets', {
      body: { requiredSecrets: REQUIRED_SECRETS }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error checking Supabase secrets:', error);
    throw error;
  }
};

export const getRequiredSecrets = () => REQUIRED_SECRETS;

export const triggerWebhookSync = async (platform: 'github' | 'supabase' | 'both' = 'both') => {
  try {
    const { data, error } = await supabase.functions.invoke('webhook-secrets-sync', {
      body: { platform, trigger: 'manual' }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error triggering webhook sync:', error);
    throw error;
  }
};

export const getSyncHistory = async (limit: number = 20): Promise<SyncHistory[]> => {
  try {
    const { data, error } = await supabase
      .from('secrets_sync_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return (data || []).map(record => ({
      id: record.id,
      syncType: record.sync_type,
      platform: record.platform,
      status: record.status,
      secretsSynced: record.secrets_synced || [],
      secretsMissing: record.secrets_missing || [],
      secretsFailed: record.secrets_failed || [],
      errorMessage: record.error_message,
      triggeredBy: record.triggered_by,
      createdAt: record.created_at
    }));
  } catch (error) {
    console.error('Error fetching sync history:', error);
    throw error;
  }
};

export const recordSyncOperation = async (
  syncType: 'scheduled' | 'manual' | 'webhook',
  platform: 'github' | 'supabase' | 'both',
  status: 'success' | 'failed' | 'partial',
  details: {
    secretsSynced?: string[];
    secretsMissing?: string[];
    secretsFailed?: string[];
    errorMessage?: string;
    triggeredBy?: string;
  }
) => {
  try {
    const { error } = await supabase
      .from('secrets_sync_history')
      .insert({
        sync_type: syncType,
        platform,
        status,
        secrets_synced: details.secretsSynced || [],
        secrets_missing: details.secretsMissing || [],
        secrets_failed: details.secretsFailed || [],
        error_message: details.errorMessage,
        triggered_by: details.triggeredBy
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error recording sync operation:', error);
  }
};
