import { createRouter, RouterProvider } from "@tanstack/react-router";

// Import the generated route tree
import { Skeleton } from "@/components/ui/skeleton";
import { Page404 } from "@/pages/404";
import { routeTree } from "@/routeTree.gen";
import { routeAnalytics } from "@/lib/routeAnalytics";

// Create a new router instance
export const router = createRouter({
  routeTree,
  context: { auth: undefined },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
  onRouteChange: (match) => {
    // Track route changes for analytics
    routeAnalytics.trackRoute(match.pathname, match.previousLocation?.pathname)
  },
  defaultPendingComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-xl p-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-1/2 mx-auto" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-2/3" />
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    </div>
  ),
  defaultErrorComponent: ({ error }: { error: Error }) => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-xl p-8 text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-destructive">Algo deu errado</h2>
          <p className="text-muted-foreground">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Detalhes do erro
            </summary>
            <pre className="rounded bg-muted p-3 text-sm mt-2 overflow-auto">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Recarregar página
          </button>
        </div>
      </div>
    </div>
  ),
  defaultNotFoundComponent: () => <Page404 />,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
export const App = () => <RouterProvider router={router} />;
