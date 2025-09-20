import { createFileRoute, redirect } from "@tanstack/react-router";
import { mockAuth } from "@/lib/auth";

export const Route = createFileRoute("/_layout/admin")({
  component: AdminPage,
  beforeLoad: ({ context }) => {
    if (!mockAuth.isAuthenticated || !mockAuth.isAdmin) {
      throw redirect({
        to: "/login",
        search: {
          redirect: "/admin",
        },
      });
    }
  },
});

function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Painel Administrativo</h1>
        <p className="text-lg text-muted-foreground">
          Gerencie produtos, pedidos e configurações
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Produtos</h3>
          <p className="text-muted-foreground mb-4">
            Gerencie o catálogo de produtos
          </p>
          <button className="text-primary hover:underline">
            Gerenciar Produtos →
          </button>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Pedidos</h3>
          <p className="text-muted-foreground mb-4">
            Visualize e gerencie pedidos
          </p>
          <button className="text-primary hover:underline">
            Ver Pedidos →
          </button>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Configurações</h3>
          <p className="text-muted-foreground mb-4">
            Configure o sistema
          </p>
          <button className="text-primary hover:underline">
            Configurar →
          </button>
        </div>
      </div>
    </div>
  );
}