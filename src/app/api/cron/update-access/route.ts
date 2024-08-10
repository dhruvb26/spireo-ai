import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { and, eq, lt } from "drizzle-orm";
import { env } from "@/env";

export async function GET(req: NextRequest) {
  try {
    if (req.headers.get("Authorization") !== `Bearer ${env.CRON_SECRET}`) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const now = new Date();

    // Update all users whose trial has ended
    const result = await db
      .update(users)
      .set({ hasAccess: false })
      .where(
        and(
          eq(users.hasAccess, true),
          lt(users.trialEndsAt, now),
          eq(users.specialAccess, false),
        ),
      );

    return NextResponse.json(
      {
        message: "Trial access updated",
        updated: result.count,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating trial access:", error);
    return NextResponse.json(
      { message: "Error updating trial access" },
      { status: 500 },
    );
  }
}
