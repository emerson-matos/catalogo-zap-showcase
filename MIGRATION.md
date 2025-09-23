# Image Migration to Supabase Storage

This document describes the migration from Google Photos links to Supabase Storage for product images.

## Overview

The application has been updated to use Supabase Storage instead of Google Photos links for product images. This provides better control, security, and reliability for image storage.

## What's Changed

### 1. Storage Service (`src/lib/storage.ts`)
- New `StorageService` class for handling image uploads to Supabase Storage
- File validation (type and size)
- Automatic cleanup of old images when updating/deleting products
- Support for public URLs and signed URLs

### 2. Updated Supabase Service (`src/lib/supabaseService.ts`)
- New methods: `createProductWithImage()` and `updateProductWithImage()`
- Automatic image cleanup when deleting products
- Backward compatibility with existing URL-based products

### 3. Enhanced Admin Forms (`src/components/AddProductForm.tsx`)
- New `ImageUpload` component for file uploads
- Drag-and-drop support
- Image preview
- File validation with user-friendly error messages

### 4. Migration Tools (`src/lib/migration.ts` & `src/components/ImageMigrationPanel.tsx`)
- Automated migration from Google Photos to Supabase Storage
- Preview functionality to see what will be migrated
- Progress tracking and error reporting
- Rollback capability (with original URL storage)

## Configuration

### Environment Variables
Make sure your Supabase configuration is properly set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Storage Bucket
The application uses the bucket: `serenacosmeticoscatalogoimagem`

Make sure this bucket exists in your Supabase project and has the correct permissions:
- Public read access for displaying images
- Authenticated write access for admin uploads

## Migration Process

### Automatic Migration
1. Go to Admin Panel → "Migração de Imagens" tab
2. Click "Preview Migration" to see which products will be migrated
3. Click "Start Migration" to begin the process
4. Monitor progress and review results

### Manual Migration
If you prefer to migrate manually or need more control:

```typescript
import { ImageMigrationService } from '@/lib/migration';

// Preview what will be migrated
const preview = await ImageMigrationService.previewMigration();

// Run migration
const result = await ImageMigrationService.migrateAllProducts();
```

## File Structure

Images are stored with the following structure:
```
products/
  {productId}/
    {timestamp}.{extension}
```

Example: `products/abc123/1703123456789.jpg`

## Security

- File type validation (only images: JPEG, PNG, WEBP)
- File size limits (5MB maximum)
- Automatic cleanup of orphaned images
- Secure file naming to prevent conflicts

## Backward Compatibility

- Existing Google Photos URLs will continue to work
- New products require file uploads
- Migration can be run incrementally
- Rollback is possible if needed

## Troubleshooting

### Common Issues

1. **Upload fails**: Check Supabase bucket permissions
2. **Migration errors**: Verify Google Photos URLs are accessible
3. **File too large**: Reduce image size or increase limits
4. **Invalid file type**: Use supported formats (JPEG, PNG, WEBP)

### Support

For issues with the migration process, check:
- Supabase Storage logs
- Browser console for client-side errors
- Network tab for failed requests

## Future Enhancements

- Image optimization and resizing
- Multiple image support per product
- CDN integration
- Advanced image processing