import { Loader2, PencilIcon, Database } from "lucide-react";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { useAuth } from "@/hooks/useAuth";
import ProductCard from "./ProductCard";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";
import { ImageMigrationPanel } from "./ImageMigrationPanel";
import { useState } from "react";

export const AdminPanel = () => {
  const { user } = useAuth();
  const { products, isLoading } = useProductsQuery();
  const [activeTab, setActiveTab] = useState<'products' | 'migration'>('products');

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
            <div className="flex gap-2">
              <Button 
                variant={activeTab === 'products' ? 'default' : 'outline'}
                onClick={() => setActiveTab('products')}
              >
                <PencilIcon className="size-4 mr-2" />
                Produtos
              </Button>
              <Button 
                variant={activeTab === 'migration' ? 'default' : 'outline'}
                onClick={() => setActiveTab('migration')}
              >
                <Database className="size-4 mr-2" />
                Migração
              </Button>
              <Button asChild>
                <Link to="/admin/products">
                  <PencilIcon className="size-4" />
                  cadastrar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <ImageMigrationPanel />
        )}
      </div>
    </div>
  );
};
