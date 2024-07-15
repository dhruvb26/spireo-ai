import { NextResponse } from "next/server";
import { getAccessToken, getLinkedInId } from "@/app/actions/user";
import { updateDraftStatus, saveDraft } from "@/app/actions/draft";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, postId, content } = body;

    console.log(content);

    const linkedInId = await getLinkedInId(userId);
    const accessToken = await getAccessToken(userId);

    if (!linkedInId || !accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to retrieve LinkedIn credentials",
        },
        { status: 400 },
      );
    }

    await saveDraft(postId, content);

    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "LinkedIn-Version": "202406",
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: `urn:li:person:${linkedInId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error publishing draft", response.status, errorText);
      return NextResponse.json(
        {
          success: false,
          message: "Error publishing draft",
          error: errorText,
        },
        { status: response.status },
      );
    }

    await updateDraftStatus(postId);

    return NextResponse.json({
      success: true,
      message: "Draft published successfully",
    });
  } catch (err: any) {
    console.error("Error in POST handler", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: err.message,
      },
      { status: 500 },
    );
  }
}
