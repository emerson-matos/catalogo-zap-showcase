import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// Create a new router instance with proper type casting for non-strict mode
const router = createRouter({ 
  routeTree: routeTree as any,
  defaultPreload: 'intent' as any,
} as any)

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App = () => <RouterProvider router={router} />;

export default App;
