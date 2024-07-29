"use server";
import { NextResponse } from "next/server";
import { getLinkedInId, getAccessToken } from "@/app/actions/user";
import { saveDraft, updateDraftStatus } from "@/app/actions/draft";

export async function POST(request: Request) {
  const { userId, postId, content, documentUrn } = await request.json();

  const linkedInId = await getLinkedInId(userId);
  const accessToken = await getAccessToken(userId);

  if (!linkedInId || !accessToken) {
    console.log("Unable to retrieve LinkedIn credentials");
    return NextResponse.json(
      { error: "Unable to retrieve LinkedIn credentials" },
      { status: 400 },
    );
  }

  try {
    await saveDraft(postId, content);

    let urnId = "";
    let mediaType = "NONE";

    if (documentUrn) {
      const parts = documentUrn.split(":");
      urnId = parts[parts.length - 1];

      if (documentUrn.includes(":image:")) {
        mediaType = "IMAGE";
      } else if (documentUrn.includes(":document:")) {
        mediaType = "RICH";
      }
    }

    let postBody: any = {
      author: `urn:li:person:${linkedInId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: mediaType,
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    if (mediaType === "IMAGE" || mediaType === "RICH") {
      postBody.specificContent["com.linkedin.ugc.ShareContent"].media = [
        {
          status: "READY",
          media: `urn:li:digitalmediaAsset:${urnId}`,
        },
      ];
    }

    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "LinkedIn-Version": "202406",
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(postBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error publishing draft", response.status, errorText);
      return NextResponse.json(
        { error: `Error publishing draft: ${errorText}` },
        { status: response.status },
      );
    }

    await updateDraftStatus(postId);

    return NextResponse.json({ message: "Draft published successfully" });
  } catch (error) {
    console.error("Failed to post:", error);
    return NextResponse.json({ error: "Failed to post" }, { status: 500 });
  }
}
