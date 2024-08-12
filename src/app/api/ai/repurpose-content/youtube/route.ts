export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { ClientType, Innertube } from "youtubei.js/web";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";
import { checkAccess, updateGeneratedWords } from "@/actions/user";

export async function POST(req: Request) {
  // Get the user session
  const hasAccess = await checkAccess();

  // Check if the user has access
  if (!hasAccess) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const body = await req.json();
  const { url, instructions, formatTemplate } = body;
  const anthropic = new Anthropic({
    apiKey: env.SPIREO_SECRET_KEY,
  });

  // Convert YouTube Shorts URL to regular URL if necessary
  const regularUrl = convertToRegularYouTubeUrl(url);

  try {
    // Get transcript
    const transcript = await fetchTranscript(regularUrl);

    // Combine transcript text
    const plainText = combineTranscriptText(transcript);

    const stream = await anthropic.messages.create({
      model: env.MODEL,
      max_tokens: 1024,
      stream: true,
      messages: [
        {
          role: "user",
          content: `You are tasked with creating an informative LinkedIn post based on a YouTube video transcript. Your goal is to understand the context of the video and generate a post that captures its key points and value.
    
                    Here is the transcript of the YouTube video:
                    <transcript>
                    ${plainText}
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
    
                    If custom instructions are provided, incorporate them into your post creation process:
                    <custom_instructions>
                    ${instructions}
                    </custom_instructions>
    
                    If a format template is provided, use it to structure your post:
                    <format_template>
                    ${formatTemplate}
                    </format_template>
    
                    If no custom instructions or format template are provided, use your best judgment to create an informative and engaging LinkedIn post.
    
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

function combineTranscriptText(transcriptData: string[]): string {
  return transcriptData.join(" ").replace(/\s+/g, " ").trim();
}

function convertToRegularYouTubeUrl(url: string): string {
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
}

function getVideoId(url: string): string {
  const regularUrl = convertToRegularYouTubeUrl(url);
  const videoIdRegex = /(?:v=|\/)([a-zA-Z0-9_-]{11})/;
  const match = regularUrl.match(videoIdRegex);

  if (match && match[1]) {
    return match[1];
  }

  throw new Error("Invalid YouTube URL");
}
async function fetchTranscript(url: string): Promise<string[]> {
  try {
    const youtube = await Innertube.create({
      lang: "en",
      location: "US",
      retrieve_player: true,
      client_type: ClientType.WEB,
    });

    const videoId = getVideoId(url);
    const info = await youtube.getInfo(videoId);
    const transcriptInfo = await info.getTranscript();

    if (
      !transcriptInfo ||
      !transcriptInfo.transcript ||
      !transcriptInfo.transcript.content
    ) {
      throw new Error("No transcript available for this video");
    }

    const transcriptContent = transcriptInfo.transcript.content;

    if (
      transcriptContent.type !== "TranscriptSearchPanel" ||
      !transcriptContent.body ||
      transcriptContent.body.type !== "TranscriptSegmentList"
    ) {
      throw new Error("Transcript content structure is not as expected");
    }

    const segments = transcriptContent.body.initial_segments;

    if (!Array.isArray(segments)) {
      throw new Error("Transcript segments are not in the expected format");
    }

    const transcriptLines = segments
      .map((segment) => {
        if (
          segment.type === "TranscriptSegment" &&
          segment.snippet &&
          segment.snippet.text
        ) {
          return segment.snippet.text;
        }
        return "";
      })
      .filter((text) => text !== "");

    console.log("Extracted transcript:", transcriptLines);

    return transcriptLines;
  } catch (error) {
    console.error("Error fetching transcript:", error);
    console.log("Detailed error:", JSON.stringify(error, null, 2));
    throw error;
  }
}
