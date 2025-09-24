import { useState, useCallback, useRef, useEffect } from "react";

export interface ImageItem {
  id: string;
  url: string;
  file?: File;
  isExisting: boolean;
}

interface UseImageManagementProps {
  existingImages?: string[];
}

export const useImageManagement = ({
  existingImages = [],
}: UseImageManagementProps) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const fileReaderRefs = useRef<FileReader[]>([]);
  const initializedRef = useRef(false);

  // Initialize images from existing product only once
  useEffect(() => {
    if (!initializedRef.current && existingImages.length > 0) {
      const initialImages: ImageItem[] = existingImages.map((url, index) => ({
        id: `existing-${index}`,
        url,
        isExisting: true,
      }));
      setImages(initialImages);
      setImagesToRemove([]);
      initializedRef.current = true;
    }
  }, [existingImages]);

  // Cleanup file readers on unmount
  useEffect(() => {
    const currentReaders = fileReaderRefs.current;
    return () => {
      currentReaders.forEach((reader) => {
        if (reader.readyState === FileReader.LOADING) {
          reader.abort();
        }
      });
    };
  }, []);

  const addImages = useCallback(async (files: File[]) => {
    const newImages: ImageItem[] = [];
    const readers: FileReader[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      readers.push(reader);

      const imageItem: ImageItem = {
        id: `new-${Date.now()}-${i}`,
        url: "", // Will be set when reader loads
        file,
        isExisting: false,
      };

      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageItem.id ? { ...img, url: result } : img,
            ),
          );
        }
      };

      reader.onerror = () => {
        console.error("Failed to read file:", file.name);
      };

      reader.readAsDataURL(file);
      newImages.push(imageItem);
    }

    fileReaderRefs.current.push(...readers);
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((imageId: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === imageId);
      if (!imageToRemove) return prev;

      // If it's an existing image, mark it for removal
      if (imageToRemove.isExisting) {
        setImagesToRemove((current) => [...current, imageToRemove.url]);
      }

      return prev.filter((img) => img.id !== imageId);
    });
  }, []);

  // FIX: Remove the images dependency to prevent infinite loop
  const clearAllImages = useCallback(() => {
    setImages((prevImages) => {
      const existingUrls = prevImages
        .filter((img) => img.isExisting)
        .map((img) => img.url);

      if (existingUrls.length > 0) {
        setImagesToRemove(existingUrls);
      }

      return [];
    });
  }, []); // Empty dependency array - no dependencies needed

  const reset = useCallback(() => {
    setImages([]);
    setImagesToRemove([]);
    initializedRef.current = false;
  }, []);

  const getNewFiles = useCallback(() => {
    return images
      .filter((img) => !img.isExisting && img.file)
      .map((img) => img.file)
      .filter((file): file is File => file !== undefined);
  }, [images]);

  return {
    images,
    imagesToRemove,
    addImages,
    removeImage,
    clearAllImages,
    reset,
    getNewFiles,
    hasImages: images.length > 0,
    hasNewImages: images.some((img) => !img.isExisting),
  };
};
