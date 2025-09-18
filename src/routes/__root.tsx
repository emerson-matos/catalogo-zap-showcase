import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Providers } from "@/components/Providers";
import { useEffect } from "react";

const title = "SeRena Cosméticos";
const description = "Distribuidora de comésticos do ABC paulista";
const url = window.location.origin;

// Component to inject head content dynamically
const HeadInjector = () => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Remove existing meta tags to avoid duplicates
    const existingMetaTags = document.querySelectorAll('meta[name="description"], meta[name="viewport"], meta[name="application-name"], meta[name="apple-mobile-web-app-capable"], meta[name="apple-mobile-web-app-status-bar-style"], meta[name="apple-mobile-web-app-title"], meta[name="format-detection"], meta[name="mobile-web-app-capable"], meta[name="theme-color"], meta[name="og:type"], meta[name="og:url"], meta[name="og:title"], meta[name="og:description"], meta[name="twitter:card"], meta[name="twitter:url"], meta[name="twitter:title"], meta[name="twitter:description"]');
    existingMetaTags.forEach(tag => tag.remove());
    
    // Add meta tags
    const metaTags = [
      { name: "description", content: description },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "application-name", content: title },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: title },
      { name: "format-detection", content: "telephone=no" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "theme-color", content: "oklch(0.21 0.006 285.885)" },
      { name: "og:type", content: "website" },
      { name: "og:url", content: url },
      { name: "og:title", content: title },
      { name: "og:description", content: description },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ];
    
    metaTags.forEach(meta => {
      const metaTag = document.createElement('meta');
      metaTag.setAttribute('name', meta.name);
      metaTag.setAttribute('content', meta.content);
      document.head.appendChild(metaTag);
    });
    
    // Remove existing link tags to avoid duplicates
    const existingLinkTags = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]');
    existingLinkTags.forEach(tag => tag.remove());
    
    // Add link tags
    const linkTags = [
      { rel: "icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon-180x180.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ];
    
    linkTags.forEach(link => {
      const linkTag = document.createElement('link');
      linkTag.setAttribute('rel', link.rel);
      linkTag.setAttribute('href', link.href);
      document.head.appendChild(linkTag);
    });
  }, []);
  
  return null;
};

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
      <HeadInjector />
      <Providers>
        <Outlet />
      </Providers>
    </>
  ),
});
