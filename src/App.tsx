import { createRouter, RouterProvider } from "@tanstack/react-router";

// Import the generated route tree
import { Skeleton } from "@/components/ui/skeleton";
import { Page404 } from "@/pages/404";
import { routeTree } from "@/routeTree.gen";

// Create a new router instance
export const router = createRouter({
  routeTree,
  context: { auth: undefined },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: () => (
    <div className="mx-auto max-w-xl p-8">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    </div>
  ),
  defaultErrorComponent: ({ error }: { error: Error }) => (
    <div className="mx-auto max-w-xl p-8">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <pre className="rounded bg-muted p-3 text-sm">
          {error instanceof Error ? error.message : String(error)}
        </pre>
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
