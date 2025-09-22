import { useState } from "react";
// Removed unused Card imports since we're using separate components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Package, Settings } from "lucide-react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useAuth } from "@/hooks/useAuth";
import type { Product, ProductInsert } from "@/lib/supabase";
import type { ProductFormData } from "@/hooks/useProductForm";
import { ProductCard } from "@/components/admin/ProductCard";
import { ProductForm } from "@/components/admin/ProductForm";
import { toast } from "sonner";

export const AdminPanel = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { user } = useAuth();
  const { products, isLoading } = useProductsQuery();
  const { createProduct, updateProduct, deleteProduct, isMutating } = useAdminProducts();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        toast.success("Produto atualizado com sucesso!");
      } else {
        if (!user) throw new Error("Usuário não autenticado");
        const productData: ProductInsert = { ...data, created_by: user.id };
        await createProduct(productData);
        toast.success("Produto criado com sucesso!");
      }
      setEditingProduct(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar produto");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (id: string) => {
    const product = products.find(p => p.id === id);
    const productName = product?.name || "este produto";
    
    if (confirm(`Tem certeza que deseja deletar "${productName}"?\n\nEsta ação não pode ser desfeita.`)) {
      try {
        await deleteProduct(id);
        toast.success(`Produto "${productName}" deletado com sucesso!`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao deletar produto");
      }
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Bem-vindo, {user?.email} • {products.length} produtos cadastrados
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">Total de Produtos</div>
              <div className="text-2xl font-bold text-blue-600">{products.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="add-product">
            <ProductForm
              editingProduct={editingProduct}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isMutating}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};