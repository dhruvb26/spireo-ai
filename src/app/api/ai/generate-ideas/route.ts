import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";
import { NextResponse } from "next/server";
import { checkAccess, updateGeneratedWords } from "@/actions/user";
export const maxDuration = 60;

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

  const { topic } = body;

  const msg = await anthropic.messages.create({
    model: env.MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `
            You are tasked with generating ideas for a LinkedIn post based on a given topic and a specified language. Your goal is to create a list of engaging and professional post ideas that expand upon the original concept while maintaining relevance to the LinkedIn platform.

            You will be provided with two inputs:
            <topic>
            {${topic}}
            </topic>

            <language>
            English
            </language>

            Guidelines for generating ideas:
            1. Expand on the original topic, providing different angles or perspectives.
            2. Ensure all ideas are appropriate for a professional LinkedIn audience.
            3. Incorporate current trends or best practices in professional networking, if relevant.
            5. Aim for a mix of informative, inspirational, and engaging posts.
            6. Tailor the language and tone to the specified language and cultural context.

            Output your list of ideas in the following format:
            <ideas>
             [First idea]
             [Second idea]
             [Third idea]
            ...
            </ideas>

            Aim to generate no more than 10 ideas.

            Here's an example of a good output:

            <example>
            Input topic: SEO (Search Engine Optimization)
            Language: English

            <ideas>
             5 Ways to Stay Ahead in Tech: A Continuous Learning Roadmap
             From Novice to Expert: My 30-Day Coding Challenge Journey
             Why Embracing Failure is Crucial for Innovation in Tech
             The Hidden Benefits of Teaching Others in Your Tech Career
            </ideas>
            </example>

            If the provided idea is vague or too broad, focus on generating ideas that could appeal to a wide range of professionals on LinkedIn. If the idea is not suitable for LinkedIn or professional networking, politely explain why and suggest a more appropriate topic.

            Begin generating ideas now.`,
      },
    ],
  });

  // Extract ideas from the generated message
  const content = msg.content[0];

  const outputTokens = msg.usage.output_tokens;

  const estimatedWords = Math.round(outputTokens * 0.75);

  await updateGeneratedWords(estimatedWords);

  if (!content) {
    return NextResponse.json({ ideas: [] }, { status: 200 });
  }

  let ideasText = "";

  if ("text" in content) {
    ideasText = content.text;
  }

  const ideasMatch = ideasText.match(/<ideas>([\s\S]*?)<\/ideas>/);
  const ideasListText = ideasMatch ? ideasMatch[1] : "";
  const ideasList = ideasListText
    ?.split("\n")
    .map((idea) => idea.trim())
    .filter((idea) => idea !== "");

  // Return the ideas as a response
  return NextResponse.json({ ideas: ideasList }, { status: 200 });
}
