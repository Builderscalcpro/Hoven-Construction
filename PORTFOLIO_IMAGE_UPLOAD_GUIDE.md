# Portfolio Image Upload System

## Overview
The portfolio image upload system allows administrators to replace default portfolio images with custom uploads directly from the admin dashboard.

## Features
- **Drag & Drop Upload**: Simply drag images into the upload area
- **Image Preview**: See images before uploading
- **Automatic CDN Upload**: Images are automatically uploaded to Cloudinary CDN
- **Database Persistence**: Custom images are saved to the database
- **Category Organization**: Manage images by category (Kitchens, Bathrooms, ADUs, Outdoor)
- **Easy Replacement**: Click any portfolio item to replace its image

## How to Use

### Accessing the Portfolio Manager
1. Navigate to Admin Dashboard
2. Click on the "Portfolio" tab
3. Select the category you want to manage (Kitchens, Bathrooms, ADUs, or Outdoor)

### Uploading a New Image
1. Click "Replace Image" on any portfolio item
2. Either:
   - Drag and drop an image file into the upload area
   - Click "Select Image" to browse your files
3. Preview the image before uploading
4. The image will automatically upload to Cloudinary CDN
5. Click to confirm and save to database

### Image Requirements
- **Format**: JPG, PNG, WEBP, or GIF
- **Recommended Size**: 1200x800px or larger
- **Aspect Ratio**: 3:2 or 4:3 works best
- **File Size**: Under 5MB for optimal performance

## Technical Details

### Database Schema
Images are stored in the `portfolio_images` table:
- `portfolio_id`: Links to the original portfolio item
- `category`: Category (kitchens, bathrooms, adus, outdoor)
- `image_url`: Cloudinary CDN URL
- `title` & `location`: Portfolio item details
- `uploaded_by`: User who uploaded the image

### CDN Integration
- Images are uploaded to Cloudinary via secure edge function
- API keys are stored securely in Supabase secrets
- Images are optimized automatically by Cloudinary

### Security
- Only authenticated users can upload images
- Row Level Security (RLS) policies protect the database
- API keys never exposed to frontend

## Troubleshooting

### Upload Fails
- Check that Cloudinary credentials are configured in Supabase
- Verify image file is a valid format
- Ensure file size is reasonable (< 5MB)

### Image Not Showing
- Clear browser cache
- Check that the image URL is accessible
- Verify database entry was created

### Permission Errors
- Ensure you're logged in as an admin
- Check RLS policies on portfolio_images table
