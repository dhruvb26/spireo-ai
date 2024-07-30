"use server";
import { NextResponse } from "next/server";
import { getAccessToken, getLinkedInId } from "@/app/actions/user";
import { updateDraftStatus, saveDraft } from "@/app/actions/draft";
import { checkAccess } from "@/app/actions/user";

function convertToLinkedInFormat(content: any[]) {
  let plainText = "";
  const attributes = [] as any[];
  let currentPosition = 0;

  if (!Array.isArray(content)) {
    throw new Error("Content must be an array");
  }

  content.forEach((node) => {
    if (node.type === "paragraph" && Array.isArray(node.children)) {
      node.children.forEach((child: any) => {
        if (typeof child === "object" && "text" in child) {
          plainText += child.text;

          if (child.bold || child.italic) {
            attributes.push({
              start: currentPosition,
              length: child.text.length,
              attributes: {
                "com.linkedin.pemberly.text.bold": child.bold || false,
                "com.linkedin.pemberly.text.italic": child.italic || false,
              },
            });
          }

          currentPosition += child.text.length;
        }
      });
      plainText += "\n";
      currentPosition += 1; // for the newline
    }
  });

  return { text: plainText.trim(), attributes };
}
export async function POST(req: Request) {
  try {
    const hasAccess = await checkAccess();

    if (!hasAccess) {
      return NextResponse.json({ error: "Not authorized!" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, postId, content: contentString, documentUrn } = body;
    const content = JSON.parse(contentString);
    const { text, attributes } = convertToLinkedInFormat(content);

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

    // await saveDraft(postId, content);

    let postBody: any = {
      author: `urn:li:person:${linkedInId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: text,
            attributes: attributes,
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

    console.log("Posting to LinkedIn:", postBody);

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
