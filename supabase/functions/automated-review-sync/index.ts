import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all users with auto-sync enabled
    const { data: configs } = await supabase
      .from('review_sync_config')
      .select('*, user_id')
      .eq('auto_sync_enabled', true);

    if (!configs || configs.length === 0) {
      return new Response(JSON.stringify({ message: 'No active sync configs' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const results = [];

    for (const config of configs) {
      try {
        // Get user's Google Business token
        const { data: tokenData } = await supabase
          .from('google_business_tokens')
          .select('access_token, location_id')
          .eq('user_id', config.user_id)
          .single();

        if (!tokenData?.access_token) continue;

        // Fetch reviews from Google
        const response = await fetch(
          `https://mybusiness.googleapis.com/v4/${tokenData.location_id}/reviews`,
          { headers: { 'Authorization': `Bearer ${tokenData.access_token}` } }
        );

        if (!response.ok) continue;

        const { reviews } = await response.json();
        let syncedCount = 0;
        let newReviews = [];

        for (const review of reviews || []) {
          const { data: existing } = await supabase
            .from('google_reviews')
            .select('id')
            .eq('review_id', review.reviewId)
            .single();

          if (!existing) {
            await supabase.from('google_reviews').insert({
              user_id: config.user_id,
              review_id: review.reviewId,
              reviewer_name: review.reviewer?.displayName,
              rating: review.starRating === 'FIVE' ? 5 : review.starRating === 'FOUR' ? 4 : 3,
              comment: review.comment,
              created_at: review.createTime
            });
            syncedCount++;
            newReviews.push(review);
          }
        }

        // Auto-respond to new reviews if enabled
        if (config.auto_respond_enabled && newReviews.length > 0) {
          for (const review of newReviews) {
            const rating = review.starRating === 'FIVE' ? 5 : review.starRating === 'FOUR' ? 4 : 3;
            
            // Generate AI response
            const aiResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-ai-review-response`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reviewText: review.comment,
                rating,
                businessName: config.business_name
              })
            });

            if (aiResponse.ok) {
              const { response: aiText } = await aiResponse.json();
              // Store the response
              await supabase.from('review_responses').insert({
                review_id: review.reviewId,
                response_text: aiText,
                auto_generated: true
              });
            }
          }
        }

        // Log sync
        await supabase.from('review_sync_logs').insert({
          user_id: config.user_id,
          status: 'success',
          reviews_synced: syncedCount,
          synced_at: new Date().toISOString()
        });

        // Update last sync time
        await supabase
          .from('review_sync_config')
          .update({ last_sync_at: new Date().toISOString() })
          .eq('id', config.id);

        results.push({ userId: config.user_id, synced: syncedCount });
      } catch (error) {
        await supabase.from('review_sync_logs').insert({
          user_id: config.user_id,
          status: 'error',
          error_message: error.message,
          synced_at: new Date().toISOString()
        });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Automated review sync error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
