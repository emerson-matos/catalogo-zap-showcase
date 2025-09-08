import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				{children}
				<Toaster />
			</TooltipProvider>
			<TanStackRouterDevtools />
		</QueryClientProvider>
	);
};
