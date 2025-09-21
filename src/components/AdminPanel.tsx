import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import type { Product, ProductInsert } from "@/lib/supabase";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().min(0, "Preço deve ser maior ou igual a 0"),
  image: z.string().url("URL da imagem inválida"),
  category: z.string().min(1, "Categoria é obrigatória"),
  rating: z.number().min(0).max(5).optional(),
  is_new: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AdminPanelProps {
  onLogout?: () => void;
}

export const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { user, signOut } = useAuth();
  const { products, isLoading } = useProductsQuery();
  const { createProduct, updateProduct, deleteProduct, isMutating } =
    useAdminProducts();
  const toast = useToast();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: "",
      category: "",
      rating: undefined,
      is_new: false,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        toast.success("Produto atualizado com sucesso!");
        setEditingProduct(null);
        form.reset();
      } else {
        if (!user) throw new Error("Usuário não autenticado");

        const productData: ProductInsert = {
          ...data,
          created_by: user.id,
        };

        await createProduct(productData);
        toast.success("Produto criado com sucesso!");
        form.reset();
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar produto",
      );
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating,
      is_new: product.is_new || false,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      try {
        await deleteProduct(id);
        toast.success("Produto deletado com sucesso!");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Erro ao deletar produto",
        );
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onLogout?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao fazer logout");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Painel Administrativo
              </h1>
              <p className="text-sm text-gray-600">Bem-vindo, {user?.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <toast.ToastComponent />

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="add-product">Adicionar Produto</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <div className="flex gap-1">
                        {product.is_new && (
                          <Badge variant="secondary">Novo</Badge>
                        )}
                        {product.rating && (
                          <Badge variant="outline">⭐ {product.rating}</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">
                        R$ {product.price}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add-product">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}
                </CardTitle>
                <CardDescription>
                  {editingProduct
                    ? "Atualize as informações do produto"
                    : "Preencha as informações do novo produto"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        {...form.register("name")}
                        disabled={isMutating}
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Preço *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        {...form.register("price", { valueAsNumber: true })}
                        disabled={isMutating}
                      />
                      {form.formState.errors.price && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.price.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea
                      id="description"
                      {...form.register("description")}
                      disabled={isMutating}
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="image">URL da Imagem *</Label>
                      <Input
                        id="image"
                        {...form.register("image")}
                        disabled={isMutating}
                      />
                      {form.formState.errors.image && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.image.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria *</Label>
                      <Input
                        id="category"
                        {...form.register("category")}
                        disabled={isMutating}
                      />
                      {form.formState.errors.category && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.category.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rating">Avaliação (0-5)</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        {...form.register("rating", { valueAsNumber: true })}
                        disabled={isMutating}
                      />
                      {form.formState.errors.rating && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.rating.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="is_new">Produto Novo</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          id="is_new"
                          type="checkbox"
                          {...form.register("is_new")}
                          disabled={isMutating}
                          className="rounded"
                        />
                        <span className="text-sm">
                          Marcar como novo produto
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={isMutating}>
                      {isMutating && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingProduct ? "Atualizar Produto" : "Criar Produto"}
                    </Button>

                    {editingProduct && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(null);
                          form.reset();
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

