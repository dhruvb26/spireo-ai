// app/api/drafts/route.ts

import { NextRequest, NextResponse } from "next/server";
import { saveDraft } from "@/app/actions/draft";

export async function POST(request: NextRequest) {
  try {
    const { postId, content } = await request.json();

    if (!postId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await saveDraft(postId, content);

    return NextResponse.json(
      { message: "Draft saved successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error saving draft:", error);
    return NextResponse.json(
      { error: "Failed to save draft" },
      { status: 500 },
    );
  }
}
