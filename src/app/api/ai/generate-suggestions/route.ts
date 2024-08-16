import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";
import { NextResponse } from "next/server";
import {
  checkAccess,
  getUserFromDb,
  updateGeneratedWords,
} from "@/actions/user";
export const maxDuration = 60;

export async function GET(req: Request) {
  try {
    // Get the user session
    const hasAccess = await checkAccess();

    // Check if the user has access
    if (!hasAccess) {
      return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }

    const user = await getUserFromDb();

    if (!user) {
      return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
    }

    if (!user.onboardingCompleted) {
      return NextResponse.json(
        { message: "Onboarding not completed yet" },
        { status: 403 },
      );
    }

    const anthropic = new Anthropic({
      apiKey: env.SPIREO_SECRET_KEY,
    });

    // Extract topics and role from user object
    const userInfo = user.onboardingData as { topics: string[]; role: string };
    if (!userInfo) {
      return NextResponse.json(
        { message: "Onboarding not completed yet" },
        { status: 403 },
      );
    }
    const topics = userInfo.topics || [];

    const role = userInfo.role || "";

    const msg = await anthropic.messages.create({
      model: env.MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are tasked with generating ideas for LinkedIn posts based on a person's professional role and the topics they're interested in posting about. Your goal is to create a list of engaging and professional post ideas that are relevant to the given role and expand upon the provided topics while maintaining relevance to the LinkedIn platform.

                    You will be provided with two inputs:
                    <role>
                    ${role}
                    </role>

                    <topics>
                    ${topics.join(", ")}
                    </topics>

                    Guidelines for generating ideas:
                    1. Ensure all ideas are appropriate for the given professional role and LinkedIn audience.
                    2. Incorporate current trends or best practices in the professional field, if relevant.
                    3. Aim for a mix of informative, inspirational, and engaging posts.
                    4. Tailor the language and tone to a professional context.
                    5. Return a list of ideas, each on a new line. Without any bullet points or quotes.
                    6. Length of the ideas should be between 5 and 10 words.

                    Output your list of ideas in the following format:
                    <ideas>
                    [First idea]
                    [Second idea]
                    [Third idea]
                    </ideas>

                    Aim to generate 3 ideas.

                    If the provided role or topics are vague or too broad, focus on generating ideas that could appeal to a wide range of professionals on LinkedIn within that general field. If any topic is not suitable for LinkedIn or professional networking, politely explain why and suggest a more appropriate related topic.

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

    console.log(ideasText);

    const ideasMatch = ideasText.match(/<ideas>([\s\S]*?)<\/ideas>/);
    const ideasListText = ideasMatch ? ideasMatch[1] : "";
    const ideasList = ideasListText
      ?.split("\n")
      .map((idea) => idea.trim())
      .filter((idea) => idea !== "");

    // Return the ideas as a response
    return NextResponse.json({ ideas: ideasList }, { status: 200 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
