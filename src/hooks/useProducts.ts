import { useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '@/data/products';
import { PRODUCT_CATEGORIES } from '@/types/product';
import { fetchProductsFromGoogleSheet } from '@/lib/googleSheets';

export const useProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [remoteProducts, setRemoteProducts] = useState<typeof PRODUCTS | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchProductsFromGoogleSheet().then((list) => {
      if (!isMounted) return;
      if (Array.isArray(list) && list.length > 0) {
        setRemoteProducts(list as typeof PRODUCTS);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const allProducts = remoteProducts ?? PRODUCTS;

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return allProducts;
    }

    const categoryName = PRODUCT_CATEGORIES.find(
      (cat) => cat.id === selectedCategory
    )?.name;

    return allProducts.filter((product) => product.category === categoryName);
  }, [selectedCategory, allProducts]);

  const categories = PRODUCT_CATEGORIES;

  return {
    products: filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    totalProducts: allProducts.length,
  };
};
