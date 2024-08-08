
import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";
import { checkAccess, updateGeneratedWords } from "@/actions/user";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    console.log("Starting POST request processing");

    // Get the user session
    const hasAccess = await checkAccess();

    // Check if the user has access
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

    // Convert YouTube Shorts URL to regular URL if necessary
    // const regularUrl = convertToRegularYouTubeUrl(url);
    // console.log(`Converted URL: ${regularUrl}`);

    // Get transcript
    let transcript;
    try {
      transcript = await YoutubeTranscript.fetchTranscript(url); 
      console.log("Successfully fetched transcript");
    } catch (error) {
      console.error("Error fetching transcript:", error);
      return NextResponse.json({ error: "Failed to fetch transcript" }, { status: 500 });
    }

    // Combine transcript text
    const plainText = combineTranscriptText(transcript);
    console.log("Transcript combined");

    // Here you can add any additional processing based on instructions and formatTemplate
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
      return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function combineTranscriptText(transcriptData: any[]): string {
  try {
    return transcriptData
      .map((item) => item.text)
      .join(" ")
      .replace(/&amp;#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  } catch (error) {
    console.error("Error combining transcript text:", error);
    throw error;
  }
}

function convertToRegularYouTubeUrl(url: string): string {
  try {
    // Regular expression to match YouTube Shorts URL
    const shortsRegex =
      /^https?:\/\/(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i;
    const match = url.match(shortsRegex);

    if (match && match[1]) {
      // If it's a Shorts URL, convert it to a regular YouTube URL
      return `https://www.youtube.com/watch?v=${match[1]}`;
    }

    // If it's not a Shorts URL, return the original URL
    return url;
  } catch (error) {
      console.error("Error converting YouTube URL:", error)
    throw error;
  }
}
