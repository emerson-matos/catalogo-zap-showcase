import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2, Edit, Trash2, LoaderIcon } from "lucide-react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useAuth } from "@/hooks/useAuth";
import type { Product, ProductInsert } from "@/lib/supabase";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { toast } from "sonner";
import { useCategoriesQuery } from "@/hooks/useCategoryQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { StarRating } from "./ui/star-rating";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().min(0, "Preço deve ser maior ou igual a 0"),
  image: z.url("URL da imagem inválida"),
  category_id: z.string().min(1, "Categoria é obrigatória"),
  rating: z.number().int().min(0).max(5).default(3),
});

type ProductFormData = z.infer<typeof productSchema>;

export const AdminPanel = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { user } = useAuth();
  const { data: categories, isLoading: isCategoriesLoading } =
    useCategoriesQuery();
  const { products, isLoading } = useProductsQuery();
  const { createProduct, updateProduct, deleteProduct, isMutating } =
    useAdminProducts();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: "",
      category_id: "",
      rating: 3,
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
      category_id: product.category_id,
      rating: product.rating,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-accent">
                Painel Administrativo
              </h1>
              <p className="text-sm text-accent-foreground">
                Bem-vindo, {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 grid grid-cols-2 gap-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Avaliação (0-5 estrelas)</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {isCategoriesLoading ? (
                      <LoaderIcon />
                    ) : (
                      <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                  {(categories || []).map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                      {c.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL da Imagem</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      className="col-span-full"
                      type="submit"
                      disabled={isMutating}
                    >
                      {isMutating && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingProduct ? "Atualizar Produto" : "Criar Produto"}
                    </Button>

                    {editingProduct && (
                      <Button
                        className="col-span-full"
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
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
