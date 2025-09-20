import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, ArrowRight, Search } from "lucide-react";

/**
 * Example component demonstrating different ways to access product details
 * This is for demonstration purposes - you can use these patterns in your components
 */
export const ProductNavigationExamples = () => {
  const navigate = useNavigate();

  // Example product IDs (replace with real product IDs from your data)
  const exampleProducts = [
    { id: "1", name: "Skincare Serum" },
    { id: "2", name: "Moisturizer" },
    { id: "3", name: "Cleanser" },
  ];

  const handleNavigateToProduct = (productId: string) => {
    navigate({ 
      to: "/products/$productId", 
      params: { productId } 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Ways to Access Product Details
      </h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Method 1: Direct Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Direct Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use Link component for navigation
            </p>
            <div className="space-y-2">
              {exampleProducts.map(product => (
                <Link 
                  key={product.id}
                  to="/products/$productId" 
                  params={{ productId: product.id }}
                  className="block"
                >
                  <Button variant="outline" className="w-full justify-between">
                    {product.name}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Method 2: Programmatic Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Programmatic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use navigate hook for dynamic navigation
            </p>
            <div className="space-y-2">
              {exampleProducts.map(product => (
                <Button 
                  key={product.id}
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => handleNavigateToProduct(product.id)}
                >
                  {product.name}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Method 3: URL Examples */}
        <Card>
          <CardHeader>
            <CardTitle>URL Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Direct URL access patterns
            </p>
            <div className="space-y-2 text-sm font-mono">
              <div className="p-2 bg-muted rounded">
                /products/1
              </div>
              <div className="p-2 bg-muted rounded">
                /products/skincare-serum
              </div>
              <div className="p-2 bg-muted rounded">
                /products/abc123
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Examples */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* With Search Parameters */}
              <div>
                <h4 className="font-semibold mb-2">With Search Parameters</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Navigate with additional query parameters
                </p>
                <Link 
                  to="/products/$productId" 
                  params={{ productId: "1" }}
                  search={{ variant: "large", color: "blue" }}
                >
                  <Button variant="outline" size="sm">
                    Product with Variant
                  </Button>
                </Link>
              </div>

              {/* From Search Results */}
              <div>
                <h4 className="font-semibold mb-2">From Search Results</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Navigate from search page to product
                </p>
                <Link 
                  to="/search" 
                  search={{ q: "skincare" }}
                >
                  <Button variant="outline" size="sm">
                    Search Products
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductNavigationExamples;