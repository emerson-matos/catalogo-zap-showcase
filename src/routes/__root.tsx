import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Page404 } from "@/pages/404";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

const title = "SeRena Cosméticos";
const description = "Distribuidora de cosméticos do ABC paulista";
const url = typeof window !== 'undefined' ? window.location.origin : '';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        title,
      },
      {
        name: "description",
        content: description,
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
      {
        name: "application-name",
        content: title,
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "default",
      },
      {
        name: "apple-mobile-web-app-title",
        content: title,
      },
      {
        name: "format-detection",
        content: "telephone=no",
      },
      {
        name: "mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "theme-color",
        content: "oklch(0.21 0.006 285.885)", // Uses primary color from theme
      },
      {
        name: "og:type",
        content: "website",
      },
      {
        name: "og:url",
        content: url,
      },
      {
        name: "og:title",
        content: title,
      },
      {
        name: "og:description",
        content: description,
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:url",
        content: url,
      },
      {
        name: "twitter:title",
        content: title,
      },
      {
        name: "twitter:description",
        content: description,
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon-180x180.png",
      },
      {
        rel: "manifest",
        href: "/manifest.webmanifest",
      },
    ],
  }),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <AlertTriangle className="w-16 h-16 mx-auto text-destructive" />
        <h1 className="text-2xl font-bold">Algo deu errado</h1>
        <p className="text-muted-foreground">
          Ocorreu um erro inesperado. Tente recarregar a página.
        </p>
        <div className="space-y-2">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full"
          >
            Voltar ao Início
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Detalhes do erro
            </summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </details>
        )}
      </div>
    </div>
  ),
  component: () => (
    <>
      <HeadContent />
      <Providers>
        <div className="min-h-screen">
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
        </div>
      </Providers>
    </>
  ),
  notFoundComponent: () => <Page404 />,
});
