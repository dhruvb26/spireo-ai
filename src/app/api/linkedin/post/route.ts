"use server";
import { NextResponse } from "next/server";
import { getLinkedInId, getAccessToken } from "@/app/actions/user";
import { saveDraft, updateDraftStatus } from "@/app/actions/draft";
import { drafts } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";

type Node = {
  type: string;
  children?: Node[];
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

function extractText(content: Node | Node[]): string {
  const nodes = Array.isArray(content) ? content : [content];

  let result = "";

  nodes.forEach((node) => {
    if (node.type === "paragraph") {
      result += extractText(node.children || []) + "\n\n";
    } else {
      let text = node.text || "";

      // Apply styles using LinkedIn's text formatting
      if (node.bold) {
        text = `<b>${text}</b>`;
      }
      if (node.italic) {
        text = `<i>${text}</i>`;
      }
      if (node.underline) {
        text = `<u>${text}</u>`;
      }

      result += text;
    }
  });

  return result.trim();
}

export async function POST(request: Request) {
  try {
    const { userId, postId, content, documentUrn } = await request.json();

    console.log("Content received: ", content);

    if (!userId || !postId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const formattedContent = extractText(JSON.parse(content));
    const linkedInId = await getLinkedInId(userId);
    const accessToken = await getAccessToken(userId);

    if (!linkedInId || !accessToken) {
      console.error("Unable to retrieve LinkedIn credentials");
      return NextResponse.json(
        { error: "Unable to retrieve LinkedIn credentials" },
        { status: 400 },
      );
    }

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

    const postBody: any = {
      author: `urn:li:person:${linkedInId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: formattedContent,
            attributes: [],
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

    await db
      .update(drafts)
      .set({
        status: "published",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(drafts.id, postId),
          eq(drafts.userId, userId),
          eq(drafts.status, "scheduled"),
        ),
      );

    console.log("Draft published successfully");

    return NextResponse.json({ message: "Draft published successfully" });
  } catch (error) {
    console.error("Failed to post:", error);
    return NextResponse.json({ error: "Failed to post" }, { status: 500 });
  }
}
