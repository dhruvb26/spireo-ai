import Footer from "@/components/navigation/footer";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { Poppins } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "Spireo - LinkedIn Growth Made Easy",
  description: "Growing on LinkedIn made easy.",
  icons: [{ rel: "icon", url: "/symbol.png" }],
};

const poppins = Poppins({
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
    <html lang="en" className={`${GeistSans.className} ${poppins.className}`}>
      <body>
        {children}
        <Toaster richColors position="top-right" />
        <Footer />
      </body>
    </html>
  );
}
