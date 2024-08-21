import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";
import { checkAccess, updateGeneratedWords } from "@/actions/user";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    // Get the user session
    const hasAccess = await checkAccess();

    // Check if the user has access
    if (!hasAccess) {
      return NextResponse.json({ error: "Not authorized!" }, { status: 401 });
    }

    const anthropic = new Anthropic({
      apiKey: env.SPIREO_SECRET_KEY,
    });

    const stream = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      stream: true,
      messages: [
        {
          role: "user",
          content: `
            You are a human instructing an AI model to generate custom instructions for generating a LinkedIn post. Write a prompt that will guide the AI to create these instructions. The prompt should cover:

            1. Tone and style appropriate for LinkedIn
            2. Content structure (e.g., bullet points, paragraphs)
            3. Word count recommendation
            4. Use of emojis
            5. Hashtag usage
            6. Call-to-action for engagement

            Your prompt should be concise, around 50 words, and in paragraph style without bullet points. Enclose the entire prompt within <generated></generated> tags, but in your response, only include the content within these tags without the tags themselves.

            Remember, you are acting as a human giving instructions to an AI, not as the AI itself.
          `,
        },
      ],
    });

    const encoder = new TextEncoder();
    let isWithinTags = false;
    let wordCount = 0;
    const readable = new ReadableStream({
      async start(controller) {
        let isFirstChunk = true;
        let buffer = "";
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            let text = chunk.delta.text;
            buffer += text;

            if (buffer.includes("<generated>")) {
              isWithinTags = true;
              buffer = buffer.split("<generated>")[1] as any;
              continue;
            }

            if (buffer.includes("</generated>")) {
              isWithinTags = true;
              text = buffer.split("</generated>")[0] as any;
              controller.enqueue(encoder.encode(text));
              wordCount += text
                .split(/\s+/)
                .filter((word: string) => word.length > 0).length;
              controller.close();
              break;
            }

            if (isWithinTags) {
              if (isFirstChunk) {
                text = text.trimStart();
                isFirstChunk = false;
              }
              controller.enqueue(encoder.encode(text));
              wordCount += text
                .split(/\s+/)
                .filter((word: string) => word.length > 0).length;
              buffer = "";
            }
          }
        }
        if (isWithinTags) {
          controller.close();
        }

        // Call the updateGeneratedWords action with the total word count
        await updateGeneratedWords(wordCount);
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error generating instructions:", error);
    return NextResponse.json(
      { error: "Failed to generate instructions" },
      { status: 500 },
    );
  }
}
