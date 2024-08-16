"use server";
import { NextResponse } from "next/server";
import { getAccessToken, getLinkedInId } from "@/actions/user";
import { updateDraft } from "@/actions/draft";
import { checkAccess } from "@/actions/user";

function convertToLinkedInFormat(content: any[]) {
  let plainText = "";
  let currentPosition = 0;

  if (!Array.isArray(content)) {
    throw new Error("Content must be an array");
  }

  content.forEach((node) => {
    if (node.type === "paragraph" && Array.isArray(node.children)) {
      node.children.forEach((child: any) => {
        if (typeof child === "object" && "text" in child) {
          plainText += child.text;
          currentPosition += child.text.length;
        }
      });
      plainText += "\n";
      currentPosition += 1; // for the newline
    }
  });

  return plainText.trim();
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
    const commentary = convertToLinkedInFormat(content);

    let mediaContent = null;

    if (documentUrn) {
      const parts = documentUrn.split(":");
      const urnId = parts[parts.length - 1];

      if (documentUrn.includes(":image:")) {
        mediaContent = {
          media: {
            id: `urn:li:image:${urnId}`,
          },
        };
      } else if (documentUrn.includes(":document:")) {
        mediaContent = {
          media: {
            id: `urn:li:document:${urnId}`,
            title: content[0]?.children[0]?.text || "Document Title",
          },
        };
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

    let postBody: any = {
      author: `urn:li:person:${linkedInId}`,
      commentary: commentary,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    };

    if (mediaContent) {
      postBody.content = mediaContent;
    }

    console.log("Posting to LinkedIn:", postBody);

    const response = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "LinkedIn-Version": "202401",
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

    await updateDraft(postId, "published");

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
