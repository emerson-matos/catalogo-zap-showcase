# Image Migration to Supabase Storage

This document explains the migration from Google Photos links to Supabase Storage for product images.

## Overview

The application has been updated to use Supabase Storage instead of Google Photos links for product images. This provides better control, security, and reliability for image storage.

## What Changed

### 1. New Image Upload System
- **ImageUploadField Component**: A new drag-and-drop image upload component
- **useImageUpload Hook**: Custom hook for handling image uploads with progress tracking
- **SupabaseService**: Extended with image upload/delete methods

### 2. Updated Admin Interface
- **AddProductForm**: Now uses the new image upload component instead of URL input
- **AdminPanel**: Added migration tab for managing the transition
- **ImageMigrationPanel**: Admin interface for running the migration

### 3. Storage Configuration
- **Bucket Name**: `serenacosmeticoscatalogoimagem`
- **File Organization**: Images are organized by product ID
- **Security**: Images are publicly accessible via signed URLs

## Migration Process

### Automatic Migration
1. Go to the Admin Panel
2. Click on the "Migração" tab
3. Review the migration statistics
4. Click "Iniciar Migração" to migrate all Google Photos links

### Manual Migration (Console)
You can also run the migration from the browser console:

```javascript
// Run the migration
await runImageMigration();
```

### Migration Features
- **Progress Tracking**: Real-time progress updates during migration
- **Error Handling**: Failed migrations are logged with error details
- **Validation**: Checks storage access before starting migration
- **Statistics**: Shows how many products need migration

## Technical Details

### File Structure
```
src/
├── components/
│   ├── ImageUploadField.tsx      # Drag-and-drop image upload
│   ├── ImageMigrationPanel.tsx   # Admin migration interface
│   └── AddProductForm.tsx         # Updated with new upload component
├── hooks/
│   └── useImageUpload.ts          # Image upload hook
├── lib/
│   ├── supabaseService.ts         # Extended with storage methods
│   └── imageMigration.ts         # Migration service
```

### Storage Methods
- `uploadImage(file, productId?)`: Upload image to Supabase Storage
- `deleteImage(imageUrl)`: Delete image from storage
- `getImageUrl(imagePath)`: Get public URL for image

### Migration Service
- `migrateAllProducts()`: Migrate all products with Google Photos links
- `migrateProduct(product)`: Migrate a single product
- `getMigrationStats()`: Get migration statistics
- `validateStorageAccess()`: Check if storage bucket is accessible

## Security Considerations

1. **File Validation**: Only image files are accepted
2. **Size Limits**: Maximum file size of 10MB
3. **File Types**: Supports PNG, JPG, GIF, and other image formats
4. **Access Control**: Images are publicly accessible (consider implementing signed URLs for production)

## Usage

### For New Products
1. Go to Admin Panel → Products → Add New Product
2. Use the drag-and-drop image upload field
3. Select or drag an image file
4. The image will be automatically uploaded to Supabase Storage

### For Existing Products
1. Edit the product in the admin panel
2. Use the image upload field to replace the existing image
3. The old image will be automatically deleted from storage

## Troubleshooting

### Common Issues
1. **Storage Access Denied**: Check Supabase configuration and bucket permissions
2. **Upload Fails**: Verify file size and type restrictions
3. **Migration Errors**: Check network connectivity and Google Photos link validity

### Console Commands
```javascript
// Check migration statistics
await ImageMigrationService.getMigrationStats();

// Validate storage access
await ImageMigrationService.validateStorageAccess();

// Run migration
await runImageMigration();
```

## Benefits

1. **Reliability**: No dependency on external Google Photos links
2. **Performance**: Faster image loading with CDN
3. **Control**: Full control over image storage and access
4. **Security**: Better security with controlled access
5. **Scalability**: Better handling of large numbers of images