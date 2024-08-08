import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { users, drafts } from "@/server/db/schema";
import { ArrowDown, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { eq } from "drizzle-orm";
import Link from "next/link";

const GettingStartedSteps = async () => {
  const session = await getServerAuthSession();

  const steps: any = [
    {
      id: 1,
      title: "Account created",
      description:
        "Create your Spireo account to unlock AI-powered LinkedIn growth",
      completed: false,
      icon: "🔑",
      href: "/dashboard",
    },
    {
      id: 2,
      title: "Onboarding",
      description:
        "Tell us about your preferences to personalize your experience",
      completed: false,

      href: "/dashboard/preferences",
    },
    {
      id: 3,
      title: "First post",
      description:
        "Craft your first LinkedIn post with our AI-assisted content creator",
      completed: false,
      href: "/dashboard/post",
    },
  ];

  if (session?.user?.id) {
    steps[0].completed = true;

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (user?.onboardingData) {
      steps[1].completed = true;
    }

    const userDrafts = await db
      .select()
      .from(drafts)
      .where(eq(drafts.userId, session.user.id))
      .limit(1);

    if (userDrafts.length > 0) {
      steps[2].completed = true;
    }
  }

  return (
    <main className="space-y-24">
      <div className="mb-8 text-left">
        <h1 className="text-xl font-semibold tracking-tight text-brand-gray-900">
          Your LinkedIn Growth Journey Begins!
        </h1>
        <p className="text-sm text-brand-gray-500">
          Follow these steps to supercharge your LinkedIn presence and start
          creating impactful content.
        </p>
      </div>
      <div className="flex flex-col space-y-8 md:flex-row md:space-x-4 md:space-y-0">
        {steps.map((step: any, index: number) => (
          <div
            key={step.id}
            className="relative flex flex-col items-center md:w-1/3"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                step.completed
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <Link
              href={step.href}
              className="group mt-3 flex items-center justify-center py-0"
            >
              <h4 className="text-md mt-1 flex w-fit items-center justify-center text-center font-semibold tracking-tight text-gray-800 hover:text-blue-700">
                {step.title} {">"}
                {/* <ArrowUpRight className="ml-1 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" /> */}
              </h4>
            </Link>
            <p className="text-center text-sm text-gray-600">
              {step.description}
            </p>
            {index < steps.length - 1 && (
              <>
                <ArrowRight className="absolute right-[-1rem] top-6 hidden h-6 w-6 text-gray-300 md:block" />
                <ArrowDown className="mt-4 h-6 w-6 text-gray-300 md:hidden" />
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
};

export default GettingStartedSteps;
