import { router } from '@/App'

// Route preloading utilities for better performance
export const preloadRoutes = {
  // Preload critical routes on user interaction
  onHover: (route: string) => {
    router.preloadRoute({ to: route })
  },
  
  // Preload routes on user intent (mouse down, focus, etc.)
  onIntent: (route: string) => {
    router.preloadRoute({ to: route })
  },
  
  // Preload multiple routes at once
  batch: (routes: string[]) => {
    routes.forEach(route => {
      router.preloadRoute({ to: route })
    })
  },
  
  // Preload routes based on user behavior patterns
  smartPreload: () => {
    // Preload likely next routes based on current location
    const currentPath = window.location.pathname
    
    switch (currentPath) {
      case '/':
        // From home, users likely go to products or flipbook
        router.preloadRoute({ to: '/products' })
        router.preloadRoute({ to: '/flipbook' })
        break
      case '/products':
        // From products, users might go to flipbook or contact
        router.preloadRoute({ to: '/flipbook' })
        router.preloadRoute({ to: '/contact' })
        break
      case '/about':
        // From about, users might go to contact
        router.preloadRoute({ to: '/contact' })
        break
      default:
        // Default: preload home and flipbook
        router.preloadRoute({ to: '/' })
        router.preloadRoute({ to: '/flipbook' })
    }
  }
}

// Hook for automatic route preloading
export const useRoutePreloading = () => {
  // This could be enhanced with user analytics
  // to predict which routes users are most likely to visit
  return {
    preloadOnHover: preloadRoutes.onHover,
    preloadOnIntent: preloadRoutes.onIntent,
    smartPreload: preloadRoutes.smartPreload,
  }
}