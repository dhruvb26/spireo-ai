"use server";

import { getServerAuthSession } from "@/server/auth";
import { accounts, drafts, users } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq, sql } from "drizzle-orm";
import { env } from "@/env";
import { ideas, verificationTokens, sessions } from "@/server/db/schema";

export async function getUserId() {
  const session = await getServerAuthSession();
  return session?.user.id;
}

export async function getUser() {
  const session = await getServerAuthSession();

  if (!session) return null;

  let user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: {
      id: true,
      name: true,
      email: true,
      image: true,
      headline: true,
    },
  });

  if (!user) return null;

  try {
    const accessToken = await getAccessToken(user.id);

    const response = await fetch("https://api.linkedin.com/v2/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202406",
      },
    });

    if (response.ok) {
      const data = await response.json();
      const headline = data.localizedHeadline;

      await db.update(users).set({ headline }).where(eq(users.id, user.id));

      user.headline = headline;
    } else if (response.status === 401) {
      console.log("Unauthorized access to LinkedIn API");
    } else {
      console.error("Error fetching LinkedIn data:", response.statusText);
    }
  } catch (error) {
    console.error("Error in LinkedIn API request:", error);
  }

  return user;
}

export async function getLinkedInId(userId: string) {
  const account = await db
    .select({ providerAccountId: accounts.providerAccountId })
    .from(accounts)
    .where(eq(accounts.userId, userId))
    .limit(1);

  return account[0]?.providerAccountId;
}

export async function checkAccess() {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) return false;

  const user = await db
    .select({ hasAccess: users.hasAccess })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user[0]?.hasAccess ?? false;
}

export async function checkValidity() {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) return null;

  const user = await db
    .select({ trialEndsAt: users.trialEndsAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user[0]?.trialEndsAt;
}

export async function getUserFromDb() {
  const session = await getServerAuthSession();
  if (!session) return null;

  const userId = session.user.id;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
  });
  const provider = account?.provider;

  if (provider === "linkedin") {
    const options = {
      method: "GET",
      headers: { Authorization: `Bearer ${env.FRIGADE_API_KEY}` },
    };

    const response = await fetch(
      `https://api.frigade.com/v1/public/flowStates?userId=${userId}`,
      options,
    );
    const data = await response.json();
    const targetFlow = data.eligibleFlows.find(
      (flow: any) => flow.flowSlug === "flow_pUF3qW42",
    );

    if (targetFlow) {
      const targetStep = targetFlow.data.steps.find(
        (step: any) => step.id === "checklist-step-three",
      );

      if (targetStep && !targetStep.$state.completed) {
        const startOptions = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.FRIGADE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            flowSlug: "flow_pUF3qW42",
            stepId: "checklist-step-three",
            actionType: "STARTED_STEP",
          }),
        };

        const startResponse = await fetch(
          "https://api.frigade.com/v1/public/flowStates",
          startOptions,
        );

        if (startResponse.ok) {
          const completeOptions = {
            ...startOptions,
            body: JSON.stringify({
              ...JSON.parse(startOptions.body),
              actionType: "COMPLETED_STEP",
            }),
          };

          await fetch(
            "https://api.frigade.com/v1/public/flowStates",
            completeOptions,
          );
        }
      }
    }
  }

  if (!user) return null;

  return user;
}

export async function updateGeneratedWords(words: number) {
  const session = await getServerAuthSession();
  if (!session) return null;

  const userId = session.user.id;
  await db
    .update(users)
    .set({
      generatedWords: sql`${users.generatedWords} + ${words}`,
    })
    .where(eq(users.id, userId));
}

export async function getGeneratedWords() {
  const session = await getServerAuthSession();
  if (!session) return null;

  const userId = session.user.id;
  const result = await db
    .select({ generatedWords: users.generatedWords })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result[0]?.generatedWords ?? null;
}

export async function completeOnboarding(formData: {
  role: string;
  heardFrom: string;
  topics: string[];
}) {
  const session = await getServerAuthSession();
  if (!session) throw new Error("Unauthorized");

  const userId = session.user.id;
  const onboardingData = {
    ...formData,
    completedAt: new Date(),
  };

  try {
    const result = await db
      .update(users)
      .set({
        onboardingData: sql`${JSON.stringify(onboardingData)}::jsonb`,
        onboardingCompleted: true,
      })
      .where(eq(users.id, userId))
      .returning({ updatedId: users.id });

    if (result.length === 0) throw new Error("User not found or update failed");
    return { success: true };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw new Error("Failed to complete onboarding");
  }
}

export async function skipOnboarding() {
  const session = await getServerAuthSession();
  if (!session) throw new Error("Unauthorized");

  const userId = session.user.id;
  try {
    await db
      .update(users)
      .set({ onboardingCompleted: true })
      .where(eq(users.id, userId));
    return { success: true };
  } catch (error) {
    console.error("Error skipping onboarding:", error);
    throw new Error("Failed to skip onboarding");
  }
}

export async function getUserOnboardingData() {
  const session = await getServerAuthSession();
  if (!session) throw new Error("Unauthorized");

  const userId = session.user.id;
  try {
    const result = await db
      .select({
        onboardingData: users.onboardingData,
        onboardingCompleted: users.onboardingCompleted,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (result.length === 0) throw new Error("User not found");
    return {
      success: true,
      data: {
        onboardingData: result[0]?.onboardingData,
        onboardingCompleted: result[0]?.onboardingCompleted,
      },
    };
  } catch (error) {
    console.error("Error fetching user onboarding data:", error);
    throw new Error("Failed to fetch user onboarding data");
  }
}
export async function getAccessToken(userId: string) {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
    columns: {
      access_token: true,
      expires_at: true,
    },
  });

  if (!account) {
    throw new Error("No account found for user");
  }

  return account.access_token;
}

export async function deleteUser() {
  const session = await getServerAuthSession();
  if (!session) throw new Error("Unauthorized");

  const userId = session.user.id;

  try {
    await db.transaction(async (tx) => {
      // Delete related records first
      await tx.delete(accounts).where(eq(accounts.userId, userId));
      await tx.delete(sessions).where(eq(sessions.userId, userId));
      await tx.delete(drafts).where(eq(drafts.userId, userId));
      await tx.delete(ideas).where(eq(ideas.userId, userId));
      await tx
        .delete(verificationTokens)
        .where(eq(verificationTokens.identifier, userId));

      // Delete the user last
      const result = await tx.delete(users).where(eq(users.id, userId));
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}
