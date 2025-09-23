import { AddProductForm } from "@/components/AddProductForm";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const productsSearchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute("/admin/products")({
  component: RouteComponent,
  validateSearch: productsSearchSchema,
});

function RouteComponent() {
  const search = Route.useSearch();

  return (
    <AddProductForm id={search.id} />
  );
}
