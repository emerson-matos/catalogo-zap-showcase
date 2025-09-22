import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Edit, Plus } from "lucide-react";
import type { Product } from "@/lib/supabase";
import type { ProductFormData } from "@/hooks/useProductForm";
import { useProductForm } from "@/hooks/useProductForm";

interface ProductFormProps {
  editingProduct: Product | null;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ProductForm = ({ editingProduct, onSubmit, onCancel, isSubmitting }: ProductFormProps) => {
  const { form } = useProductForm();

  return (
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Smartphone Samsung Galaxy" disabled={isSubmitting} />
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
                    <FormLabel>Preço *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        disabled={isSubmitting}
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
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Descreva as características e benefícios do produto..."
                      disabled={isSubmitting}
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
                  <FormItem>
                    <FormLabel>URL da Imagem *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://exemplo.com/imagem.jpg" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Eletrônicos, Cosméticos, Bebidas" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
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
                      placeholder="4.5"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4 border-t">
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingProduct ? "Atualizar Produto" : "Criar Produto"}
              </Button>
              {editingProduct && (
                <Button type="button" variant="outline" onClick={onCancel} className="px-6 py-2">
                  Cancelar Edição
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};