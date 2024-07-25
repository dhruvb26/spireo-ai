// app/api/drafts/status/route.ts

import { NextRequest, NextResponse } from "next/server";
import { updateDraftStatus } from "@/app/actions/draft";

export async function PUT(request: NextRequest) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "Missing postId" }, { status: 400 });
    }

    await updateDraftStatus(postId);

    return NextResponse.json(
      { message: "Draft status updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating draft status:", error);
    return NextResponse.json(
      { error: "Failed to update draft status" },
      { status: 500 },
    );
  }
}
