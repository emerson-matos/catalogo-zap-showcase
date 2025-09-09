import { useEffect, useMemo, useState } from "react";
import { fetchProductsFromGoogleSheet } from "@/lib/googleSheets";
import { Product } from "@/types/product";

export const useProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState(["todos"]);

  useEffect(() => {
    let isMounted = true;
    fetchProductsFromGoogleSheet().then((list) => {
      if (!isMounted) return;
      if (Array.isArray(list) && list.length > 0) {
        setAllProducts(list as Product[]);
        setCategories(Array.from(new Set(list.map((i) => i.category))));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "todos") {
      return allProducts;
    }

    const categoryName = categories.find((it) => it === selectedCategory);

    return allProducts.filter((product) => product.category === categoryName);
  }, [selectedCategory, allProducts, categories]);

  return {
    products: filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    totalProducts: allProducts.length,
  };
};
