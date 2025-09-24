import { Loader2, PencilIcon } from "lucide-react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useAuth } from "@/hooks/useAuth";
import ProductGrid from "./ProductGrid";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

export const AdminPanel = () => {
  const { user } = useAuth();
  const { 
    products, 
    isLoading, 
    isFetching, 
    error, 
    isError, 
    refetch, 
    isEmpty, 
    isStale 
  } = useProductsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const adminActions = (
    <div className="shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <p className="text-sm text-muted-foreground">
              Bem-vindo, {user?.email}
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/products">
              <PencilIcon className="size-4" />
              cadastrar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <ProductGrid
        products={products}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        isError={isError}
        isEmpty={isEmpty}
        isStale={isStale}
        onRefetch={refetch}
        title="Produtos"
        subtitle="Gerencie todos os produtos da sua loja"
        showStatistics={false}
        isAdmin={true}
        adminActions={adminActions}
        searchPlaceholder="Buscar produtos por nome ou descrição..."
        emptyStateMessage="Nenhum produto cadastrado ainda."
        emptyStateAction={
          <Button asChild>
            <Link to="/admin/products">
              <PencilIcon className="size-4 mr-2" />
              Cadastrar primeiro produto
            </Link>
          </Button>
        }
      />
    </div>
  );
};
