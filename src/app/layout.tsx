import "@/styles/globals.css";
import "@uploadthing/react/styles.css";
import { Toaster } from "sonner";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import * as Frigade from "@frigade/react";
import { getUserFromDb } from "@/actions/user";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Spireo - LinkedIn Growth Made Easy",
  description: "Growing on LinkedIn made easy.",
  icons: [{ rel: "icon", url: "/spireo-icon.png" }],
};

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromDb();
  const FRIGADE_THEME_OVERRIDES = {
    colors: {
      primary: {
        border: "#ffffff",
        focus: {
          border: "none",
        },
        hover: {
          border: "none",
        },
      },
      secondary: {
        border: "#eaecf0",
      },
    },
  };
  return (
    <Frigade.Provider
      theme={FRIGADE_THEME_OVERRIDES}
      apiKey="api_public_M7QhrYdEIODS2CMpemUNO3jTudHN7yrVCuHQSHzplE0d21HHYVzEdT18GMjtQM7d"
      userId={user?.id}
      userProperties={{
        name: user?.name,
        email: user?.email,
        id: user?.id,
        account: !!user,
        preferences: !!user?.onboardingData,
      }}
    >
      <html lang="en" className={`${inter.className}`}>
        <body>
          {children}
          <Script
            src="https://plausible.io/js/script.js"
            data-domain="app.spireo.ai"
          />
          <SpeedInsights />
          <Analytics />
          <Toaster className="mt-8" position="top-right" richColors />
        </body>
      </html>
    </Frigade.Provider>
  );
}
