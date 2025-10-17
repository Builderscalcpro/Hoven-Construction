import { supabase } from './supabase';
import { googleBusinessTokenService } from '@/services/googleBusinessTokenService';
export interface GoogleReview {
  reviewId: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl?: string;
  };
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment?: string;
  createTime: string;
  updateTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
}

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  website: string;
  hours: Record<string, string>;
  categories: string[];
  description: string;
}

export async function fetchGoogleReviews(tokenData: any): Promise<GoogleReview[]> {
  try {
    // Check token validity before making API call
    const tokenStatus = await googleBusinessTokenService.getTokenStatus(tokenData.account_id);
    if (tokenStatus?.isExpired) {
      console.log('Token expired, attempting refresh...');
      const refreshed = await googleBusinessTokenService.manualRefresh(tokenData.account_id);
      if (!refreshed) {
        throw new Error('Failed to refresh expired token');
      }
      // Fetch updated token data
      const { data: updatedToken } = await supabase
        .from('google_business_tokens')
        .select('*')
        .eq('account_id', tokenData.account_id)
        .single();
      if (updatedToken) {
        tokenData = updatedToken;
      }
    }

    const { data, error } = await supabase.functions.invoke('google-business-reviews', {
      body: {
        accessToken: tokenData.access_token,
        accountId: tokenData.account_id,
        locationId: tokenData.location_id,
        action: 'listReviews'
      }
    });

    if (error) throw error;
    return data?.reviews || [];
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return [];
  }
}

export async function replyToReview(
  tokenData: any,
  reviewId: string,
  replyText: string
): Promise<boolean> {
  try {
    // Check token validity before making API call
    const tokenStatus = await googleBusinessTokenService.getTokenStatus(tokenData.account_id);
    if (tokenStatus?.isExpired) {
      console.log('Token expired, attempting refresh...');
      const refreshed = await googleBusinessTokenService.manualRefresh(tokenData.account_id);
      if (!refreshed) {
        throw new Error('Failed to refresh expired token');
      }
      // Fetch updated token data
      const { data: updatedToken } = await supabase
        .from('google_business_tokens')
        .select('*')
        .eq('account_id', tokenData.account_id)
        .single();
      if (updatedToken) {
        tokenData = updatedToken;
      }
    }

    const { data, error } = await supabase.functions.invoke('google-business-reviews', {
      body: {
        accessToken: tokenData.access_token,
        accountId: tokenData.account_id,
        locationId: tokenData.location_id,
        action: 'replyToReview',
        reviewId,
        replyText
      }
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error replying to review:', error);
    return false;
  }
}

export async function fetchBusinessInfo(tokenData: any): Promise<BusinessInfo | null> {
  try {
    // Check token validity before making API call
    const tokenStatus = await googleBusinessTokenService.getTokenStatus(tokenData.account_id);
    if (tokenStatus?.isExpired) {
      console.log('Token expired, attempting refresh...');
      const refreshed = await googleBusinessTokenService.manualRefresh(tokenData.account_id);
      if (!refreshed) {
        throw new Error('Failed to refresh expired token');
      }
      // Fetch updated token data
      const { data: updatedToken } = await supabase
        .from('google_business_tokens')
        .select('*')
        .eq('account_id', tokenData.account_id)
        .single();
      if (updatedToken) {
        tokenData = updatedToken;
      }
    }

    const { data, error } = await supabase.functions.invoke('google-business-locations', {
      body: {
        accessToken: tokenData.access_token,
        accountId: tokenData.account_id,
        locationId: tokenData.location_id
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching business info:', error);
    return null;
  }
}
