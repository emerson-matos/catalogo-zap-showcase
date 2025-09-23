import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Upload, 
  Trash2, 
  Eye, 
  Download,
  Image as ImageIcon,
  Loader2,
  X
} from 'lucide-react';
import { StorageService } from '@/lib/storageService';
import { useProductImages } from '@/hooks/useProductImages';
import { formatFileSize } from '@/lib/imageUtils';
import { ImageUpload } from './ImageUpload';

interface ImageManagerProps {
  productId: string;
  productName?: string;
}

export function ImageManager({ productId, productName }: ImageManagerProps) {
  const { images, isLoading, error, refetch } = useProductImages(productId);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = async (url: string) => {
    toast.success('Imagem adicionada com sucesso!');
    await refetch();
  };

  const handleImageDelete = async (imageUrl: string) => {
    try {
      await StorageService.deleteImage(imageUrl);
      toast.success('Imagem removida com sucesso!');
      await refetch();
    } catch (error) {
      toast.error('Erro ao remover imagem');
    }
  };

  const handleImagePreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleDownloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `product-${productId}-image.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="size-8 animate-spin" />
            <span className="ml-2">Carregando imagens...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar imagens: {error}</p>
            <Button onClick={refetch} variant="outline" className="mt-2">
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="size-5" />
            Gerenciar Imagens
            {productName && (
              <Badge variant="secondary">{productName}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            onImageUpload={handleImageUpload}
            productId={productId}
            className="mb-4"
          />
          
          {images.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Imagens do Produto ({images.length})</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleImagePreview(imageUrl)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDownloadImage(imageUrl)}
                      >
                        <Download className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleImageDelete(imageUrl)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => setSelectedImage(null)}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}