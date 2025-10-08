import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/index.css";

const title = "SeRena Cosméticos";
const description = "Distribuidora de cosméticos do ABC paulista";

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description: description,
  applicationName: title,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: title,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: title,
    description: description,
    siteName: title,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: title,
    description: description,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon-180x180.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
