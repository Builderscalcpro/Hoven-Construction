# Business Information Auto-Sync Setup Guide

## Overview
Automatic syncing of business information (hours, address, phone) from Google Business Profile to keep your website data consistent with Google listings.

## Features Implemented

### 1. Database Table
- **Table**: `business_info`
- Stores synced business information including:
  - Business name
  - Address
  - Phone number
  - Website URL
  - Business hours (JSON format)
  - Categories
  - Description
  - Last sync timestamp

### 2. Edge Function
- **Function**: `sync-business-info`
- Fetches business information from Google Business Profile API
- Extracts and formats business data
- Returns structured business information

### 3. Business Info Service
- **File**: `src/lib/businessInfoService.ts`
- Methods:
  - `syncFromGoogle()` - Fetch data from Google Business Profile
  - `saveBusinessInfo()` - Save synced data to database
  - `getBusinessInfo()` - Retrieve stored business info
  - `deleteBusinessInfo()` - Remove synced data

### 4. React Components

#### BusinessInfoSync Component
- **File**: `src/components/BusinessInfoSync.tsx`
- Features:
  - Manual sync button for each location
  - Display synced business information
  - Show last sync timestamp
  - Delete synced information
  - Visual feedback for sync operations

#### BusinessInfoDisplay Component
- **File**: `src/components/BusinessInfoDisplay.tsx`
- Reusable component to display business info anywhere in the app
- Shows address, phone, website
- Optional business hours display
- Loading states with skeletons

### 5. Custom Hook
- **File**: `src/hooks/useBusinessInfo.ts`
- Easy access to business information throughout the app
- Provides:
  - All business infos
  - Primary business info (first in list)
  - Loading state
  - Error handling
  - Refresh function

## How to Use

### 1. Sync Business Information

1. Navigate to Admin Dashboard
2. Go to Google Business Profile section
3. Click on "Auto-Sync Info" tab
4. Click "Sync Now" for each location you want to sync
5. Business information will be fetched and stored

### 2. Display Business Info in Your App

```tsx
import BusinessInfoDisplay from '@/components/BusinessInfoDisplay';

// In any component
<BusinessInfoDisplay showHours={true} />
```

### 3. Use Business Info Programmatically

```tsx
import { useBusinessInfo } from '@/hooks/useBusinessInfo';

function MyComponent() {
  const { primaryBusinessInfo, loading } = useBusinessInfo();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{primaryBusinessInfo?.business_name}</h1>
      <p>{primaryBusinessInfo?.address}</p>
      <a href={`tel:${primaryBusinessInfo?.phone}`}>
        {primaryBusinessInfo?.phone}
      </a>
    </div>
  );
}
```

## Automatic Sync Setup (Optional)

To set up automatic syncing on a schedule:

1. Create a cron job or scheduled task
2. Call the sync function periodically (e.g., daily)
3. Use Supabase Edge Functions with pg_cron or external scheduler

Example scheduled sync:
```sql
-- Run daily at 2 AM
SELECT cron.schedule(
  'sync-business-info-daily',
  '0 2 * * *',
  $$ 
  -- Your sync logic here
  $$
);
```

## Benefits

1. **Consistency**: Website data always matches Google Business Profile
2. **Time-Saving**: No manual updates needed across platforms
3. **Accuracy**: Single source of truth from Google Business Profile
4. **SEO**: Consistent NAP (Name, Address, Phone) across platforms
5. **User Experience**: Always up-to-date contact information

## Integration Points

The synced business information can be used in:
- Footer contact information
- Contact page
- Location pages
- Schema markup for local SEO
- Email templates
- Invoice generation
- Any component needing business details

## Troubleshooting

### Sync Fails
- Check Google Business Profile connection is active
- Verify access token is valid
- Ensure location has proper permissions

### Data Not Displaying
- Confirm business info was synced successfully
- Check database for stored records
- Verify user authentication

### Outdated Information
- Manually trigger sync from dashboard
- Check last_synced_at timestamp
- Update information in Google Business Profile first

## Next Steps

1. Set up automatic scheduled syncing
2. Add business hours display formatting
3. Integrate with schema markup
4. Use in email templates
5. Display on location-specific pages
