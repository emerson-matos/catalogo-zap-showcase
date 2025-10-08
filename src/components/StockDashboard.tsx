import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { AlertTriangle, Package, TrendingDown, TrendingUp, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const StockDashboard = () => {
  const { products, isLoading, isError, error } = useProductsQuery();

  const stockMetrics = useMemo(() => {
    if (!products || products.length === 0) {
      return {
        totalProducts: 0,
        totalStock: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        totalInventoryValue: 0,
        averageStock: 0,
        lowStockProducts: [],
        outOfStockProducts: [],
      };
    }

    const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
    const totalInventoryValue = products.reduce(
      (sum, product) => sum + product.price * (product.stock || 0),
      0
    );
    const lowStockProducts = products.filter(
      (product) => (product.stock || 0) > 0 && (product.stock || 0) <= 10
    );
    const outOfStockProducts = products.filter((product) => (product.stock || 0) === 0);
    const averageStock = products.length > 0 ? totalStock / products.length : 0;

    return {
      totalProducts: products.length,
      totalStock,
      lowStockItems: lowStockProducts.length,
      outOfStockItems: outOfStockProducts.length,
      totalInventoryValue,
      averageStock,
      lowStockProducts,
      outOfStockProducts,
    };
  }, [products]);

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error || "Erro ao carregar métricas de estoque"}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockMetrics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              produtos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockMetrics.totalStock}</div>
            <p className="text-xs text-muted-foreground">
              unidades em estoque
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor do Inventário</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stockMetrics.totalInventoryValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              valor total em estoque
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockMetrics.averageStock.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              unidades por produto
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Estoque Baixo
            </CardTitle>
            <CardDescription>
              {stockMetrics.lowStockItems} produtos com estoque baixo (≤10 unidades)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stockMetrics.lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum produto com estoque baixo</p>
            ) : (
              <div className="space-y-2">
                {stockMetrics.lowStockProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <span className="text-sm font-medium truncate">{product.name}</span>
                    <span className="text-sm text-yellow-600 font-semibold">
                      {product.stock} un.
                    </span>
                  </div>
                ))}
                {stockMetrics.lowStockProducts.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{stockMetrics.lowStockProducts.length - 5} produtos
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Sem Estoque
            </CardTitle>
            <CardDescription>
              {stockMetrics.outOfStockItems} produtos sem estoque
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stockMetrics.outOfStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum produto sem estoque</p>
            ) : (
              <div className="space-y-2">
                {stockMetrics.outOfStockProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <span className="text-sm font-medium truncate">{product.name}</span>
                    <span className="text-sm text-red-600 font-semibold">0 un.</span>
                  </div>
                ))}
                {stockMetrics.outOfStockProducts.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{stockMetrics.outOfStockProducts.length - 5} produtos
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
