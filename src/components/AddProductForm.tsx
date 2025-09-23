import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useAdminProducts } from "@/hooks/useAdminProducts";
import type { ProductInsert } from "@/lib/supabase";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useCategoriesQuery } from "@/hooks/useCategoryQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { StarRating } from "./ui/star-rating";
import { toast } from "sonner";
import { Loader2, LoaderIcon, SaveIcon, Trash2Icon, X } from "lucide-react";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import z from "zod";
import { useProduct } from "@/hooks/useProductsQuery";
import { useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { ImageUpload } from "./ImageUpload";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().min(0, "Preço deve ser maior ou igual a 0"),
  image: z.string().min(1, "Imagem é obrigatória"),
  category_id: z.string().min(1, "Categoria é obrigatória"),
  rating: z.number().int().min(0).max(5).default(3),
});

type ProductFormData = z.infer<typeof productSchema>;

export function AddProductForm({ id }: { id?: string }) {
  const { data: product, isLoading, isFetching } = useProduct(id || "");
  const { data: categories, isLoading: isCategoriesLoading } =
    useCategoriesQuery();
  const { deleteProduct, createProduct, updateProduct, isMutating } =
    useAdminProducts();
  const canGoBack = useCanGoBack();
  const router = useRouter();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      rating: 3,
    },
  });

  useEffect(() => {
    form.reset({ ...product });
  }, [product, form]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (product) {
        await updateProduct(product.id, data);
        toast.success("Produto atualizado com sucesso!");
      } else {
        const productData: ProductInsert = {
          ...data,
        };

        await createProduct(productData);
        toast.success("Produto criado com sucesso!");
      }
      form.reset();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar produto",
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(product?.id || "");
      toast.success("Produto deletado com sucesso!");
      router.history.back();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao deletar produto",
      );
    }
  };

  return (
    <div className="min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {product ? "Editar Produto" : "Adicionar Novo Produto"}
          </CardTitle>
          <CardDescription>
            {product
              ? "Atualize as informações do produto"
              : "Preencha as informações do novo produto"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading || isFetching ? (
            <div className="min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-center">
                <LoaderIcon className="size-8 animate-spin" />
              </div>
            </div>
          ) : (
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
                          {isCategoriesLoading ? (
                            <LoaderIcon className="size-8 animate-spin self-auto" />
                          ) : (
                            <>
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
                            </>
                          )}
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Imagem do Produto</FormLabel>
                      <FormControl>
                        <ImageUpload
                          onImageUpload={(url) => {
                            field.onChange(url);
                          }}
                          onImageRemove={() => {
                            field.onChange("");
                          }}
                          currentImageUrl={field.value}
                          productId={product?.id}
                          disabled={isMutating}
                        />
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
                <div className="grid grid-cols-3 gap-3 col-span-full">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!canGoBack}
                    onClick={() => router.history.back()}
                  >
                    <X />
                    Voltar
                  </Button>
                  {product && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => handleDelete}
                        >
                          <Trash2Icon /> Deletar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Tem certeza que deseja deletar este produto?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá
                            permanentemente o producto de nossos servidores.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete()}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  <Button type="submit" disabled={isMutating}>
                    {isMutating && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    <SaveIcon />
                    {product ? "Atualizar Produto" : "Criar Produto"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
