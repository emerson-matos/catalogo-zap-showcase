import { createFileRoute } from "@tanstack/react-router";
import ProductNavigationExamples from "@/components/ProductNavigationExamples";

export const Route = createFileRoute("/_layout/examples")({
  component: ExamplesPage,
});

function ExamplesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Product Navigation Examples</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn different ways to navigate to individual product details in your TanStack Router app
        </p>
      </div>
      
      <ProductNavigationExamples />
      
      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Quick Reference</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-medium mb-2">Link Component</h4>
            <pre className="text-sm bg-background p-3 rounded overflow-x-auto">
{`<Link 
  to="/products/$productId" 
  params={{ productId: "123" }}
>
  View Product
</Link>`}
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2">Navigate Hook</h4>
            <pre className="text-sm bg-background p-3 rounded overflow-x-auto">
{`const navigate = useNavigate();
navigate({ 
  to: "/products/$productId", 
  params: { productId: "123" } 
});`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}