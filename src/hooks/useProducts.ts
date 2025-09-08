import { useState, useMemo } from 'react';
import { PRODUCTS } from '@/data/products';
import { PRODUCT_CATEGORIES } from '@/types/product';

export const useProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return PRODUCTS;
    }
    
    const categoryName = PRODUCT_CATEGORIES.find(
      cat => cat.id === selectedCategory
    )?.name;
    
    return PRODUCTS.filter(product => product.category === categoryName);
  }, [selectedCategory]);

  const categories = PRODUCT_CATEGORIES;

  return {
    products: filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    totalProducts: PRODUCTS.length,
  };
};
