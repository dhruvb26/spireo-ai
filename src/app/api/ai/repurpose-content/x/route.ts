"use server";
import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";

export async function POST(req: Request) {
  const body = await req.json();
}
