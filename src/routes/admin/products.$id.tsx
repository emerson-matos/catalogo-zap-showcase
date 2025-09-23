import { AddProductForm } from "@/components/AddProductForm";
import { useProduct } from "@/hooks/useProductsQuery";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderIcon } from "lucide-react";

export const Route = createFileRoute("/admin/products/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return (
    <div>
      <AddProductForm id={id} />
    </div>
  );
}
