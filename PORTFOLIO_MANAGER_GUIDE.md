# Advanced Portfolio Manager Guide

## Overview
The Advanced Portfolio Manager provides comprehensive tools for managing your portfolio images without manually editing data files. Access it at `/admin/portfolio`.

## Features

### 1. Drag-and-Drop Reordering
- **How to use**: Click and drag any portfolio card to reorder items
- **Auto-save**: Order is automatically saved to the database when you release
- **Per-category**: Each category (Kitchens, Bathrooms, ADUs, Outdoor) maintains its own order
- **Visual feedback**: Dragged items show opacity change during movement

### 2. Image Replacement
- **Quick replace**: Click "Edit" on any portfolio item
- **Upload new image**: Drag & drop or select a file from your computer
- **Cloudinary integration**: Images are automatically uploaded to CDN
- **Instant preview**: See changes immediately in the grid

### 3. Advanced Image Editing
- **Zoom**: Scale images from 0.5x to 3x
- **Rotation**: Rotate in 15° increments (0-360°)
- **Brightness**: Adjust from 50% to 150%
- **Real-time preview**: See edits before saving
- **Canvas-based**: Professional-grade image manipulation

### 4. Bulk Upload
- **Multiple files**: Upload many images at once
- **Drag & drop**: Drop files directly into the upload zone
- **Progress tracking**: See upload status for each file
- **Category assignment**: Automatically categorize uploaded images
- **File management**: Remove files before upload if needed

### 5. Image Swapping
- **Cross-category**: Swap images between any two projects
- **Visual selection**: See preview of both images before swapping
- **Instant update**: Changes reflect immediately across the site
- **Undo-friendly**: Swap back if needed

## Database Integration

### Portfolio Images Table
```sql
portfolio_images (
  portfolio_id: integer (primary key)
  category: text
  title: text
  location: text
  image_url: text
  display_order: integer
  updated_at: timestamp
)
```

### How It Works
1. **Original data**: Portfolio data in `portfolioData.ts` serves as defaults
2. **Custom images**: Database overrides are stored in `portfolio_images` table
3. **Display logic**: App checks database first, falls back to default data
4. **Order persistence**: `display_order` column maintains custom sorting

## Access Control
- **Admin only**: Requires admin role to access
- **Route**: `/admin/portfolio`
- **Quick access**: Link available in Admin Dashboard → Portfolio tab

## Best Practices

### Image Specifications
- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 1200x800px minimum
- **Aspect ratio**: 3:2 or 4:3 for best results
- **File size**: Under 2MB for optimal loading

### Organization Tips
1. **Use descriptive titles**: Makes finding projects easier
2. **Consistent locations**: Use standard LA area names
3. **Regular backups**: Export portfolio data periodically
4. **Test changes**: Preview on frontend after major updates

### Performance
- **CDN delivery**: All images served via Cloudinary CDN
- **Lazy loading**: Images load as users scroll
- **Optimized sizes**: Automatic responsive image sizing
- **Caching**: Browser and CDN caching for fast loads

## Troubleshooting

### Images not updating
1. Check browser cache (hard refresh: Ctrl+Shift+R)
2. Verify database connection in console
3. Ensure Cloudinary credentials are configured

### Drag-and-drop not working
1. Make sure you're clicking the card (not buttons)
2. Try refreshing the page
3. Check for JavaScript errors in console

### Upload failures
1. Verify file format (JPG, PNG, WebP only)
2. Check file size (under 10MB)
3. Ensure Cloudinary API keys are set in Supabase secrets

## Technical Details

### Components
- `AdvancedPortfolioManager.tsx`: Main page component
- `DraggablePortfolioGrid.tsx`: Drag-and-drop grid
- `ImageEditor.tsx`: Image editing tools
- `BulkImageUploader.tsx`: Bulk upload interface
- `ImageSwapper.tsx`: Image swapping tool

### API Integration
- **Supabase**: Database operations
- **Cloudinary**: Image hosting and CDN
- **Edge Functions**: `upload-to-cloudinary` for secure uploads

### State Management
- React hooks for local state
- Supabase real-time for data sync
- Toast notifications for user feedback

## Future Enhancements
- [ ] Image cropping tool
- [ ] Batch operations (delete, move)
- [ ] Image filters and effects
- [ ] AI-powered image tagging
- [ ] Version history
- [ ] Export/import functionality
