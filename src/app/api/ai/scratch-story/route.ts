"use server";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";

export async function POST(req: Request) {
  const body = await req.json();
  const anthropic = new Anthropic({
    apiKey: env.SPIREO_SECRET_KEY,
  });
  const { postContent, tone, instructions, formatTemplate } = body;

  const stream = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1024,
    stream: true,
    messages: [
      {
        role: "user",
        content: `
          You are tasked with writing a story for a LinkedIn post based on a given idea or topic. Your goal is to create engaging content that resonates with a professional audience while adhering to specific guidelines.

          Here are the inputs you will work with:

          <topic>
          {${postContent}}
          </topic>

          <tone>
          {${tone}}
          </tone>

          <post_format>
          {${formatTemplate}}
          </post_format>

          <custom_instructions>
          {${instructions}}
          </custom_instructions>

          Follow these steps to create your LinkedIn story:

          1. Carefully read and understand the given topic. This will be the main focus of your story.

          2. Consider the specified tone. Adjust your writing style to match this tone throughout the story. For example, if the tone is "inspirational," use uplifting language and focus on positive outcomes.

          3. If a post format is provided, follow it strictly. This may include specific structures like bullet points, numbered lists, or paragraph arrangements. If no format is specified, use a clear and professional structure suitable for LinkedIn.

          4. Pay close attention to any custom instructions provided. These should be followed precisely as they may contain important details about content, length, or specific elements to include or avoid.

          5. Begin your story with a compelling hook that relates to the topic and captures the reader's attention.

          6. Develop the main body of the story, ensuring it remains relevant to the topic and maintains the specified tone throughout.

          7. Include a clear takeaway or call-to-action that encourages engagement from your LinkedIn audience.

          8. Proofread your story for grammar, spelling, and clarity. Ensure it maintains a professional tone suitable for LinkedIn, regardless of the specific tone requested.

          9. If the custom instructions or post format require any specific hashtags, mentions, or LinkedIn-specific features (like polls or carousel posts), include these as directed.

          Write your final LinkedIn story directly without any surrounding tags. Ensure that your story adheres to all the guidelines provided, including topic, tone, post format (if given), and any custom instructions.

          Remember, the goal is to create a story that is engaging, professional, and tailored specifically for a LinkedIn audience while strictly following all provided instructions.
          `,
      },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
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
