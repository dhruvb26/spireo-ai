"use server";

import { getServerAuthSession } from "@/server/auth";
import { accounts } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { users } from "@/server/db/schema";

export async function getUserId() {
  const session = await getServerAuthSession();
  return session?.user.id;
}

export async function getUser() {
  const session = await getServerAuthSession();
  return session?.user;
}

export async function getLinkedInId(id: string) {
  const account = await db
    .select({ providerAccountId: accounts.providerAccountId })
    .from(accounts)
    .where(eq(accounts.userId, id))
    .limit(1);

  return account[0]?.providerAccountId;
}

export async function getAccessToken(id: string) {
  const account = await db
    .select({ access_token: accounts.access_token })
    .from(accounts)
    .where(eq(accounts.userId, id));

  return account[0]?.access_token;
}

export async function checkAccess() {
  const session = await getServerAuthSession();
  const id = session?.user.id || "";
  const user = await db
    .select({ hasAccess: users.hasAccess })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user[0]?.hasAccess;
}
export async function checkValidity() {
  const session = await getServerAuthSession();
  const id = session?.user.id || "";
  const user = await db
    .select({ trialEndsAt: users.trialEndsAt })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user[0]?.trialEndsAt;
}

export async function getUserFromDb() {
  const session = await getServerAuthSession();

  if (!session) {
    return null;
  }

  const userId = session.user.id;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return user;
}

export async function updateGeneratedWords(words: number) {
  const session = await getServerAuthSession();

  if (!session) {
    return null;
  }

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

  if (!session) {
    return null;
  }

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

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const onboardingData = {
    role: formData.role,
    heardFrom: formData.heardFrom,
    topics: formData.topics,
    completedAt: new Date(),
  };

  try {
    const result = await db
      .update(users)
      .set({
        onboardingData: sql`${JSON.stringify(onboardingData)}::jsonb`,
        onboardingCompleted: true,
      })
      .where(sql`id = ${userId}`)
      .returning({ updatedId: users.id });

    if (result.length === 0) {
      throw new Error("User not found or update failed");
    }

    return { success: true };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw new Error("Failed to complete onboarding");
  }
}

export async function skipOnboarding() {
  const session = await getServerAuthSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  try {
    await db
      .update(users)
      .set({
        onboardingCompleted: true,
      })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Error skipping onboarding:", error);
    throw new Error("Failed to skip onboarding");
  }
}
