// Route analytics for tracking user navigation patterns
// This can be integrated with analytics services like Google Analytics, Mixpanel, etc.

interface RouteAnalytics {
  path: string
  timestamp: number
  referrer?: string
  userAgent?: string
}

class RouteAnalyticsService {
  private analytics: RouteAnalytics[] = []
  
  // Track route navigation
  trackRoute(path: string, referrer?: string) {
    const routeData: RouteAnalytics = {
      path,
      timestamp: Date.now(),
      referrer: referrer || document.referrer,
      userAgent: navigator.userAgent,
    }
    
    this.analytics.push(routeData)
    
    // Send to analytics service (placeholder)
    this.sendToAnalytics(routeData)
  }
  
  // Get navigation patterns
  getNavigationPatterns() {
    const patterns = this.analytics.reduce((acc, route) => {
      acc[route.path] = (acc[route.path] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return patterns
  }
  
  // Get most visited routes
  getMostVisitedRoutes(limit = 5) {
    const patterns = this.getNavigationPatterns()
    return Object.entries(patterns)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([path, count]) => ({ path, count }))
  }
  
  // Private method to send data to analytics service
  private sendToAnalytics(data: RouteAnalytics) {
    // Placeholder for actual analytics integration
    console.log('Route Analytics:', data)
    
    // Example: Send to Google Analytics
    // if (typeof gtag !== 'undefined') {
    //   gtag('event', 'page_view', {
    //     page_title: data.path,
    //     page_location: window.location.href,
    //   })
    // }
  }
}

// Singleton instance
export const routeAnalytics = new RouteAnalyticsService()

// Hook for automatic route tracking
export const useRouteAnalytics = () => {
  return {
    trackRoute: routeAnalytics.trackRoute.bind(routeAnalytics),
    getNavigationPatterns: routeAnalytics.getNavigationPatterns.bind(routeAnalytics),
    getMostVisitedRoutes: routeAnalytics.getMostVisitedRoutes.bind(routeAnalytics),
  }
}