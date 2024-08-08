import { getServerAuthSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    console.log("Session in /api/session:", session);
    return NextResponse.json({ session });
  } catch (error) {
    console.error("Error in /api/session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
