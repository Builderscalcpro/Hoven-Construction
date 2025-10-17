import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { contractorEmail, contractorName, notificationType, projectDetails } = await req.json();
    
    if (!contractorEmail || !notificationType) {
      return new Response(JSON.stringify({ error: 'Contractor email and notification type required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    if (!SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
    }

    let subject = '';
    let html = '';

    switch (notificationType) {
      case 'job_assignment':
        subject = 'New Job Assignment';
        html = `<h2>New Job Assignment</h2><p>Hi ${contractorName},</p><p>You have been assigned to a new project: ${projectDetails?.name}</p>`;
        break;
      case 'schedule_update':
        subject = 'Schedule Update';
        html = `<h2>Schedule Update</h2><p>Hi ${contractorName},</p><p>Your schedule has been updated for project: ${projectDetails?.name}</p>`;
        break;
      case 'payment_received':
        subject = 'Payment Received';
        html = `<h2>Payment Received</h2><p>Hi ${contractorName},</p><p>Your payment of $${projectDetails?.amount} has been processed.</p>`;
        break;
      default:
        subject = 'Notification';
        html = `<p>Hi ${contractorName},</p><p>You have a new notification.</p>`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: contractorEmail }] }],
        from: { email: 'noreply@yourdomain.com' },
        subject,
        content: [{ type: 'text/html', value: html }]
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      console.error('SendGrid error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send notification' }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contractor notifications error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
