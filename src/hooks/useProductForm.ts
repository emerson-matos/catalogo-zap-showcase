import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useAdminProducts } from './useAdminProducts';
import type { Product, ProductInsert } from '@/lib/supabase';

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
  image: z.string().url('URL da imagem inválida'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  rating: z.number().min(0).max(5).optional(),
  is_new: z.boolean().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface UseProductFormReturn {
  form: ReturnType<typeof useForm<ProductFormData>>;
  editingProduct: Product | null;
  imagePreview: string;
  setEditingProduct: (product: Product | null) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  resetForm: () => void;
}

export const useProductForm = (): UseProductFormReturn => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const { user } = useAuth();
  const { createProduct, updateProduct, isMutating } = useAdminProducts();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image: '',
      category: '',
      rating: undefined,
      is_new: false,
    },
  });

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        form.setValue('image', result);
      };
      reader.readAsDataURL(file);
    }
  }, [form]);

  const onSubmit = useCallback(async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        toast.success('Produto atualizado com sucesso!');
        setEditingProduct(null);
        resetForm();
      } else {
        if (!user) throw new Error('Usuário não autenticado');

        const productData: ProductInsert = {
          ...data,
          created_by: user.id,
        };

        await createProduct(productData);
        toast.success('Produto criado com sucesso!');
        resetForm();
      }
    } catch (err) {
      console.error('Error saving product:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar produto';
      toast.error(errorMessage, {
        description: 'Verifique os dados e tente novamente',
        duration: 5000,
      });
    }
  }, [editingProduct, user, createProduct, updateProduct]);

  const resetForm = useCallback(() => {
    form.reset();
    setImagePreview('');
  }, [form]);

  const handleSetEditingProduct = useCallback((product: Product | null) => {
    setEditingProduct(product);
    if (product) {
      setImagePreview(product.image);
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: product.rating,
        is_new: product.is_new || false,
      });
    } else {
      resetForm();
    }
  }, [form, resetForm]);

  return {
    form,
    editingProduct,
    imagePreview,
    setEditingProduct: handleSetEditingProduct,
    handleImageChange,
    onSubmit,
    resetForm,
  };
};