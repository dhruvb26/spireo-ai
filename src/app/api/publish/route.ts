import { NextResponse } from "next/server";
import { getAccessToken, getLinkedInId } from "@/app/actions/user";
import { updateDraftStatus, saveDraft } from "@/app/actions/draft";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, postId, content, scheduledTime } = body;

  console.log(content);

  const linkedInId = await getLinkedInId(userId);
  const accessToken = await getAccessToken(userId);

  await saveDraft(postId, content);

  try {
    const response = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "LinkedIn-Version": "202406",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        author: `urn:li:person:${linkedInId}`,
        commentary: { content },
        visibility: "PUBLIC",
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      }),
    });

    if (!response.ok) {
      console.error("Error publishing draft", response.statusText);
      return NextResponse.json({
        success: false,
        message: "Error publishing draft",
      });
    }
    await updateDraftStatus(postId);
  } catch (err: any) {
    console.error("Error publishing draft", err);
    return NextResponse.json({
      success: false,
      message: "Error publishing draft",
    });
  }

  return NextResponse.json({
    success: true,
    message: "Draft published successfully",
  });
}
