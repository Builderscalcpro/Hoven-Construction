import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { accessToken, accountId, locationId, action, reviewId, replyText } = await req.json();
    
    if (!accessToken || !accountId || !locationId) {
      return new Response(JSON.stringify({ error: 'Access token, account ID, and location ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let response;
    
    switch (action) {
      case 'listReviews':
      default:
        // Fetch reviews using new Google Business Profile API
        response = await fetch(
          `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`,
          {
            headers: { 
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            signal: controller.signal
          }
        );

        break;
        
      case 'replyToReview':
        if (!reviewId || !replyText) {
          clearTimeout(timeoutId);
          return new Response(JSON.stringify({ error: 'Review ID and reply text required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        // Reply to a review
        response = await fetch(
          `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment: replyText }),
            signal: controller.signal
          }
        );
        break;
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Business API error:', errorText);
      
      // Parse error for better messaging
      let errorMessage = 'Failed to process request';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage,
        status: response.status 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Google Business reviews error:', error);
    
    // Handle specific error types
    let errorMessage = error.message;
    let statusCode = 500;
    
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout - Google API took too long to respond';
      statusCode = 408;
    } else if (error.message?.includes('NetworkError')) {
      errorMessage = 'Network error - unable to reach Google API';
      statusCode = 503;
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error.toString()
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});