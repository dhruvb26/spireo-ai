"use server";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";
import { NextResponse } from "next/server";
import { checkAccess } from "@/app/actions/user";

export async function POST(req: Request) {
  // Get the user session
  const hasAccess = await checkAccess();

  // Check if the user has access
  if (!hasAccess) {
    return NextResponse.json({ ideas: "Not authorized!" }, { status: 401 });
  }

  const anthropic = new Anthropic({
    apiKey: env.SPIREO_SECRET_KEY,
  });

  const body = await req.json();
  const { originalContent } = body;

  const msg = await anthropic.messages.create({
    model: env.MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `
            You are tasked with enhancing content for a LinkedIn post. Your goal is to improve the original content while maintaining its core message and adapting its style to be more engaging and professional, similar to the given LinkedIn posts.

            Here is the original content to be enhanced:
            <original_content>
            ${originalContent}
            </original_content>

            To help you understand the style and tone of given LinkedIn posts, here are some examples for context:
            <context_posts>
            {{CONTEXT_POSTS}}
            </context_posts>

            Analyze the context posts, paying attention to:
            1. The overall tone and level of professionalism
            2. Use of hashtags and mentions
            3. How they engage the reader (e.g., questions, calls to action)
            4. Structure and formatting (e.g., use of bullet points, emojis)
            5. Length and conciseness of the posts

            Now, enhance the original content by:
            1. Maintaining the core message and key points
            2. Adapting the tone to be more professional and engaging, similar to the context posts
            3. Adding relevant hashtags and mentions where appropriate
            4. Incorporating elements that encourage engagement (e.g., a question or call to action)
            5. Improving the structure and readability (e.g., using bullet points or line breaks if beneficial)
            6. Ensuring the content is concise and impactful

            The target length for the enhanced content is similar to the original content. Adjust the content accordingly while preserving the most important information.

            Present your enhanced LinkedIn post inside <enhanced_post> tags.

            Remember to maintain a professional and engaging tone throughout the enhanced post, similar to the given LinkedIn posts provided for context.`,
      },
    ],
  });

  // Extract text from the generated message
  const content = msg.content[0]?.type === "text" ? msg.content[0].text : "";

  // Extract the enhanced post content
  const enhancedPostMatch = content.match(
    /<enhanced_post>([\s\S]*?)<\/enhanced_post>/,
  );
  const enhancedContent = enhancedPostMatch ? enhancedPostMatch[1]?.trim() : "";

  // Return only the enhanced content as a response
  return NextResponse.json({ enhancedContent }, { status: 200 });
}
