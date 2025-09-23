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
import {
  Loader2,
  LoaderIcon,
  SaveIcon,
  Trash2Icon,
  X,
  Upload,
  ImageIcon,
} from "lucide-react";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import z from "zod";
import { useProduct } from "@/hooks/useProductsQuery";
import { useEffect, useState, useCallback } from "react";
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
import { useDropzone } from "react-dropzone";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().min(0, "Preço deve ser maior ou igual a 0"),
  category_id: z.string().min(1, "Categoria é obrigatória"),
  rating: z.number().int().min(0).max(5).default(3),
});

type ProductFormData = z.infer<typeof productSchema>;

export function AddProductForm({ id }: { id?: string }) {
  const { data: product, isLoading, isFetching } = useProduct(id || "");
  const { data: categories, isLoading: isCategoriesLoading } =
    useCategoriesQuery();
  const {
    deleteProduct,
    createProductWithImages,
    updateProductWithImages,
    isMutating,
  } = useAdminProducts();
  const canGoBack = useCanGoBack();
  const router = useRouter();

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedImages(acceptedFiles);
    const previews: string[] = [];

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target?.result as string);
        if (previews.length === acceptedFiles.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      },
      maxFiles: 10,
      maxSize: 5 * 1024 * 1024, // 5MB per file
      multiple: true,
    });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      rating: 3,
    },
  });

  useEffect(() => {
    if (product && !isCategoriesLoading && categories) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category_id,
        rating: product.rating,
      });
      setImagePreviews(product.images || []);
    }
  }, [product, form, isCategoriesLoading, categories]);

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const clearAllImages = () => {
    setSelectedImages([]);
    setImagePreviews(product?.images || []);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (product) {
        // Update existing product
        if (selectedImages.length > 0) {
          await updateProductWithImages(product.id, data, selectedImages);
        } else {
          await updateProductWithImages(product.id, data);
        }
        toast.success("Produto atualizado com sucesso!");
      } else {
        // Create new product - at least one image is REQUIRED
        if (selectedImages.length === 0) {
          toast.error(
            "Por favor, selecione pelo menos uma imagem para o produto",
          );
          return;
        }
        await createProductWithImages(data, selectedImages);
        toast.success("Produto criado com sucesso!");
      }
      form.reset();
      setSelectedImages([]);
      setImagePreviews([]);
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
          {isLoading || isFetching || isCategoriesLoading ? (
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
                        {isCategoriesLoading ? (
                          <div className="flex items-center justify-center p-4">
                            <LoaderIcon className="size-4 animate-spin mr-2" />
                            <span className="text-sm text-muted-foreground">Carregando categorias...</span>
                          </div>
                        ) : (
                          <Select
                            key={`select-${categories?.length || 0}-${field.value}`}
                            onValueChange={field.onChange}
                            value={field.value}
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
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    )}
                />
                <FormItem className="col-span-full">
                  <FormLabel>
                    Imagens do Produto
                    {!product && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                  <div className="space-y-4">
                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div
                            key={`preview-${index}-${preview.slice(-10)}`}
                            className="relative"
                          >
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 rounded-full p-1 h-6 w-6"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Dropzone */}
                    <div
                      {...getRootProps()}
                      className={`
                        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                        ${
                          isDragActive && !isDragReject
                            ? "border-primary bg-primary/5"
                            : isDragReject
                              ? "border-red-500 bg-red-50"
                              : !product && selectedImages.length === 0
                                ? "border-red-300 bg-red-50 hover:border-red-400"
                                : "border-border hover:border-primary"
                        }
                      `}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center gap-2">
                        {isDragActive ? (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 text-primary" />
                            <p className="text-primary font-medium">
                              {isDragReject
                                ? "Arquivo não suportado"
                                : "Solte as imagens aqui..."}
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {selectedImages.length > 0
                                  ? "Adicionar mais imagens"
                                  : "Arraste imagens aqui ou clique para selecionar"}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Formatos aceitos: JPG, PNG, WebP
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Máximo 10 imagens, 5MB cada
                                {!product && (
                                  <span className="text-red-500 ml-1">
                                    * Pelo menos uma imagem obrigatória
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selected Files Info */}
                    {selectedImages.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {selectedImages.length} imagem
                            {selectedImages.length > 1 ? "ns" : ""} selecionada
                            {selectedImages.length > 1 ? "s" : ""}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={clearAllImages}
                          >
                            Limpar todas
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                          {selectedImages.map((file, index) => (
                            <div
                              key={`file-${index}-${file.name}`}
                              className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-muted rounded"
                            >
                              <ImageIcon className="h-4 w-4" />
                              <span className="flex-1 truncate">
                                {file.name}
                              </span>
                              <span className="text-xs">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </FormItem>
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
                  <Button
                    type="submit"
                    disabled={
                      isMutating || (!product && selectedImages.length === 0)
                    }
                  >
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
