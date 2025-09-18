import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Providers } from "@/components/Providers";
import { useEffect } from "react";

const title = "SeRena Cosméticos";
const description = "Distribuidora de comésticos do ABC paulista";
const url = window.location.origin;

export const Route = createRootRoute({
  component: () => {
    useEffect(() => {
      // Set document title
      document.title = title;
      
      // Set meta tags
      const setMetaTag = (name: string, content: string, isProperty?: boolean) => {
        const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
        let meta = document.querySelector(selector) as HTMLMetaElement;
        
        if (!meta) {
          meta = document.createElement('meta');
          if (isProperty) {
            meta.setAttribute('property', name);
          } else {
            meta.setAttribute('name', name);
          }
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // Set all meta tags
      setMetaTag('description', description);
      setMetaTag('viewport', 'width=device-width, initial-scale=1.0');
      setMetaTag('application-name', title);
      setMetaTag('apple-mobile-web-app-capable', 'yes');
      setMetaTag('apple-mobile-web-app-status-bar-style', 'default');
      setMetaTag('apple-mobile-web-app-title', title);
      setMetaTag('format-detection', 'telephone=no');
      setMetaTag('mobile-web-app-capable', 'yes');
      setMetaTag('theme-color', 'oklch(0.21 0.006 285.885)');
      
      // Open Graph tags
      setMetaTag('og:type', 'website', true);
      setMetaTag('og:url', url, true);
      setMetaTag('og:title', title, true);
      setMetaTag('og:description', description, true);
      
      // Twitter tags
      setMetaTag('twitter:card', 'summary_large_image');
      setMetaTag('twitter:url', url);
      setMetaTag('twitter:title', title);
      setMetaTag('twitter:description', description);

      // Set favicon and other links
      const setLinkTag = (rel: string, href: string) => {
        let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
        
        if (!link) {
          link = document.createElement('link');
          link.setAttribute('rel', rel);
          document.head.appendChild(link);
        }
        link.setAttribute('href', href);
      };

      setLinkTag('icon', '/favicon.ico');
      setLinkTag('apple-touch-icon', '/apple-touch-icon-180x180.png');
      setLinkTag('manifest', '/manifest.webmanifest');
    }, []);

    return (
      <>
        <Providers>
          <Outlet />
        </Providers>
      </>
    );
  },
});
