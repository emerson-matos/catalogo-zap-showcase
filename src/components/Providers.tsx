import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundaryProvider } from "@/components/ErrorBoundaryProvider";
import { createQueryClient } from "@/lib/queryClient";
import { CartProvider } from "@/contexts/CartContext";

const queryClient = createQueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error for monitoring
    console.error('Application Error:', error, errorInfo);
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  };

  const handleReset = () => {
    // Clear any global error state
    console.log('Error boundary reset');
  };

  return (
    <ErrorBoundaryProvider onError={handleError} onReset={handleReset}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </TooltipProvider>
          <Analytics />
          <SpeedInsights />
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
          <TanStackRouterDevtools />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundaryProvider>
  );
};
