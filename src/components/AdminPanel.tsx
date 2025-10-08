import { PencilIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ProductGrid from "./ProductGrid";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";
import { StockDashboard } from "./StockDashboard";

export const AdminPanel = () => {
  const { user } = useAuth();

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
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Métricas de Estoque</h2>
          <StockDashboard />
        </div>
      </div>
      
      <ProductGrid />
    </div>
  );
};
