export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    
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

    const missing = [];
    const configured = [];

    requiredSecrets.forEach(secret => {
      const value = Deno.env.get(secret);
      if (value) {
        configured.push(secret);
      } else {
        missing.push(secret);
      }
    });

    // Send email if secrets are missing
    if (missing.length > 0 && SENDGRID_API_KEY) {
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: 'admin@yourdomain.com' }],
            subject: '⚠️ Weekly Secrets Sync - Missing Secrets'
          }],
          from: { email: 'noreply@yourdomain.com' },
          content: [{
            type: 'text/html',
            value: `
              <h2>Weekly Secrets Sync Report</h2>
              <p>Missing Secrets: ${missing.length}</p>
              <ul>${missing.map(s => `<li>${s}</li>`).join('')}</ul>
              <p>Configured: ${configured.length}</p>
            `
          }]
        })
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      configured: configured.length,
      missing: missing.length,
      missingSecrets: missing 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
