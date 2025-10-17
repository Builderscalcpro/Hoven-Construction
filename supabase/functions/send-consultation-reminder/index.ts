import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { consultationId, customerEmail, customerName, dateTime } = await req.json();
    
    if (!customerEmail || !dateTime) {
      return new Response(JSON.stringify({ error: 'Customer email and date/time required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    if (!SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
    }

    const html = `
      <h2>Consultation Reminder</h2>
      <p>Hi ${customerName || 'there'},</p>
      <p>This is a reminder about your upcoming consultation scheduled for:</p>
      <p><strong>${new Date(dateTime).toLocaleString()}</strong></p>
      <p>We look forward to discussing your project!</p>
      <p>If you need to reschedule, please contact us.</p>
    `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: customerEmail }] }],
        from: { email: 'noreply@yourdomain.com' },
        subject: 'Consultation Reminder',
        content: [{ type: 'text/html', value: html }]
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      console.error('SendGrid error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send reminder' }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Send consultation reminder error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
