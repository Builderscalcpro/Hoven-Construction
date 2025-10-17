import { supabase } from '@/lib/supabase';

interface TokenInfo {
  id: string;
  user_id: string;
  account_id: string;
  account_name?: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  scope?: string;
  token_type?: string;
  last_refreshed_at?: string;
  refresh_count?: number;
  is_active?: boolean;
}

class GoogleBusinessTokenService {
  private refreshInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes
  private readonly REFRESH_THRESHOLD = 10 * 60 * 1000; // Refresh 10 minutes before expiry

  // Start monitoring tokens for automatic refresh
  startTokenMonitoring() {
    if (this.refreshInterval) {
      return; // Already monitoring
    }

    // Initial check
    this.checkAndRefreshTokens();

    // Set up periodic checks
    this.refreshInterval = setInterval(() => {
      this.checkAndRefreshTokens();
    }, this.CHECK_INTERVAL);

    console.log('Google Business token monitoring started');
  }

  // Stop monitoring tokens
  stopTokenMonitoring() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('Google Business token monitoring stopped');
    }
  }

  // Check all tokens and refresh those about to expire
  async checkAndRefreshTokens() {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;

      // Get all active tokens for the current user
      const { data: tokens, error } = await supabase
        .from('google_business_tokens')
        .select('*')
        .eq('user_id', session.session.user.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching tokens:', error);
        return;
      }

      if (!tokens || tokens.length === 0) return;

      // Check each token
      for (const token of tokens) {
        await this.checkAndRefreshToken(token);
      }
    } catch (error) {
      console.error('Error in token refresh check:', error);
    }
  }

  // Check and refresh a single token if needed
  async checkAndRefreshToken(token: TokenInfo): Promise<boolean> {
    try {
      const expiresAt = new Date(token.expires_at);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();

      // Check if token needs refresh
      if (timeUntilExpiry <= this.REFRESH_THRESHOLD) {
        console.log(`Token for account ${token.account_id} expiring soon, refreshing...`);
        return await this.refreshToken(token);
      }

      return true; // Token still valid
    } catch (error) {
      console.error('Error checking token:', error);
      return false;
    }
  }

  // Refresh a specific token
  async refreshToken(token: TokenInfo): Promise<boolean> {
    try {
      // Call the edge function to refresh the token
      const { data, error } = await supabase.functions.invoke('google-business-token-refresh', {
        body: {
          refreshToken: token.refresh_token,
          forceRefresh: false
        }
      });

      if (error || !data?.success) {
        console.error('Token refresh failed:', error || data?.error);
        
        // Mark token as inactive if refresh fails
        await supabase
          .from('google_business_tokens')
          .update({ is_active: false })
          .eq('id', token.id);
        
        return false;
      }

      // Update the token in the database
      const { error: updateError } = await supabase
        .from('google_business_tokens')
        .update({
          access_token: data.accessToken,
          refresh_token: data.refreshToken || token.refresh_token,
          expires_at: data.expiresAt,
          last_refreshed_at: new Date().toISOString(),
          refresh_count: (token.refresh_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', token.id);

      if (updateError) {
        console.error('Error updating token:', updateError);
        return false;
      }

      console.log(`Token refreshed successfully for account ${token.account_id}`);
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  // Manually refresh a token for a specific account
  async manualRefresh(accountId: string): Promise<boolean> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return false;

      const { data: token, error } = await supabase
        .from('google_business_tokens')
        .select('*')
        .eq('user_id', session.session.user.id)
        .eq('account_id', accountId)
        .single();

      if (error || !token) {
        console.error('Token not found:', error);
        return false;
      }

      return await this.refreshToken(token);
    } catch (error) {
      console.error('Error in manual refresh:', error);
      return false;
    }
  }

  // Get token status for display
  async getTokenStatus(accountId: string) {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return null;

      const { data: token, error } = await supabase
        .from('google_business_tokens')
        .select('*')
        .eq('user_id', session.session.user.id)
        .eq('account_id', accountId)
        .single();

      if (error || !token) return null;

      const expiresAt = new Date(token.expires_at);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      const isExpired = timeUntilExpiry <= 0;
      const needsRefresh = timeUntilExpiry <= this.REFRESH_THRESHOLD;

      return {
        isActive: token.is_active && !isExpired,
        isExpired,
        needsRefresh,
        expiresAt: token.expires_at,
        lastRefreshed: token.last_refreshed_at,
        refreshCount: token.refresh_count || 0,
        timeUntilExpiry: Math.max(0, timeUntilExpiry)
      };
    } catch (error) {
      console.error('Error getting token status:', error);
      return null;
    }
  }
}

export const googleBusinessTokenService = new GoogleBusinessTokenService();