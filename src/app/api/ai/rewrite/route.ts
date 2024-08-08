
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";
import { NextResponse } from "next/server";
import { checkAccess } from "@/actions/user";
export const maxDuration = 60;

export async function POST(req: Request) {
  // Get the user session
  const hasAccess = await checkAccess();

  // Check if the user has access
  if (!hasAccess) {
    return NextResponse.json({ error: "Not authorized!" }, { status: 401 });
  }

  const anthropic = new Anthropic({
    apiKey: env.SPIREO_SECRET_KEY,
  });

  const body = await req.json();
  const { selectedText, fullContent } = body;

  try {
    const msg = await anthropic.messages.create({
      model: env.MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `
            You are tasked with rewriting a selected portion of text while maintaining the context of the full content. Your goal is to improve and enhance the selected text while ensuring it fits seamlessly within the overall content.

            Here is the full content for context:
            <full_content>
            ${fullContent}
            </full_content>

            Here is the selected text to be rewritten:
            <selected_text>
            ${selectedText}
            </selected_text>

            Please rewrite the selected text, keeping the following in mind:
            1. Maintain the core message and key points of the selected text
            2. Ensure the rewritten text fits well within the context of the full content
            3. Improve clarity, engagement, and professionalism
            4. Keep the length similar to the original selected text
            5. If user asks for bolded or italic text use unicode text instead of markdown format.

            Provide the rewritten text within <rewritten_text> tags. Do not include any additional comments or explanations.
          `,
        },
      ],
    });

    // Extract text from the generated message
    const content = msg.content[0]?.type === "text" ? msg.content[0].text : "";

    // Extract the rewritten text from within the tags
    const rewrittenText = content.match(/<rewritten_text>([\s\S]*?)<\/rewritten_text>/)?.[1] || "";

    // Return the rewritten content as a response
    return NextResponse.json(
      { rewrittenText: rewrittenText.trim() },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in rewriting text:", error);
    return NextResponse.json(
      { error: "Failed to rewrite text" },
      { status: 500 },
    );
  }
}
