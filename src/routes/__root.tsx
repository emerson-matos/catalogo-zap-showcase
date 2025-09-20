import { createRootRoute, HeadContent, Outlet, ErrorComponent } from "@tanstack/react-router";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { CartFloat } from "@/components/CartFloat";
import { Page404 } from "@/pages/404";

const title = "SeRena Cosméticos";
const description = "Distribuidora de comésticos do ABC paulista";
const url = window.location.origin;

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
          <WhatsAppFloat />
          <CartFloat />
        </div>
      </Providers>
    </>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-destructive mb-4">
          Algo deu errado!
        </h1>
        <p className="text-muted-foreground mb-6">
          {error instanceof Error ? error.message : 'Ocorreu um erro inesperado'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Recarregar página
        </button>
      </div>
    </div>
  ),
  notFoundComponent: () => <Page404 />,
});
