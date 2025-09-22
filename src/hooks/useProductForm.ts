import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Product } from "@/lib/supabase";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().min(0, "Preço deve ser maior ou igual a 0"),
  image: z.string().url("URL da imagem inválida"),
  category: z.string().min(1, "Categoria é obrigatória"),
  rating: z.number().min(0).max(5).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const useProductForm = () => {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: "",
      category: "",
      rating: undefined,
    },
  });

  const resetForm = () => {
    form.reset({
      name: "",
      description: "",
      price: 0,
      image: "",
      category: "",
      rating: undefined,
    });
  };

  const populateForm = (product: Product) => {
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating,
    });
  };

  return { form, resetForm, populateForm };
};