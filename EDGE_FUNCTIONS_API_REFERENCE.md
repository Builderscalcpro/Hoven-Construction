# Edge Functions API Reference

## AI Functions

### ai-chatbot
**Endpoint:** `POST /functions/v1/ai-chatbot`

**Request:**
```json
{
  "message": "Your question here"
}
```

**Response:**
```json
{
  "response": "AI generated response"
}
```

### ai-email-suggestions
**Endpoint:** `POST /functions/v1/ai-email-suggestions`

**Request:**
```json
{
  "context": "Email context",
  "recipientName": "John Doe",
  "emailType": "follow-up"
}
```

**Response:**
```json
{
  "suggestion": "Generated email content"
}
```

### ai-project-estimator
**Endpoint:** `POST /functions/v1/ai-project-estimator`

**Request:**
```json
{
  "projectType": "Kitchen Remodel",
  "scope": "Full renovation",
  "materials": "Mid-range",
  "location": "California"
}
```

**Response:**
```json
{
  "estimate": "Detailed cost estimate"
}
```

## Communication Functions

### send-email
**Endpoint:** `POST /functions/v1/send-email`

**Request:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email subject",
  "html": "<h1>HTML content</h1>",
  "from": "sender@example.com" // optional
}
```

**Response:**
```json
{
  "success": true
}
```

### send-notification
**Endpoint:** `POST /functions/v1/send-notification`

**Request:**
```json
{
  "userId": "user-uuid",
  "title": "Notification title",
  "message": "Notification message",
  "type": "info"
}
```

## Payment Functions

### stripe-create-payment-intent
**Endpoint:** `POST /functions/v1/stripe-create-payment-intent`

**Request:**
```json
{
  "amount": 5000,
  "currency": "usd",
  "metadata": {
    "orderId": "12345"
  }
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### stripe-process-payment
**Endpoint:** `POST /functions/v1/stripe-process-payment`

**Request:**
```json
{
  "paymentIntentId": "pi_xxx",
  "userId": "user-uuid",
  "invoiceId": "invoice-uuid"
}
```

## Calendar Functions

### google-calendar-auth
**Endpoint:** `POST /functions/v1/google-calendar-auth`

**Request:**
```json
{
  "code": "oauth_code",
  "redirectUri": "http://localhost:5173/callback"
}
```

**Response:**
```json
{
  "access_token": "ya29.xxx",
  "refresh_token": "1//xxx",
  "expires_in": 3600
}
```

### google-calendar-create-event
**Endpoint:** `POST /functions/v1/google-calendar-create-event`

**Request:**
```json
{
  "accessToken": "ya29.xxx",
  "summary": "Meeting",
  "description": "Project discussion",
  "startTime": "2024-01-01T10:00:00Z",
  "endTime": "2024-01-01T11:00:00Z",
  "attendees": [{"email": "attendee@example.com"}]
}
```

## Error Responses

All functions return errors in this format:
```json
{
  "error": "Error message description"
}
```

**Common Status Codes:**
- 200: Success
- 400: Bad Request (missing parameters)
- 401: Unauthorized (invalid API key)
- 408: Timeout (request took >30s)
- 429: Rate Limited
- 500: Internal Server Error
