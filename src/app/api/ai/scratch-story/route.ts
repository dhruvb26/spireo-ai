"use server";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";
import { NextResponse } from "next/server";
import { checkAccess, updateGeneratedWords } from "@/app/actions/user";
import { JSDOM } from "jsdom";

function extractLinkedInPostId(url: string): string {
  const regex = /activity-(\d+)/;

  const match = url.match(regex) as any;

  if (match) {
    return match[1];
  }
  return "";
}
function extractCommentary(response: any): string {
  try {
    const commentary = response.response.elements[0].commentary.text.text;
    return commentary;
  } catch (error) {
    console.error("Error extracting commentary:", error);
    return "";
  }
}

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
  const { postContent, tone, instructions, formatTemplate, linkedInPostUrl } =
    body;

  // const postUrn = extractLinkedInPostId(linkedInPostUrl);
  // let postData = null;
  // let postText = "";
  // if (postUrn) {
  //   console.log(postUrn);
  //   // Fetch post data from Lix API
  //   try {
  //     const response = await fetch(
  //       `https://api.lix-it.com/v1/enrich/post?post_urn=urn%3Ali%3Aactivity%3A${postUrn}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `xJHvO3bJYunIdIN9TDf8rwywGVnfXBb1i0SluKiwcOCQXTcw3TcEaC36STta`, // Make sure to add LIX_API_KEY to your env file
  //           "Content-Type": "application/json",
  //         },
  //       },
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     postData = await response.json();
  //     postText = extractCommentary(postData);
  //     console.log(postText);
  //   } catch (error) {
  //     console.error("Error fetching post data from Lix:", error);
  //   }
  // }

  const stream = await anthropic.messages.create({
    model: env.MODEL,
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

          3. If a post format or context post is provided, follow it strictly. This may include specific structures like bullet points, numbered lists, emojis, formatted text, or paragraph arrangements. If no format or context is specified, use a clear and professional structure suitable for LinkedIn.

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
