"use server";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { drafts } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { getQueue } from "@/server/bull/queue";
import { saveJobId, getJobId, deleteJobId } from "@/server/redis";
import { checkAccess, getUserId } from "@/actions/user";
import { getDraft, getDraftDocumentTitle, updateDraft } from "@/actions/draft";
import { type Queue } from "bullmq";
import { type JobsOptions } from "bullmq";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { isBefore } from "date-fns";

interface ScheduleData {
  userId: string;
  postId: string;
  scheduledTime: string;
  documentUrn: string;
  timezone: string;
  name: string;
}

interface JobData {
  userId: string;
  postId: string;
  content: string;
  documentUrn: string;
  documentTitle?: string;
}

export async function POST(req: Request) {
  if (!(await checkAccess())) {
    console.log("Access denied for scheduling request");
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  //   const queue = getQueue();
  //   if (!queue) {
  //     console.log("Queue not initialized");
  //     return NextResponse.json(
  //       { error: "Queue not initialized" },
  //       { status: 500 },
  //     );
  //   }

  const {
    userId,
    postId,
    scheduledTime,
    timezone,
    documentUrn,
    name,
  }: ScheduleData = await req.json();

  console.log("Scheduled time from client: ", scheduledTime);

  console.log("New Date: ", new Date(scheduledTime));

  console.log("New Date ISO: ", new Date(scheduledTime).toISOString());

  console.log("New Date UTC: ", new Date(scheduledTime).toUTCString());

  console.log(
    "From zoned time ISO: ",
    fromZonedTime(scheduledTime, timezone).toISOString(),
  );

  console.log(
    "From zoned time UTC: ",
    fromZonedTime(scheduledTime, timezone).toUTCString(),
  );

  console.log("To zoned time: ", toZonedTime(scheduledTime, timezone));

  return NextResponse.json({ message: "sucess" });
}
