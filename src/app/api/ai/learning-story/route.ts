"use server";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";
import { checkAccess, updateGeneratedWords } from "@/app/actions/user";
import { NextResponse } from "next/server";

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

  const { learning, how, takeaways, instructions, formatTemplate } = body;

  const stream = await anthropic.messages.create({
    model: env.MODEL,
    max_tokens: 1024,
    stream: true,
    messages: [
      {
        role: "user",
        content: `
            You are tasked with writing a LinkedIn post sharing learnings. Your goal is to create an engaging and informative post that highlights the main learning, how it was acquired, and key takeaways.

                Here are the inputs you'll be working with:

                <learning>
                {${learning}}
                </learning>

                <how_learned>
                {${how}}
                </how_learned>

                <key_takeaways>
                {${takeaways}}
                </key_takeaways>

                <format_template>
                {${formatTemplate}}
                </format_template>

                <custom_instructions>
                {${instructions}}
                </custom_instructions>

                By default, structure your LinkedIn post as follows:
                1. Start with a hook or attention-grabbing statement related to the learning.
                2. Briefly explain what you learned.
                3. Describe how you learned it.
                4. List 2-3 key takeaways.
                5. End with a call to action or thought-provoking question.

                If a format_template is provided, use it to structure your post instead of the default format. Follow the template exactly as given, replacing any placeholders with the appropriate content from the inputs.

                If custom_instructions are provided, follow them strictly when crafting your post. These instructions take precedence over the default format and may include specific requirements for tone, length, or content.

                When writing the post:
                - Keep the tone professional yet conversational.
                - Use clear and concise language.
                - Include relevant hashtags where appropriate.
                - Limit the post to 1300 characters or less (LinkedIn's character limit).

                Write your LinkedIn post without <linkedin_post> tags. Do not include any explanation or commentary outside of these tags.

                [Your LinkedIn post goes here]

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
