import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";
import { checkAccess, updateGeneratedWords } from "@/actions/user";
import { extract } from "@extractus/article-extractor";

export async function POST(req: Request) {
  // Get the user session
  const hasAccess = await checkAccess();

  // Check if the user has access
  if (!hasAccess) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const body = await req.json();
  const { url, instructions, formatTemplate, engagementQuestion, CTA } = body;
  const anthropic = new Anthropic({
    apiKey: env.SPIREO_SECRET_KEY,
  });

  try {
    const data = await extract(url);

    if (!data || !data.content) {
      throw new Error("Failed to extract content from the URL");
    }

    // Clean up the extracted content
    const cleanContent = data.content
      .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
      .replace(/\n+/g, "\n") // Replace multiple newlines with a single newline
      .trim(); // Remove leading and trailing whitespace

    const stream = await anthropic.messages.create({
      model: env.MODEL,
      max_tokens: 1024,
      stream: true,
      messages: [
        {
          role: "user",
          content: `You are tasked with creating an informative LinkedIn post based on a blog article. Your goal is to understand the context of the article and generate a post that captures its key points and value.

                    First, carefully read and analyze the following article content:

                    <article_content>
                    ${cleanContent}
                    </article_content>

                    As you analyze the content, pay attention to:
                    1. The main topic or theme of the article
                    2. Key points or arguments presented
                    3. Any notable quotes or statistics
                    4. The overall message or takeaway

                    Based on your analysis, create a LinkedIn post that:
                    1. Summarizes the main idea of the article
                    2. Highlights 2-3 key points or insights
                    3. Is concise and engaging, suitable for a professional audience on LinkedIn
                    4. Contains about 200-250 words

                    If custom instructions are provided, incorporate them into your post creation process:
                    <custom_instructions>
                    ${instructions}
                    </custom_instructions>

                    If a format template is provided, use it to structure your post:
                    <format_template>
                    ${formatTemplate}
                    </format_template>

                    If a call-to-action (CTA) is provided, include it in your post:
                    <cta>
                    ${CTA}
                    </cta>

                    If engagement questions are provided, incorporate them into your post:
                    <engagement_questions>
                    ${engagementQuestion}
                    </engagement_questions>

                    If no custom instructions, format template, CTA, or engagement questions are provided, use your best judgment to create an informative and engaging LinkedIn post.

                    Use relevant emoticons unless specifically instructed not to in the custom instructions. Do not include hashtags unless explicitly mentioned in the custom instructions.

                    Important: Generate and output only the content of the LinkedIn post directly. Do not include any XML tags, metadata, or additional commentary. The post should be ready to be shared on LinkedIn as-is.`,
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
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
