import Sidebar from "@/components/sidebar";
import { Suspense } from "react";
import "slick-carousel/slick/slick.css";
import Loading from "./loading.js";
import "slick-carousel/slick/slick-theme.css";
import { getServerAuthSession } from "@/server/auth";
import { getUserFromDb } from "@/actions/user";
import SubscriptionPrompt from "@/components/subscription-prompt";
import FeedbackButton from "@/components/feedback-button";
import OnboardingPage from "@/app/(public)/onboarding/page";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { extractRouterConfig } from "uploadthing/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  const user = await getUserFromDb();
  const isOnboardingComplete = user?.onboardingCompleted;

  if (!isOnboardingComplete) {
    return <OnboardingPage />;
  }
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={<Loading />}>
        <Sidebar session={session} user={user}>
          <main className="max-w-screen w-full p-8">
            {!user?.hasAccess && <SubscriptionPrompt />}
            <NextSSRPlugin
              /**
               * The `extractRouterConfig` will extract **only** the route configs
               * from the router to prevent additional information from being
               * leaked to the client. The data passed to the client is the same
               * as if you were to fetch `/api/uploadthing` directly.
               */
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            {children}
            <FeedbackButton />
          </main>
        </Sidebar>
      </Suspense>
    </div>
  );
}
