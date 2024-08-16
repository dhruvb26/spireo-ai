import { NextResponse } from "next/server";
import { getLinkedInId, getAccessToken } from "@/actions/user";
import { saveDraft } from "@/actions/draft";
import { drafts } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
export const maxDuration = 60;

type Node = {
  type: string;
  children?: Node[];
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

const characterMaps = {
  bold: new Map([
    ["A", "𝗔"],
    ["B", "𝗕"],
    ["C", "𝗖"],
    ["D", "𝗗"],
    ["E", "𝗘"],
    ["F", "𝗙"],
    ["G", "𝗚"],
    ["H", "𝗛"],
    ["I", "𝗜"],
    ["J", "𝗝"],
    ["K", "𝗞"],
    ["L", "𝗟"],
    ["M", "𝗠"],
    ["N", "𝗡"],
    ["O", "𝗢"],
    ["P", "𝗣"],
    ["Q", "𝗤"],
    ["R", "𝗥"],
    ["S", "𝗦"],
    ["T", "𝗧"],
    ["U", "𝗨"],
    ["V", "𝗩"],
    ["W", "𝗪"],
    ["X", "𝗫"],
    ["Y", "𝗬"],
    ["Z", "𝗭"],
    ["a", "𝗮"],
    ["b", "𝗯"],
    ["c", "𝗰"],
    ["d", "𝗱"],
    ["e", "𝗲"],
    ["f", "𝗳"],
    ["g", "𝗴"],
    ["h", "𝗵"],
    ["i", "𝗶"],
    ["j", "𝗷"],
    ["k", "𝗸"],
    ["l", "𝗹"],
    ["m", "𝗺"],
    ["n", "𝗻"],
    ["o", "𝗼"],
    ["p", "𝗽"],
    ["q", "𝗾"],
    ["r", "𝗿"],
    ["s", "𝘀"],
    ["t", "𝘁"],
    ["u", "𝘂"],
    ["v", "𝘃"],
    ["w", "𝘄"],
    ["x", "𝘅"],
    ["y", "𝘆"],
    ["z", "𝘇"],
  ]),
  italic: new Map([
    ["A", "𝘈"],
    ["B", "𝘉"],
    ["C", "𝘊"],
    ["D", "𝘋"],
    ["E", "𝘌"],
    ["F", "𝘍"],
    ["G", "𝘎"],
    ["H", "𝘏"],
    ["I", "𝘐"],
    ["J", "𝘑"],
    ["K", "𝘒"],
    ["L", "𝘓"],
    ["M", "𝘔"],
    ["N", "𝘕"],
    ["O", "𝘖"],
    ["P", "𝘗"],
    ["Q", "𝘘"],
    ["R", "𝘙"],
    ["S", "𝘚"],
    ["T", "𝘛"],
    ["U", "𝘜"],
    ["V", "𝘝"],
    ["W", "𝘞"],
    ["X", "𝘟"],
    ["Y", "𝘠"],
    ["Z", "𝘡"],
    ["a", "𝘢"],
    ["b", "𝘣"],
    ["c", "𝘤"],
    ["d", "𝘥"],
    ["e", "𝘦"],
    ["f", "𝘧"],
    ["g", "𝘨"],
    ["h", "𝘩"],
    ["i", "𝘪"],
    ["j", "𝘫"],
    ["k", "𝘬"],
    ["l", "𝘭"],
    ["m", "𝘮"],
    ["n", "𝘯"],
    ["o", "𝘰"],
    ["p", "𝘱"],
    ["q", "𝘲"],
    ["r", "𝘳"],
    ["s", "𝘴"],
    ["t", "𝘵"],
    ["u", "𝘶"],
    ["v", "𝘷"],
    ["w", "𝘸"],
    ["x", "𝘹"],
    ["y", "𝘺"],
    ["z", "𝘻"],
  ]),
  boldItalic: new Map([
    ["A", "𝘼"],
    ["B", "𝘽"],
    ["C", "𝘾"],
    ["D", "𝘿"],
    ["E", "𝙀"],
    ["F", "𝙁"],
    ["G", "𝙂"],
    ["H", "𝙃"],
    ["I", "𝙄"],
    ["J", "𝙅"],
    ["K", "𝙆"],
    ["L", "𝙇"],
    ["M", "𝙈"],
    ["N", "𝙉"],
    ["O", "𝙊"],
    ["P", "𝙋"],
    ["Q", "𝙌"],
    ["R", "𝙍"],
    ["S", "𝙎"],
    ["T", "𝙏"],
    ["U", "𝙐"],
    ["V", "𝙑"],
    ["W", "𝙒"],
    ["X", "𝙓"],
    ["Y", "𝙔"],
    ["Z", "𝙕"],
    ["a", "𝙖"],
    ["b", "𝙗"],
    ["c", "𝙘"],
    ["d", "𝙙"],
    ["e", "𝙚"],
    ["f", "𝙛"],
    ["g", "𝙜"],
    ["h", "𝙝"],
    ["i", "𝙞"],
    ["j", "𝙟"],
    ["k", "𝙠"],
    ["l", "𝙡"],
    ["m", "𝙢"],
    ["n", "𝙣"],
    ["o", "𝙤"],
    ["p", "𝙥"],
    ["q", "𝙦"],
    ["r", "𝙧"],
    ["s", "𝙨"],
    ["t", "𝙩"],
    ["u", "𝙪"],
    ["v", "𝙫"],
    ["w", "𝙬"],
    ["x", "𝙭"],
    ["y", "𝙮"],
    ["z", "𝙯"],
  ]),
  underline: new Map([
    ["A", "𝙰̲"],
    ["B", "𝙱̲"],
    ["C", "𝙲̲"],
    ["D", "𝙳̲"],
    ["E", "𝙴̲"],
    ["F", "𝙵̲"],
    ["G", "𝙶̲"],
    ["H", "𝙷̲"],
    ["I", "𝙸̲"],
    ["J", "𝙹̲"],
    ["K", "𝙺̲"],
    ["L", "𝙻̲"],
    ["M", "𝙼̲"],
    ["N", "𝙽̲"],
    ["O", "𝙾̲"],
    ["P", "𝙿̲"],
    ["Q", "𝚀̲"],
    ["R", "𝚁̲"],
    ["S", "𝚂̲"],
    ["T", "𝚃̲"],
    ["U", "𝚄̲"],
    ["V", "𝚅̲"],
    ["W", "𝚆̲"],
    ["X", "𝚇̲"],
    ["Y", "𝚈̲"],
    ["Z", "𝚉̲"],
    ["a", "𝚊̲"],
    ["b", "𝚋̲"],
    ["c", "𝚌̲"],
    ["d", "𝚍̲"],
    ["e", "𝚎̲"],
    ["f", "𝚏̲"],
    ["g", "𝚐̲"],
    ["h", "𝚑̲"],
    ["i", "𝚒̲"],
    ["j", "𝚓̲"],
    ["k", "𝚔̲"],
    ["l", "𝚕̲"],
    ["m", "𝚖̲"],
    ["n", "𝚗̲"],
    ["o", "𝚘̲"],
    ["p", "𝚙̲"],
    ["q", "𝚚̲"],
    ["r", "𝚛̲"],
    ["s", "𝚜̲"],
    ["t", "𝚝̲"],
    ["u", "𝚞̲"],
    ["v", "𝚟̲"],
    ["w", "𝚠̲"],
    ["x", "𝚡̲"],
    ["y", "𝚢̲"],
    ["z", "𝚣̲"],
  ]),
};

function extractText(content: Node | Node[]): string {
  const nodes = Array.isArray(content) ? content : [content];

  let result = "";

  nodes.forEach((node) => {
    if (node.type === "paragraph") {
      result += extractText(node.children || []) + "\n\n";
    } else {
      let text = node.text || "";

      // Apply styles using Unicode characters for bold, italic, boldItalic, and underline
      text = text
        .split("")
        .map((char) => {
          let styledChar = char;
          if (node.bold && node.italic) {
            styledChar = characterMaps.boldItalic.get(char) || char;
          } else if (node.bold) {
            styledChar = characterMaps.bold.get(char) || char;
          } else if (node.italic) {
            styledChar = characterMaps.italic.get(char) || char;
          }
          if (node.underline) {
            styledChar = characterMaps.underline.get(char) || char;
            styledChar += "\u0332"; // Add lowline unicode for underline
          }
          return styledChar;
        })
        .join("");

      result += text;
    }
  });

  return result.trim();
}

export async function POST(request: Request) {
  try {
    const { userId, postId, content, documentUrn } = await request.json();

    console.log("Content received: ", content);
    await saveDraft(postId, content);

    if (!userId || !postId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    let formattedContent;
    try {
      formattedContent = extractText(JSON.parse(content));
    } catch (parseError) {
      console.error("Error parsing content:", parseError);
      return NextResponse.json(
        { error: "Invalid content format" },
        { status: 400 },
      );
    }

    const linkedInId = await getLinkedInId(userId);
    const accessToken = await getAccessToken(userId);

    if (!linkedInId || !accessToken) {
      console.error("Unable to retrieve LinkedIn credentials");
      return NextResponse.json(
        { error: "Unable to retrieve LinkedIn credentials" },
        { status: 400 },
      );
    }

    let mediaContent = null;

    if (documentUrn) {
      console.log("Received document URN: ", documentUrn);
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
            title: "PDF Document Title",
          },
        };
      }
    }

    const postBody: any = {
      author: `urn:li:person:${linkedInId}`,
      commentary: formattedContent,
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

    console.log("Posting to LinkedIn:", JSON.stringify(postBody, null, 2));

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
    let linkedInPostId;
    let responseData;

    if (response.status === 201) {
      linkedInPostId = response.headers.get("x-restli-id");
      console.log("LinkedIn Post ID:", linkedInPostId);
    } else {
      try {
        responseData = await response.text();
        console.log("LinkedIn API response:", responseData);
      } catch (error) {
        console.error("Error reading LinkedIn API response:", error);
      }
    }

    if (!response.ok) {
      console.error("Error publishing draft", response.status, responseData);
      return NextResponse.json(
        { error: `Error publishing draft: ${responseData}` },
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
