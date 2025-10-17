import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { accessToken } = await req.json();
    
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Access token required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    // First, get accounts
    const accountsResponse = await fetch(
      'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
      {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        signal: controller.signal
      }
    );

    if (!accountsResponse.ok) {
      const error = await accountsResponse.text();
      console.error('Google Business API error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch accounts' }), {
        status: accountsResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const accountsData = await accountsResponse.json();
    const accounts = accountsData.accounts || [];

    // Get locations for first account
    if (accounts.length > 0) {
      const locationsResponse = await fetch(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${accounts[0].name}/locations`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      const locationsData = await locationsResponse.json();
      
      return new Response(JSON.stringify({ accounts, locations: locationsData.locations || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    clearTimeout(timeoutId);

    return new Response(JSON.stringify({ accounts: [], locations: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Google Business locations error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
