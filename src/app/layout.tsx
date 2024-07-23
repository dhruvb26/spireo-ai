import Footer from "@/components/navigation/footer";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { Poppins } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Spireo - LinkedIn Growth Made Easy",
  description: "Growing on LinkedIn made easy.",
  icons: [{ rel: "icon", url: "/Spireo Logo Symbol Custom.png" }],
};

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

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
        <Toaster
          position="top-right"
          toastOptions={{
            unstyled: false,
            classNames: {
              success: "bg-blue-200 text-blue-700 border border-blue-200",
              error: "bg-gray-800 text-white border border-gray-800",
            },
          }}
        />
      </body>
    </html>
  );
}
