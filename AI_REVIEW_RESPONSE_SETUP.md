# AI-Powered Review Response System

## Overview
This system uses OpenAI's GPT-4 to automatically generate personalized responses to Google Business Profile reviews. It includes an approval workflow, customizable tone settings, and response templates.

## Features

### 1. AI Response Generation
- **Powered by OpenAI GPT-4**: Generates contextual, personalized responses
- **Multiple Tone Options**: Professional, Friendly, or Formal
- **Context-Aware**: Considers review rating, content, and business information
- **Customizable**: Add business-specific instructions and guidelines

### 2. Approval Workflow
- **Draft Responses**: All AI-generated responses start as drafts
- **Review & Edit**: Users can review and edit responses before posting
- **Approve or Reject**: Full control over what gets posted
- **Response History**: Track all generated and posted responses

### 3. Response Settings
Configure AI behavior in the "AI Settings" tab:
- **Default Tone**: Choose your preferred tone (professional/friendly/formal)
- **Business Name**: Used in response generation
- **Business Description**: Provides context for AI
- **Custom Instructions**: Add specific guidelines for responses
- **Require Approval**: Toggle whether responses need approval before posting

## Database Tables

### response_templates
Stores customizable response templates:
- `name`: Template name
- `template_text`: Template content
- `tone`: professional, friendly, or formal
- `rating_range`: 1-2, 3, or 4-5 stars
- `is_default`: Whether this is the default template

### review_responses
Tracks AI-generated responses:
- `review_id`: Links to google_reviews table
- `ai_generated_response`: Original AI response
- `edited_response`: User-edited version
- `status`: draft, approved, posted, or rejected
- `tone_used`: Tone used for generation
- `posted_at`: When response was posted

### ai_response_settings
User preferences for AI generation:
- `default_tone`: User's preferred tone
- `auto_generate`: Whether to auto-generate responses
- `require_approval`: Whether approval is needed
- `business_name`: Business name for context
- `business_description`: Business description
- `custom_instructions`: Custom AI guidelines

## Edge Functions

### generate-ai-review-response
Generates personalized review responses using OpenAI GPT-4.

**Endpoint**: `/functions/v1/generate-ai-review-response`

**Request Body**:
```json
{
  "reviewText": "Great service!",
  "rating": 5,
  "reviewerName": "John Doe",
  "tone": "professional",
  "businessName": "ABC Company",
  "businessDescription": "We provide excellent services",
  "customInstructions": "Always mention our warranty"
}
```

**Response**:
```json
{
  "response": "Thank you for your wonderful review, John! We're thrilled..."
}
```

## Usage Guide

### For Users

1. **Configure AI Settings**:
   - Go to Reviews Management Dashboard
   - Click "AI Settings" tab
   - Set your business information and preferences
   - Save settings

2. **Generate Response**:
   - View a review without a reply
   - Click "Reply with AI" button
   - Select tone (or use default)
   - Click "Generate Response"

3. **Review & Edit**:
   - Review the AI-generated response
   - Click "Edit" to modify if needed
   - Make any necessary changes

4. **Approve & Save**:
   - Click "Approve & Save" to save the response
   - Response is saved with "approved" status
   - Can be posted to Google later

### For Developers

#### Generate a Response Programmatically:
```typescript
const { data, error } = await supabase.functions.invoke('generate-ai-review-response', {
  body: {
    reviewText: review.comment,
    rating: review.star_rating,
    reviewerName: review.reviewer_name,
    tone: 'professional',
    businessName: 'Your Business',
    businessDescription: 'What you do',
    customInstructions: 'Special guidelines'
  }
});
```

#### Save Response to Database:
```typescript
await supabase.from('review_responses').insert({
  user_id: userId,
  review_id: reviewId,
  ai_generated_response: response,
  tone_used: tone,
  status: 'draft'
});
```

## Tone Examples

### Professional
"Thank you for your feedback. We appreciate your business and look forward to serving you again."

### Friendly
"Thanks so much for the kind words! We're thrilled you had a great experience with us!"

### Formal
"We sincerely appreciate your review and are pleased to have met your expectations."

## Best Practices

1. **Always Review AI Responses**: Even with AI, human review ensures quality
2. **Customize Business Context**: Provide detailed business information for better responses
3. **Set Clear Guidelines**: Use custom instructions for brand voice consistency
4. **Monitor Response Quality**: Track which responses work best
5. **Update Settings Regularly**: Refine your settings based on results

## Security

- All API keys stored securely in Supabase secrets
- Row Level Security (RLS) enabled on all tables
- User-scoped data access only
- No API keys exposed to frontend

## Future Enhancements

- Auto-post approved responses to Google
- Response analytics and performance tracking
- A/B testing different response styles
- Bulk response generation
- Response templates library
- Sentiment analysis integration
