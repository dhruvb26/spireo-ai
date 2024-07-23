import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { users, drafts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { ArrowRightIcon, Check, CheckCheck, PenLine } from "lucide-react";
import Link from "next/link";

const GettingStartedSteps = async () => {
  const session = await getServerAuthSession();

  const steps: any = [
    {
      id: 1,
      title: "Account created",
      descriptionIncomplete: "Create your account to get started",
      descriptionComplete: "You have successfully created your account",
      completed: false,
      icon: "🔑",
    },
    {
      id: 2,
      title: "Onboarding",
      descriptionIncomplete: "Complete the onboarding process",
      descriptionComplete: "You have finished the onboarding process",
      completed: false,
      icon: <CheckCheck />,
    },
    {
      id: 3,
      title: "Write your first post",
      descriptionIncomplete: "Use the power of AI to create your first post",
      descriptionComplete: "Congratulations on writing your first post!",
      completed: false,
      icon: <PenLine />,
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

  const completedSteps = steps.filter((step: any) => step.completed).length;
  const progress = ((completedSteps / steps.length) * 100).toFixed(2);

  return (
    <div className="max-w-6xl">
      <div className="container mb-8 space-y-2 text-left">
        <h1 className="text-3xl font-bold tracking-tighter text-brand-gray-900">
          Get Started with Spireo!
        </h1>
        <p className="text-md mx-auto text-brand-gray-500">
          Complete the steps and grow your presence on LinkedIn.
        </p>
      </div>
      <div className="flex items-center justify-center">
        <div className="min-w-[600px] rounded-lg bg-brand-gray-25 p-6 shadow-xl">
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-medium">Let's get you started</h3>
            <div className="mb-2 h-2 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{progress}% complete</p>
          </div>

          <ul className="space-y-4 ">
            {steps.map((step: any) => (
              <li key={step.id} className="flex items-start">
                <span
                  className={`h-6 w-6 flex-shrink-0 rounded-full ${step.completed ? "bg-blue-500 text-white" : " text-gray-400"} mr-3 mt-1 flex items-center justify-center`}
                >
                  {step.completed ? "✓" : step.icon}
                </span>
                <div>
                  <h4
                    className={`font-medium ${step.completed ? "text-gray-900" : "text-gray-500"}`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {step.completed
                      ? step.descriptionComplete
                      : step.descriptionIncomplete}
                  </p>
                </div>
                {step.id === 2 && !step.completed && (
                  <Link
                    href="/dashboard/onboarding"
                    className="ml-auto rounded-full bg-blue-500 px-2 py-2 text-white hover:bg-blue-700"
                  >
                    <ArrowRightIcon />
                  </Link>
                )}
                {step.id === 3 && !step.completed && (
                  <Link
                    href="/dashboard/post"
                    className="ml-auto rounded-full bg-blue-500 px-2 py-2 text-white hover:bg-blue-700"
                  >
                    <ArrowRightIcon />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedSteps;
