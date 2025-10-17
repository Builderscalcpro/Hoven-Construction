import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { userId, startDate, endDate } = await req.json();
    const allEvents: any[] = [];

    // Fetch Google Calendar events
    const { data: googleTokens } = await supabase
      .from('google_calendar_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('sync_enabled', true);

    if (googleTokens) {
      for (const token of googleTokens) {
        try {
          const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${token.calendar_id}/events?timeMin=${startDate}&timeMax=${endDate}`,
            { headers: { Authorization: `Bearer ${token.access_token}` } }
          );
          const data = await response.json();
          if (data.items) {
            allEvents.push(...data.items.map((e: any) => ({
              id: e.id,
              summary: e.summary || 'Untitled',
              start_time: e.start.dateTime || e.start.date,
              end_time: e.end.dateTime || e.end.date,
              provider: 'google',
              calendar_id: token.calendar_id,
              calendar_name: token.calendar_name,
              description: e.description,
              location: e.location,
            })));
          }
        } catch (err) {
          console.error('Google fetch error:', err);
        }
      }
    }

    // Fetch Outlook events
    const { data: outlookTokens } = await supabase
      .from('outlook_calendar_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('sync_enabled', true);

    if (outlookTokens) {
      for (const token of outlookTokens) {
        try {
          const response = await fetch(
            `https://graph.microsoft.com/v1.0/me/calendars/${token.calendar_id}/events?$filter=start/dateTime ge '${startDate}' and end/dateTime le '${endDate}'`,
            { headers: { Authorization: `Bearer ${token.access_token}` } }
          );
          const data = await response.json();
          if (data.value) {
            allEvents.push(...data.value.map((e: any) => ({
              id: e.id,
              summary: e.subject,
              start_time: e.start.dateTime,
              end_time: e.end.dateTime,
              provider: 'outlook',
              calendar_id: token.calendar_id,
              calendar_name: token.calendar_name,
              description: e.body?.content,
              location: e.location?.displayName,
            })));
          }
        } catch (err) {
          console.error('Outlook fetch error:', err);
        }
      }
    }

    return new Response(JSON.stringify({ events: allEvents }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
