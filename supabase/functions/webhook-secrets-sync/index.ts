export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { platform, trigger } = await req.json();
    
    const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN');
    const requiredSecrets = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_SECRET_KEY',
      'SENDGRID_API_KEY',
      'GITHUB_TOKEN',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET'
    ];

    const results = {
      platform: platform || 'both',
      trigger: trigger || 'webhook',
      timestamp: new Date().toISOString(),
      github: { synced: [], missing: [] },
      supabase: { synced: [], missing: [] },
      status: 'success'
    };

    // Validate secrets
    requiredSecrets.forEach(secret => {
      const value = Deno.env.get(secret);
      if (value) {
        results.supabase.synced.push(secret);
      } else {
        results.supabase.missing.push(secret);
      }
    });

    if (results.supabase.missing.length > 0) {
      results.status = 'partial';
    }

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
