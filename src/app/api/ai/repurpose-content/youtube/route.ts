"use server";
import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";

export async function POST(req: Request) {
  const body = await req.json();
  const { url, instructions, formatTemplate } = body;
  const anthropic = new Anthropic({
    apiKey: env.SPIREO_SECRET_KEY,
  });

  // Convert YouTube Shorts URL to regular URL if necessary
  const regularUrl = convertToRegularYouTubeUrl(url);

  // Get transcript
  const transcript = await YoutubeTranscript.fetchTranscript(regularUrl);

  // Combine transcript text
  const plainText = combineTranscriptText(transcript);

  // Here you can add any additional processing based on instructions and formatTemplate
  // For now, we're just returning the plain text
  const stream = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
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
    
                  Based on your analysis, create a LinkedIn post that:
                  1. Summarizes the main idea of the video
                  2. Highlights 2-3 key points or insights
                  3. Includes a thought-provoking question or call-to-action for the audience
                  4. Is concise and engaging, suitable for a professional audience on LinkedIn
    
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
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    },
  });
}

function combineTranscriptText(transcriptData: any[]): string {
  return transcriptData
    .map((item) => item.text)
    .join(" ")
    .replace(/&amp;#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
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
