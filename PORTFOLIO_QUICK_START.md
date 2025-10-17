# Portfolio Manager Quick Start

## Accessing the Portfolio Manager

### Option 1: Direct URL
Navigate to: **`/admin/portfolio`**

### Option 2: From Admin Dashboard
1. Go to `/admin` or click "Admin Dashboard" in navigation
2. Click the "Portfolio" tab
3. Click "Open Advanced Manager →" button

## Quick Actions

### Replace a Single Image
1. Click "Edit" on any portfolio card
2. Drag & drop your new image or click to browse
3. Image uploads automatically to Cloudinary CDN
4. Changes appear immediately on the website

### Reorder Portfolio Items
1. Click and drag any portfolio card
2. Drop it in the new position
3. Order saves automatically when you release
4. Each category maintains its own order

### Swap Images Between Projects
1. Click "Swap Images" button in the top toolbar
2. Select first project (category + item)
3. Select second project (category + item)
4. Click "Swap Images" button
5. Images exchange positions instantly

### Bulk Upload Multiple Images
1. Click "Bulk Upload" button in the top toolbar
2. Drag & drop multiple image files
3. Review the file list
4. Click "Upload X Images" button
5. Progress bar shows upload status

### Edit Image (Zoom, Rotate, Brightness)
1. Click "Edit" on a portfolio card
2. Click "Advanced Editing" button
3. Adjust zoom, rotation, and brightness sliders
4. Preview changes in real-time
5. Click "Save Changes" when satisfied

## Tips

- **Image Quality**: Upload high-resolution images (1200px+ width)
- **File Formats**: JPG, PNG, and WebP supported
- **File Size**: Keep under 2MB for best performance
- **Browser Cache**: Hard refresh (Ctrl+Shift+R) to see changes immediately

## Troubleshooting

**Images not showing?**
- Clear browser cache
- Check browser console for errors
- Verify Cloudinary credentials in Supabase

**Can't drag items?**
- Make sure you're clicking the card, not buttons
- Try refreshing the page
- Check for JavaScript errors

**Upload failing?**
- Verify file format (JPG, PNG, WebP only)
- Check file size (under 10MB)
- Ensure Cloudinary API keys are configured

## Need Help?

See the full guide: `PORTFOLIO_MANAGER_GUIDE.md`
