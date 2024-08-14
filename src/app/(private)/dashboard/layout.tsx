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
            {children}
            <FeedbackButton />
          </main>
        </Sidebar>
      </Suspense>
    </div>
  );
}
