import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { createQueryClient } from "@/lib/queryClient";
import { CartProvider } from "@/contexts/CartContext";

const queryClient = createQueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};
