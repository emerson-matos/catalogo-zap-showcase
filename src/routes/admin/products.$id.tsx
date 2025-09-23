import { AddProductForm } from "@/components/AddProductForm";
import { createFileRoute } from "@tanstack/react-router";

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
