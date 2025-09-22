import React from 'react';
import { Plus, Upload, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PRODUCT_CATEGORIES, FORM_LABELS } from '@/constants/admin';
import type { ProductFormData } from '@/hooks/useProductForm';

interface ProductFormProps {
  form: ReturnType<typeof useForm<ProductFormData>>;
  editingProduct: any;
  imagePreview: string;
  isMutating: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  form,
  editingProduct,
  imagePreview,
  isMutating,
  onImageChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
        </CardTitle>
        <CardDescription>
          {editingProduct
            ? 'Atualize as informações do produto'
            : 'Preencha as informações do novo produto'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>{FORM_LABELS.NAME}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>{FORM_LABELS.PRICE} *</FormLabel>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...form.register('price', { valueAsNumber: true })}
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
              <FormLabel>{FORM_LABELS.DESCRIPTION} *</FormLabel>
              <Textarea
                id="description"
                {...form.register('description')}
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
                <FormLabel>{FORM_LABELS.IMAGE} *</FormLabel>
                <div className="space-y-2">
                  <Input
                    id="image"
                    placeholder={FORM_LABELS.IMAGE_PLACEHOLDER}
                    {...form.register('image')}
                    disabled={isMutating}
                    onChange={(e) => {
                      form.register('image').onChange(e);
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onImageChange}
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
                    <FormLabel>{FORM_LABELS.CATEGORY} *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={FORM_LABELS.CATEGORY_PLACEHOLDER} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
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
                    <FormLabel>{FORM_LABELS.RATING}</FormLabel>
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
                    <FormLabel>{FORM_LABELS.IS_NEW}</FormLabel>
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
                {editingProduct ? 'Atualizar Produto' : 'Criar Produto'}
              </Button>

              {editingProduct && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};