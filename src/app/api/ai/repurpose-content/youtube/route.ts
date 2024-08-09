import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";
import { checkAccess, updateGeneratedWords } from "@/actions/user";
import { getSubtitles } from "youtube-captions-scraper";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    console.log("Starting POST request processing");

    const hasAccess = await checkAccess();
    if (!hasAccess) {
      console.log("User not authorized");
      return NextResponse.json({ ideas: "Not authorized!" }, { status: 401 });
    }

    const body = await req.json();
    const { url, instructions, formatTemplate } = body;
    console.log(`Received request for URL: ${url}`);

    const anthropic = new Anthropic({
      apiKey: env.SPIREO_SECRET_KEY,
    });

    // Extract video ID from URL
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 },
      );
    }

    // Get captions using youtube-captions-scraper
    let captions;
    try {
      captions = await getSubtitles({
        videoID: videoId,
        lang: "en", // default to English
      });
      console.log("Successfully fetched captions");
    } catch (error) {
      console.error("Error fetching captions:", error);
      return NextResponse.json(
        { error: "Failed to fetch captions" },
        { status: 500 },
      );
    }

    // Combine caption text
    const plainText = captions.map((caption) => caption.text).join(" ");
    console.log("Captions combined");

    let stream;
    try {
      stream = await anthropic.messages.create({
        model: env.MODEL,
        max_tokens: 1024,
        stream: true,
        messages: [
          {
            role: "user",
            content: `You are tasked with creating an informative LinkedIn post based on a YouTube video transcript. Your goal is to understand the context of the video and generate a post that captures its key points and value.
    
                      Here is the transcript of the YouTube video:
                      <transcript>
                      {${plainText}}
                      </transcript>
    
                      Carefully read and analyze the transcript. Pay attention to:
                      1. The main topic or theme of the video
                      2. Key points or arguments presented
                      3. Any notable quotes or statistics
                      4. The overall message or takeaway
                      5. Structure of the video (for eg: Podcast, Single person info content)
    
                      Based on your analysis, create a LinkedIn post that:
                      1. Summarizes the main idea of the video
                      2. Highlights 2-3 key points or insights
                      3. Includes a thought-provoking question or call-to-action for the audience
                      4. Is concise and engaging, suitable for a professional audience on LinkedIn
                      5. About 200-250 words with no hashtags unless mentioned in the instructions by the user
                      6. Use of relevant emoticons unless mentioned no emojis in the instructions by the user
                      7. If user asks for bolded or italic text use unicode text instead of markdown format.
    
                      If custom instructions are provided, incorporate them into your post creation process:
                      <custom_instructions>
                      {${instructions}}
                      </custom_instructions>
    
                      If a format template is provided, use it to structure your post:
                      <format_template>
                      {${formatTemplate}}
                      </format_template>
    
                      If no custom instructions or format template are provided, use your best judgment to create an informative and engaging LinkedIn post.
    
                      Important: Generate and output only the content of the LinkedIn post directly. Do not include any XML tags, metadata, or additional commentary. The post should be ready to be shared on LinkedIn as-is.`,
          },
        ],
      });
      console.log("Anthropic stream created");
    } catch (error) {
      console.error("Error creating Anthropic stream:", error);
      return NextResponse.json(
        { error: "Failed to generate content" },
        { status: 500 },
      );
    }

    const encoder = new TextEncoder();

    let wordCount = 0;
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              const text = chunk.delta.text;
              controller.enqueue(encoder.encode(text));

              const wordsInChunk = text
                .split(/\s+/)
                .filter((word) => word.length > 0).length;
              wordCount += wordsInChunk;
            }
          }
          controller.close();

          await updateGeneratedWords(wordCount);
          console.log(`Total words generated: ${wordCount}`);
        } catch (error) {
          console.error("Error processing stream:", error);
          controller.error(error);
        }
      },
    });

    console.log("Returning response");
    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Unexpected error in POST handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
function extractVideoId(url: string): string | null {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? (match[1] ?? null) : null;
}
