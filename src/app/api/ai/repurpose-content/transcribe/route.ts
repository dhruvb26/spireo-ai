import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

import { checkAccess, updateGeneratedWords } from "@/actions/user";
import { AssemblyAI } from "assemblyai";
import { env } from "@/env";

export async function POST(req: Request) {
  const client = new AssemblyAI({
    apiKey: env.ASSEMBLY_API_KEY,
  });

  const audioUrl =
    "https://storage.googleapis.com/aai-web-samples/5_common_sports_injuries.mp3";

  const config = {
    audio_url: audioUrl,
  };

  const run = async () => {
    const transcript = await client.transcripts.transcribe(config);
  };
}
