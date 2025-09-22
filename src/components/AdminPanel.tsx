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
import { Loader2, Edit, Trash2, Plus, Package, Settings } from "lucide-react";
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

export const AdminPanel = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { user } = useAuth();
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
    const product = products.find(p => p.id === id);
    const productName = product?.name || "este produto";
    
    if (confirm(`Tem certeza que deseja deletar "${productName}"?\n\nEsta ação não pode ser desfeita.`)) {
      try {
        await deleteProduct(id);
        toast.success(`Produto "${productName}" deletado com sucesso!`);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Erro ao deletar produto",
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Carregando produtos...</h2>
          <p className="text-gray-600">Aguarde enquanto buscamos os dados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Painel Administrativo
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Bem-vindo, {user?.email} • {products.length} produtos cadastrados
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Total de Produtos</div>
                <div className="text-2xl font-bold text-blue-600">{products.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Gerenciar Produtos</span>
            </TabsTrigger>
            <TabsTrigger value="add-product" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Adicionar Produto</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Produtos Cadastrados</h2>
              <div className="text-sm text-gray-500">
                {products.length} produto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
              </div>
            </div>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto cadastrado</h3>
                <p className="mt-1 text-sm text-gray-500">Comece adicionando seu primeiro produto.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="aspect-square relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBuw6NvIGVuY29udHJhZGE8L3RleHQ+PC9zdmc+';
                        }}
                      />
                      {product.is_new && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">Novo</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{product.name}</h3>
                        <div className="flex gap-1 ml-2">
                          {product.rating && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                              ⭐ {product.rating}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-lg text-gray-900">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </span>
                          <div className="text-xs text-gray-500 capitalize">{product.category}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(product.id)}
                            className="hover:bg-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="add-product">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center space-x-2">
                  {editingProduct ? (
                    <>
                      <Edit className="h-5 w-5 text-blue-600" />
                      <span>Editar Produto</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 text-green-600" />
                      <span>Adicionar Novo Produto</span>
                    </>
                  )}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {editingProduct
                    ? "Atualize as informações do produto abaixo"
                    : "Preencha todas as informações necessárias para criar um novo produto"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Nome do Produto *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Ex: Smartphone Samsung Galaxy"
                                disabled={isMutating}
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
                          <FormItem className="space-y-2">
                            <FormLabel>Preço *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                disabled={isMutating}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Descrição *</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Descreva as características e benefícios do produto..."
                              disabled={isMutating}
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>URL da Imagem *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="https://exemplo.com/imagem.jpg"
                                disabled={isMutating}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Categoria *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Ex: Eletrônicos, Cosméticos, Bebidas"
                                disabled={isMutating}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Avaliação (0-5)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                placeholder="4.5"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                disabled={isMutating}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="is_new"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Produto Novo</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={field.value || false}
                                  onChange={(e) => field.onChange(e.target.checked)}
                                  disabled={isMutating}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-sm">
                                  Marcar como novo produto
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-4 pt-4 border-t">
                      <Button 
                        type="submit" 
                        disabled={isMutating}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                      >
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
                          className="px-6 py-2"
                        >
                          Cancelar Edição
                        </Button>
                      )}
                    </div>
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
