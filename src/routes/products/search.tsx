import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategoriesQuery } from "@/hooks/useCategoryQuery";

export const Route = createFileRoute("/products/search")({
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: (search.q as string) || "",
      category: (search.category as string) || undefined,
      minPrice: Number(search.minPrice) || undefined,
      maxPrice: Number(search.maxPrice) || undefined,
    };
  },
});

function SearchPage() {
  const { q, category, minPrice, maxPrice } = Route.useSearch();
  const { products, isLoading, error } = useProductsQuery();
  const [searchQuery, setSearchQuery] = useState(q);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const { data: categories, isLoading: categoriesLoading } =
    useCategoriesQuery();
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !selectedCategory || product.category_id === selectedCategory;

      const matchesPrice =
        (!minPrice || product.price >= minPrice) &&
        (!maxPrice || product.price <= maxPrice);

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, selectedCategory, minPrice, maxPrice]);

  if (isLoading || categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-muted rounded mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Erro ao carregar produtos</h2>
        <p className="text-muted-foreground">Tente recarregar a página</p>
      </div>
    );
  }
  const cateSleecteed = (categories || []).find(
    (c) => c.id === selectedCategory,
  );
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Buscar Produtos</h1>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(undefined)}
          >
            Todas as categorias
          </Button>
          {(categories || []).map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            {filteredProducts.length} produto
            {filteredProducts.length !== 1 ? "s" : ""} encontrado
            {filteredProducts.length !== 1 ? "s" : ""}
            {searchQuery && ` para "${searchQuery}"`}
            {selectedCategory && ` na categoria "${cateSleecteed.name}"`}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros ou buscar por outros termos
          </p>
        </div>
      )}
    </div>
  );
}

