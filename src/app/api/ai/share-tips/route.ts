"use server";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";
import { NextResponse } from "next/server";
import { checkAccess, updateGeneratedWords } from "@/app/actions/user";

export async function POST(req: Request) {
  // Get the user session
  const hasAccess = await checkAccess();

  // Check if the user has access
  if (!hasAccess) {
    return NextResponse.json({ ideas: "Not authorized!" }, { status: 401 });
  }

  const body = await req.json();
  const anthropic = new Anthropic({
    apiKey: env.SPIREO_SECRET_KEY,
  });

  const { tips, instructions, formatTemplate } = body;

  const stream = await anthropic.messages.create({
    model: env.MODEL,
    max_tokens: 1024,
    stream: true,
    messages: [
      {
        role: "user",
        content: `
        You are tasked with generating a LinkedIn post that shares tips. Your goal is to create an engaging and informative post that follows any provided instructions and formatting guidelines.

        First, here are the tips to be shared in the LinkedIn post:
        <tips>
        {${tips}}
        </tips>

        If custom instructions are provided, follow them strictly. Here are the custom instructions (if any):
        <custom_instructions>
        {${instructions}}
        </custom_instructions>

        If format templates are provided, use them exactly as specified. Here are the format templates (if any):
        <format_templates>
        {${formatTemplate}}
        </format_templates>

        Guidelines for generating the LinkedIn post:
        1. If no custom instructions or format templates are provided, create a post that introduces the topic, lists the tips in a clear and concise manner, and concludes with a call to action or engaging question.
        2. Keep the post professional and appropriate for a LinkedIn audience.
        3. Use appropriate hashtags related to the topic of the tips.
        4. Aim for a length of 1300-1500 characters, which is optimal for LinkedIn posts.
        5. If custom instructions are provided, prioritize following those instructions over these general guidelines.
        6. If format templates are provided, use them exactly as specified, inserting the tips and any other required content into the template.

        Important: Output only the content of the LinkedIn post directly, without any surrounding tags or additional commentary. The post will be streamed directly to the frontend, so ensure that your output is ready to be displayed as-is.
        `,
      },
    ],
  });

  const encoder = new TextEncoder();

  let wordCount = 0;
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          const text = chunk.delta.text;
          controller.enqueue(encoder.encode(text));

          // Count words in this chunk
          const wordsInChunk = text
            .split(/\s+/)
            .filter((word) => word.length > 0).length;
          wordCount += wordsInChunk;
        }
      }
      controller.close();

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
}
