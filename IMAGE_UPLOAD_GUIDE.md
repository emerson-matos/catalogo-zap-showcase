# Image Upload Integration Guide

This guide explains how to use the new Supabase Storage integration for product images in your Serena Cosméticos catalog.

## Overview

The application now supports uploading product images directly to your Supabase Storage bucket `serenacosmeticoscatalogoimagem`. This replaces the previous URL-based image system with a more robust file upload solution.

## Features

- **Drag & Drop Upload**: Users can drag and drop images directly onto the upload area
- **File Validation**: Automatic validation of file type and size
- **Progress Tracking**: Real-time upload progress indication
- **Image Preview**: Immediate preview of uploaded images
- **Storage Management**: Organized file storage with product-specific folders
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Components

### 1. ImageUpload Component

A reusable component for uploading images with drag-and-drop functionality.

```tsx
import { ImageUpload } from '@/components/ImageUpload';

<ImageUpload
  onImageUpload={(url) => console.log('Image uploaded:', url)}
  onImageRemove={() => console.log('Image removed')}
  currentImageUrl="https://example.com/image.jpg"
  productId="product-123"
  disabled={false}
/>
```

**Props:**
- `onImageUpload`: Callback when image is successfully uploaded
- `onImageRemove`: Callback when image is removed
- `currentImageUrl`: Current image URL to display
- `productId`: Optional product ID for organizing files
- `disabled`: Whether the upload is disabled
- `className`: Additional CSS classes

### 2. ImageManager Component

A comprehensive image management component for admin users.

```tsx
import { ImageManager } from '@/components/ImageManager';

<ImageManager 
  productId="product-123" 
  productName="Product Name" 
/>
```

### 3. StorageService

A service class for interacting with Supabase Storage.

```tsx
import { StorageService } from '@/lib/storageService';

// Upload an image
const imageUrl = await StorageService.uploadImage(file, productId);

// Delete an image
await StorageService.deleteImage(imageUrl);

// Get all images for a product
const images = await StorageService.getProductImages(productId);
```

## Configuration

### Storage Settings

The storage configuration is defined in `src/lib/config.ts`:

```typescript
storage: {
  bucketName: 'serenacosmeticoscatalogoimagem',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
}
```

### Supabase Setup

Make sure your Supabase project has:

1. **Storage Bucket**: Create a bucket named `serenacosmeticoscatalogoimagem`
2. **Bucket Policies**: Set up appropriate RLS policies for public access to images
3. **Environment Variables**: Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

## Usage Examples

### Basic Product Form Integration

The `AddProductForm` component has been updated to use the new image upload system:

```tsx
<FormField
  control={form.control}
  name="image"
  render={({ field }) => (
    <FormItem className="col-span-full">
      <FormLabel>Imagem do Produto</FormLabel>
      <FormControl>
        <ImageUpload
          onImageUpload={(url) => field.onChange(url)}
          onImageRemove={() => field.onChange("")}
          currentImageUrl={field.value}
          productId={product?.id}
          disabled={isMutating}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Image Validation

The system automatically validates uploaded images:

- **File Types**: Only JPG, PNG, GIF, and WebP files are allowed
- **File Size**: Maximum 5MB per image
- **Error Messages**: User-friendly error messages in Portuguese

### Image Optimization

Images uploaded to Supabase Storage can be optimized using query parameters:

```tsx
import { getOptimizedImageUrl } from '@/lib/imageUtils';

const thumbnailUrl = getOptimizedImageUrl(imageUrl, 'thumbnail');
const mediumUrl = getOptimizedImageUrl(imageUrl, 'medium');
const largeUrl = getOptimizedImageUrl(imageUrl, 'large');
```

## File Organization

Images are organized in the storage bucket as follows:

```
serenacosmeticoscatalogoimagem/
├── products/
│   ├── product-123/
│   │   ├── 1703123456789-abc123.jpg
│   │   └── 1703123456790-def456.png
│   └── product-456/
│       └── 1703123456791-ghi789.jpg
```

## Error Handling

The system handles various error scenarios:

- **Network Errors**: Automatic retry with user feedback
- **File Validation Errors**: Clear error messages for invalid files
- **Storage Errors**: Graceful handling of Supabase Storage errors
- **Permission Errors**: Appropriate error messages for access issues

## Security Considerations

- **File Type Validation**: Only image files are accepted
- **File Size Limits**: Prevents abuse with large file uploads
- **Unique Filenames**: Prevents filename conflicts
- **RLS Policies**: Supabase Row Level Security for bucket access

## Migration from URL-based Images

Existing products with URL-based images will continue to work. The system automatically detects whether an image URL is from Supabase Storage or external sources and handles them appropriately.

## Troubleshooting

### Common Issues

1. **Upload Fails**: Check Supabase Storage bucket permissions
2. **Images Not Displaying**: Verify RLS policies allow public access
3. **File Too Large**: Reduce image size or increase storage limits
4. **Invalid File Type**: Ensure file is JPG, PNG, GIF, or WebP

### Debug Mode

Enable debug logging by checking the browser console for detailed error messages.

## Future Enhancements

Potential improvements for the image upload system:

- **Image Compression**: Automatic image compression before upload
- **Multiple Image Support**: Support for multiple images per product
- **Image Editing**: Basic image editing capabilities
- **CDN Integration**: Integration with CDN for faster image delivery
- **Image Analytics**: Track image usage and performance