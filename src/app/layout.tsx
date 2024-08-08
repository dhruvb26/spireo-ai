import "@/styles/globals.css";
import { Toaster } from "sonner";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Spireo - LinkedIn Growth Made Easy",
  description: "Growing on LinkedIn made easy.",
  icons: [{ rel: "icon", url: "/Spireo Logo Symbol Custom.png" }],
};

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body>
        {children}
        <Script
          src="https://plausible.io/js/script.js"
          data-domain="app.spireo.ai"
        />
        <Analytics />
        <Toaster className="mt-8" position="top-right" richColors />
      </body>
    </html>
  );
}
