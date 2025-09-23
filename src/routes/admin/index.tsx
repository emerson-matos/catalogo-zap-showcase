import { createFileRoute } from "@tanstack/react-router";
import AdminPage from "@/pages/Admin";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
});
