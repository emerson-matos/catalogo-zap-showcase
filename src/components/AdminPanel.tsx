import { Loader2, PencilIcon } from "lucide-react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useAuth } from "@/hooks/useAuth";
import { useAdminProductFilters } from "@/hooks/useAdminProductFilters";
import { useProductSort } from "@/hooks/useProductSort";
import ProductCard from "./ProductCard";
import { AdminFilters } from "./AdminFilters";
import { AdminSort } from "./AdminSort";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

export const AdminPanel = () => {
  const { user } = useAuth();
  const { products, isLoading } = useProductsQuery();
  
  // Filters and sorting
  const {
    filters,
    setFilters,
    priceRange,
    filteredProducts,
    resetFilters,
    categories,
  } = useAdminProductFilters(products);
  
  const {
    sortOption,
    setSortOption,
    sortedProducts,
  } = useProductSort(filteredProducts);

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <AdminFilters
          filters={filters}
          setFilters={setFilters}
          priceRange={priceRange}
          categories={categories}
          resetFilters={resetFilters}
          totalProducts={products.length}
          filteredCount={sortedProducts.length}
        />

        {/* Sort */}
        <AdminSort
          sortOption={sortOption}
          setSortOption={setSortOption}
          totalProducts={sortedProducts.length}
        />

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {products.length === 0 
                ? "Nenhum produto cadastrado ainda." 
                : "Nenhum produto encontrado com os filtros aplicados."}
            </p>
            {products.length === 0 && (
              <Button asChild className="mt-4">
                <Link to="/admin/products">
                  <PencilIcon className="size-4 mr-2" />
                  Cadastrar primeiro produto
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
