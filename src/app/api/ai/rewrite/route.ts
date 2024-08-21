import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";
import { NextResponse } from "next/server";
import { checkAccess, updateGeneratedWords } from "@/actions/user";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    // Get the user session and check access
    const hasAccess = await checkAccess();

    if (!hasAccess) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const anthropic = new Anthropic({
      apiKey: env.SPIREO_SECRET_KEY,
    });
    const { selectedText, fullContent, option, customPrompt } =
      await req.json();

    const msg = await anthropic.messages.create({
      model: env.MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `
            You are tasked with rewriting or adding content to a selected portion of text while maintaining the context of the full content. Your goal is to improve and enhance the selected text or add new content while ensuring it fits seamlessly within the overall content.

            Here is the full content for context:
            <full_content>
            ${fullContent}
            </full_content>

            Here is the selected text to be rewritten or the insertion point for new content:
            <selected_text>
            ${selectedText}
            </selected_text>

            Rewriting option: ${option}

            ${option === "custom" ? `Custom prompt: ${customPrompt}` : ""}

            Please rewrite the selected text or add new content based on the given option${option === "custom" ? " and custom prompt" : ""}, keeping the following in mind:
            1. Maintain the core message and key points of the selected text (if rewriting)
            2. Ensure the rewritten or new text fits well within the context of the full content
            3. Improve clarity, engagement, and professionalism
            4. Adjust the length according to the option (e.g., make longer, make shorter)
            5. Simplify the language if the option requests it
            6. If user asks for bolded or italic text use unicode text instead of markdown format
            7. If the option is "hook", write an engaging hook that captures the reader's attention and relates to the full content
            8. If the option is "cta", write a compelling call-to-action that encourages the reader to take a specific action based on the full content
            ${option === "custom" ? "9. Follow the instructions in the custom prompt" : ""}

            Provide the rewritten or new text within <rewritten_text> tags. Do not include any additional comments or explanations.
          `,
        },
      ],
    });

    const content = msg.content[0]?.type === "text" ? msg.content[0].text : "";

    const outputTokens = msg.usage.output_tokens;
    const estimatedWords = Math.round(outputTokens * 0.75);

    await updateGeneratedWords(estimatedWords);

    const rewrittenText =
      content
        .match(/<rewritten_text>([\s\S]*?)<\/rewritten_text>/)?.[1]
        ?.trim() || "";

    return NextResponse.json({ rewrittenText }, { status: 200 });
  } catch (error) {
    console.error("Error in rewriting text:", error);
    return NextResponse.json(
      { error: "Failed to rewrite text" },
      { status: 500 },
    );
  }
}
