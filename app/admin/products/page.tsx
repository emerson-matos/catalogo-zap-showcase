"use client";

import { AddProductForm } from "@/components/AddProductForm";
import { useSearchParams } from "next/navigation";

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || undefined;

  return <AddProductForm id={id} />;
}
