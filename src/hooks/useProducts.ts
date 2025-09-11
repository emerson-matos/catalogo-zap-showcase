import { useEffect, useMemo, useState } from "react";
import { fetchProductsFromGoogleSheet } from "@/lib/googleSheets";
import { Product } from "@/types/product";

export const useProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState(["todos"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await fetchProductsFromGoogleSheet();
        
        if (!isMounted) return;
        
        if (Array.isArray(list) && list.length > 0) {
          setAllProducts(list as Product[]);
          const uniqueCategories = Array.from(
            new Set(
              list
                .map((item) => String(item.category || '').trim())
                .filter((name) => name.length > 0)
            )
          );
          const withoutTodos = uniqueCategories.filter(
            (name) => name.toLowerCase() !== "todos"
          );
          withoutTodos.sort((a, b) => a.localeCompare(b));
          setCategories(["todos", ...withoutTodos]);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "todos") {
      return allProducts;
    }

    const categoryName = categories.find((it: string) => it === selectedCategory);

    return allProducts.filter((product: Product) => product.category === categoryName);
  }, [selectedCategory, allProducts, categories]);

  return {
    products: filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    totalProducts: allProducts.length,
    loading,
    error,
  };
};
