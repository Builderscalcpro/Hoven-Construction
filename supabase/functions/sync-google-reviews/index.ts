import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, locationId } = await req.json();
    
    if (!userId || !locationId) {
      return new Response(JSON.stringify({ error: 'User ID and location ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: tokenData } = await supabase
      .from('google_business_tokens')
      .select('access_token')
      .eq('user_id', userId)
      .single();

    if (!tokenData?.access_token) {
      return new Response(JSON.stringify({ error: 'No Google Business token found' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${locationId}/locations/${locationId}/reviews`,
      {
        headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Google Business API error:', await response.text());
      return new Response(JSON.stringify({ error: 'Failed to fetch reviews' }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const reviews = await response.json();

    return new Response(JSON.stringify({ reviews }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Sync reviews error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
