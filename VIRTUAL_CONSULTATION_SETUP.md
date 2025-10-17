# Virtual Consultation Booking System

## Overview
A comprehensive virtual consultation booking system with calendar integration, video call scheduling, automated reminder emails, and pre-consultation questionnaires.

## Features

### 1. **Consultation Booking**
- Calendar-based date selection
- Time slot availability display
- Choice between virtual (video) and in-person consultations
- Real-time booking confirmation

### 2. **Pre-Consultation Questionnaire**
- Project type and scope collection
- Budget range and timeline preferences
- Property information
- Style preferences and specific requirements
- Inspiration photo uploads (stored in Supabase Storage)

### 3. **Automated Email Reminders**
- **Confirmation Email**: Sent immediately after booking
- **24-Hour Reminder**: Sent 24 hours before consultation
- **1-Hour Reminder**: Sent 1 hour before consultation

### 4. **Video Call Integration**
- Automatic Google Meet link generation (placeholder)
- Video call links displayed in consultation details
- One-click join functionality

## Database Schema

### Tables Created
1. **consultations**
   - Stores all consultation bookings
   - Fields: client info, date/time, type, status, video link

2. **consultation_questionnaires**
   - Pre-consultation project details
   - Fields: project type, budget, timeline, photos

3. **consultation_reminders**
   - Tracks sent reminder emails
   - Fields: reminder type, status, sent timestamp

## Storage
- **consultation-photos** bucket: Stores client inspiration photos

## Edge Functions

### send-consultation-reminder
Sends automated reminder emails via SendGrid
- Confirmation emails
- 24-hour reminders
- 1-hour reminders

## Usage

### For Clients
1. Navigate to `/consultations` or click "Consultations" in navigation
2. Click "Book New Consultation"
3. Fill in contact information
4. Select consultation type (Virtual or In-Person)
5. Choose date and time slot
6. Complete pre-consultation questionnaire
7. Upload inspiration photos (optional)
8. Submit to confirm booking

### For Administrators
- View all consultations in the Consultations page
- Access client questionnaire responses
- View uploaded inspiration photos
- Manage consultation status (scheduled, completed, cancelled)

## Automated Reminders Setup

To enable automated reminders, you'll need to set up a cron job or scheduled task:

### Option 1: Supabase Cron Jobs (Recommended)
```sql
-- Run every hour to check for upcoming consultations
SELECT cron.schedule(
  'send-consultation-reminders',
  '0 * * * *', -- Every hour
  $$
  SELECT send_consultation_reminders();
  $$
);
```

### Option 2: External Cron Service
Use a service like Zapier, Make.com, or a custom server to:
1. Query consultations table for upcoming appointments
2. Check if reminders have been sent
3. Call the `send-consultation-reminder` edge function

## Customization

### Time Slots
Edit `VirtualConsultationBooking.tsx` to customize available time slots:
```typescript
const timeSlots = [
  { time: '09:00 AM', available: true },
  { time: '10:00 AM', available: true },
  // Add more slots
];
```

### Video Call Integration
Replace placeholder Google Meet links with actual integration:
- Google Calendar API
- Zoom API
- Microsoft Teams API

### Email Templates
Customize email content in `send-consultation-reminder` edge function

## Security
- Row Level Security (RLS) enabled on all tables
- Users can only view/edit their own consultations
- Photo uploads restricted to authenticated users
- Private storage bucket for inspiration photos

## Next Steps
1. Integrate with Google Calendar API for real availability
2. Add video call provider integration (Zoom, Google Meet)
3. Set up automated reminder scheduling
4. Add SMS reminders via Twilio
5. Create admin dashboard for consultation management
