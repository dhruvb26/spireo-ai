"use server";

import { getServerAuthSession } from "@/server/auth";
import { accounts, users } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq, sql } from "drizzle-orm";
import { env } from "@/env";

export async function getUserId() {
  const session = await getServerAuthSession();
  return session?.user.id;
}

export async function getUser() {
  const session = await getServerAuthSession();
  return session?.user;
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

  if (
    account.expires_at &&
    account.expires_at < Math.floor(Date.now() / 1000)
  ) {
    // Token is expired, refresh it
    return refreshAccessToken(userId);
  }

  return account.access_token;
}

export async function refreshAccessToken(userId: string) {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
    columns: {
      refresh_token: true,
    },
  });

  if (!account?.refresh_token) {
    throw new Error("No refresh token found");
  }

  try {
    const response = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: account.refresh_token,
          client_id: env.LINKEDIN_CLIENT_ID,
          client_secret: env.LINKEDIN_CLIENT_SECRET,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    // Update the account with the new tokens
    await db
      .update(accounts)
      .set({
        access_token: data.access_token,
        expires_at: Math.floor(Date.now() / 1000 + data.expires_in),
        refresh_token: data.refresh_token ?? account.refresh_token,
      })
      .where(eq(accounts.userId, userId));

    return data.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}
