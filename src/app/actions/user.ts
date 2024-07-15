"use server";

import { getServerAuthSession } from "@/server/auth";
import { accounts } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
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
