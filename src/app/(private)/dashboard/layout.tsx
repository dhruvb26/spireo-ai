import Sidebar from "@/components/sidebar";
import { Suspense } from "react";
import "slick-carousel/slick/slick.css";
import Loading from "./loading.js";
import "slick-carousel/slick/slick-theme.css";
import { getServerAuthSession } from "@/server/auth";
import { getUserFromDb } from "@/app/actions/user";
import SubscriptionPrompt from "@/components/subscription-prompt";
import FeedbackButton from "@/components/feedback-button";
import { OnboardingForm } from "./_components/onboarding/onboarding-form";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  const user = await getUserFromDb();
  const isOnboardingComplete = user?.onboardingCompleted; // Assume this field exists in your user model

  if (!isOnboardingComplete) {
    return <OnboardingForm />;
  }
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={<Loading />}>
        <Sidebar session={session} user={user}>
          <main className="relative flex-1 p-8">
            {!user?.hasAccess && <SubscriptionPrompt />}
            {children}
            <FeedbackButton />
          </main>
        </Sidebar>
      </Suspense>
    </div>
  );
}
