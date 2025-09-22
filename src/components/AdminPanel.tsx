import { useState, useMemo } from "react";
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
import { 
  Loader2, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Plus, 
  Grid3X3, 
  List,
  Download,
  Upload,
  Eye,
  EyeOff
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const { user } = useAuth();
  const { products, isLoading } = useProductsQuery();
  const { createProduct, updateProduct, deleteProduct, isMutating } =
    useAdminProducts();

  // Filter products based on search, category, and new status
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesNew = !showNewOnly || product.is_new;
      
      return matchesSearch && matchesCategory && matchesNew;
    });
  }, [products, searchQuery, selectedCategory, showNewOnly]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
    return ["all", ...uniqueCategories];
  }, [products]);

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
        setImagePreview("");
      } else {
        if (!user) throw new Error("Usuário não autenticado");

        const productData: ProductInsert = {
          ...data,
          created_by: user.id,
        };

        await createProduct(productData);
        toast.success("Produto criado com sucesso!");
        form.reset();
        setImagePreview("");
      }
    } catch (err) {
      console.error("Error saving product:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro ao salvar produto";
      toast.error(errorMessage, {
        description: "Verifique os dados e tente novamente",
        duration: 5000,
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
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
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, we'll create a preview URL and still use URL input
      // In a real app, you'd upload to a service like Cloudinary or Supabase Storage
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        form.setValue("image", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      try {
        await deleteProduct(id);
        toast.success("Produto deletado com sucesso!");
        // Remove from selected products if it was selected
        const newSelected = new Set(selectedProducts);
        newSelected.delete(id);
        setSelectedProducts(newSelected);
        if (newSelected.size === 0) {
          setShowBulkActions(false);
        }
      } catch (err) {
        console.error("Error deleting product:", err);
        const errorMessage = err instanceof Error ? err.message : "Erro ao deletar produto";
        toast.error(errorMessage, {
          description: "Tente novamente ou contate o suporte",
          duration: 5000,
        });
      }
    }
  };

  const handleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;
    
    if (confirm(`Tem certeza que deseja deletar ${selectedProducts.size} produtos? Esta ação não pode ser desfeita.`)) {
      setIsBulkDeleting(true);
      try {
        const deletePromises = Array.from(selectedProducts).map(id => deleteProduct(id));
        await Promise.all(deletePromises);
        toast.success(`${selectedProducts.size} produtos deletados com sucesso!`);
        setSelectedProducts(new Set());
        setShowBulkActions(false);
      } catch (err) {
        console.error("Error bulk deleting products:", err);
        const errorMessage = err instanceof Error ? err.message : "Erro ao deletar produtos";
        toast.error(errorMessage, {
          description: "Alguns produtos podem não ter sido deletados. Verifique e tente novamente.",
          duration: 5000,
        });
      } finally {
        setIsBulkDeleting(false);
      }
    }
  };

  const handleExportProducts = () => {
    const productsToExport = filteredProducts.filter(p => selectedProducts.has(p.id));
    const csvContent = [
      ["Nome", "Descrição", "Preço", "Categoria", "Avaliação", "Novo"],
      ...productsToExport.map(p => [
        p.name,
        p.description,
        p.price.toString(),
        p.category,
        p.rating?.toString() || "",
        p.is_new ? "Sim" : "Não"
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `produtos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Produtos exportados com sucesso!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="shadow-sm border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Painel Administrativo
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Bem-vindo, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {filteredProducts.length} produtos
              </Badge>
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
            {/* Search and Filter Controls */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Buscar produtos..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category === "all" ? "Todas" : category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant={showNewOnly ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowNewOnly(!showNewOnly)}
                      >
                        {showNewOnly ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                        Novos
                      </Button>
                      <div className="flex border rounded-md">
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("grid")}
                          className="rounded-r-none"
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("list")}
                          className="rounded-l-none"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bulk Actions */}
                  {showBulkActions && (
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-blue-900">
                          {selectedProducts.size} produto(s) selecionado(s)
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSelectAll}
                        >
                          {selectedProducts.size === filteredProducts.length ? "Desmarcar Todos" : "Selecionar Todos"}
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExportProducts}
                          disabled={selectedProducts.size === 0}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Exportar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleBulkDelete}
                          disabled={selectedProducts.size === 0 || isBulkDeleting}
                        >
                          {isBulkDeleting ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          {isBulkDeleting ? "Deletando..." : "Deletar"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Nenhum produto encontrado
                    </h3>
                    <p className="text-gray-500 mt-1">
                      {searchQuery || selectedCategory !== "all" || showNewOnly
                        ? "Tente ajustar os filtros de busca"
                        : "Adicione seu primeiro produto"}
                    </p>
                  </div>
                  {(!searchQuery && selectedCategory === "all" && !showNewOnly) && (
                    <Button onClick={() => setEditingProduct(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Produto
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "space-y-4"
              }>
                {filteredProducts.map((product) => (
                <Card key={product.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${
                  viewMode === "list" ? "flex flex-row" : ""
                } ${selectedProducts.has(product.id) ? "ring-2 ring-blue-500" : ""}`}>
                  <div className={`${viewMode === "grid" ? "aspect-square relative" : "w-32 h-32 flex-shrink-0 relative"}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold ${viewMode === "list" ? "text-lg" : "text-lg"}`}>
                        {product.name}
                      </h3>
                      <div className="flex gap-1">
                        {product.is_new && (
                          <Badge variant="secondary" className="text-xs">Novo</Badge>
                        )}
                        {product.rating && (
                          <Badge variant="outline" className="text-xs">⭐ {product.rating}</Badge>
                        )}
                      </div>
                    </div>
                    <p className={`text-sm text-gray-600 mb-2 ${
                      viewMode === "list" ? "line-clamp-2" : "line-clamp-3"
                    }`}>
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {product.category}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                          className="h-8 w-8 p-0"
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
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}
                </CardTitle>
                <CardDescription>
                  {editingProduct
                    ? "Atualize as informações do produto"
                    : "Preencha as informações do novo produto"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
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
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-2">
                        <FormLabel>Preço *</FormLabel>
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
                      <FormLabel>Descrição *</FormLabel>
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
                        <FormLabel>Imagem do Produto *</FormLabel>
                        <div className="space-y-2">
                          <Input
                            id="image"
                            placeholder="URL da imagem ou faça upload"
                            {...form.register("image")}
                            disabled={isMutating}
                            onChange={(e) => {
                              form.register("image").onChange(e);
                              setImagePreview(e.target.value);
                            }}
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                              id="image-upload"
                              disabled={isMutating}
                            />
                            <label
                              htmlFor="image-upload"
                              className="px-3 py-2 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                            >
                              <Upload className="h-4 w-4 inline mr-2" />
                              Upload
                            </label>
                          </div>
                          {imagePreview && (
                            <div className="mt-2">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-20 h-20 object-cover rounded-md border"
                              />
                            </div>
                          )}
                        </div>
                        {form.formState.errors.image && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.image.message}
                          </p>
                        )}
                      </div>

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Categoria *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                                <SelectItem value="Cosméticos">Cosméticos</SelectItem>
                                <SelectItem value="Bebidas">Bebidas</SelectItem>
                                <SelectItem value="Roupas">Roupas</SelectItem>
                                <SelectItem value="Casa">Casa</SelectItem>
                                <SelectItem value="Esportes">Esportes</SelectItem>
                                <SelectItem value="Livros">Livros</SelectItem>
                                <SelectItem value="Outros">Outros</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        className="space-y-2"
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Avaliação (0-5)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                disabled={isMutating}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        className="space-y-2"
                        control={form.control}
                        name="is_new"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Produto Novo</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={field.value || false}
                                  onChange={(e) => field.onChange(e.target.checked)}
                                  disabled={isMutating}
                                  className="h-4 w-4"
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
                        className="bg-blue-600 hover:bg-blue-700"
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
                            setImagePreview("");
                          }}
                        >
                          Cancelar
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
