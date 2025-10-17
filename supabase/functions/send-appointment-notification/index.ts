import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface Appointment {
  id: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  service: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { appointment, action } = await req.json();

    // Email templates based on action
    const templates = {
      booked: {
        subject: 'Consultation Confirmed',
        clientBody: `Your consultation has been scheduled for ${appointment.date} at ${appointment.time}.`,
        adminBody: `New consultation booked by ${appointment.name} for ${appointment.date} at ${appointment.time}.`
      },
      rescheduled: {
        subject: 'Consultation Rescheduled',
        clientBody: `Your consultation has been rescheduled to ${appointment.date} at ${appointment.time}.`,
        adminBody: `${appointment.name} rescheduled their consultation to ${appointment.date} at ${appointment.time}.`
      },
      cancelled: {
        subject: 'Consultation Cancelled',
        clientBody: `Your consultation has been cancelled. We hope to see you again soon.`,
        adminBody: `${appointment.name} cancelled their consultation scheduled for ${appointment.date} at ${appointment.time}.`
      }
    };

    const template = templates[action as keyof typeof templates];
    
    // Send notifications (integrate with SendGrid or other email service)
    console.log('Sending notifications:', template);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});