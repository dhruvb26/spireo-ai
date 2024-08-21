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
import { DateTime } from "luxon";

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

  const queue = getQueue();
  if (!queue) {
    console.log("Queue not initialized");
    return NextResponse.json(
      { error: "Queue not initialized" },
      { status: 500 },
    );
  }

  const {
    userId,
    postId,
    scheduledTime,
    timezone,
    documentUrn,
    name,
  }: ScheduleData = await req.json();

  console.log("scheduled time from client: ", scheduledTime);

  const scheduledDate = DateTime.fromISO(scheduledTime, { zone: timezone });

  const draft = await getDraft(postId);

  const content = draft?.data?.content;

  if (!userId || !postId || !content) {
    console.log("Missing required fields for scheduling");
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    // Check if the scheduled time is in the past
    const now = DateTime.now().setZone(timezone);
    if (scheduledDate < now) {
      console.log("Scheduled time is in the past");
      return NextResponse.json(
        { error: "Scheduled time must be in the future" },
        { status: 400 },
      );
    }

    // Handle existing job
    const existingJobId = await getJobId(userId, postId);
    if (existingJobId) {
      await handleExistingJob(queue, existingJobId, userId, postId);
    }

    // Ensure draft exists
    await ensureDraftExists(db, userId, postId, name, content);

    const result = await getDraftDocumentTitle(postId);
    let documentTitle;
    if (result.success) {
      documentTitle = result.data;
    }
    documentTitle = "PDF Document";

    // Prepare job data and options
    const jobData: JobData = {
      userId,
      postId,
      content,
      documentUrn,
      documentTitle,
    };
    const jobOptions = prepareJobOptions(scheduledDate);

    // Add new job to queue
    const job = await queue.add("post", jobData, jobOptions);
    console.log(`New job added to queue with ID: ${job.id}`);

    // Save job ID in Redis
    await saveJobId(userId, postId, job.id || "");

    // Update draft in database
    await updateThisDraft(
      db,
      postId,
      content,
      name,
      documentUrn,
      scheduledDate.toISO() as string,
      timezone,
    );

    await queue.close();

    return NextResponse.json({
      success: true,
      message: existingJobId
        ? "Post rescheduled successfully!"
        : "Post scheduled successfully!",
      jobId: job.id,
      scheduledFor: scheduledDate.toISO(),
      timezone: timezone,
    });
  } catch (error) {
    console.error("Error scheduling post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while scheduling the post",
      },
      { status: 500 },
    );
  }
}

function prepareJobOptions(scheduledDate: DateTime): JobsOptions {
  const now = DateTime.now().toUTC();
  const scheduledUTC = scheduledDate.toUTC();

  const delay = scheduledUTC.toMillis() - now.toMillis();

  if (delay < 0) {
    throw new Error("Scheduled time must be in the future");
  }

  const jobOptions: JobsOptions = {
    removeOnComplete: true,
    removeOnFail: true,
    delay: delay,
  };

  console.log(`Job scheduled for ${scheduledUTC.toISO()} UTC`);

  return jobOptions;
}

async function updateThisDraft(
  db: any,
  postId: string,
  content: string,
  name: string,
  documentUrn: string,
  scheduledTime: string,
  timezone: string,
) {
  const updatedDraft = await db
    .update(drafts)
    .set({
      status: "scheduled",
      content: content,
      name: name,
      documentUrn: documentUrn,
      scheduledFor: scheduledTime ? new Date(scheduledTime) : null,
      timeZone: timezone,
      updatedAt: new Date(),
    })
    .where(eq(drafts.id, postId))
    .returning();

  if (updatedDraft.length === 0) {
    throw new Error(`Failed to update draft for post ${postId}`);
  }
  console.log(`Draft updated successfully for post ${postId}`);
}

async function handleExistingJob(
  queue: Queue,
  existingJobId: string,
  userId: string,
  postId: string,
) {
  console.log(`Existing job found for post ${postId}: ${existingJobId}`);
  const existingJob = await queue.getJob(existingJobId);
  if (existingJob) {
    await queue.remove(existingJobId);
    console.log(`Removed existing job ${existingJobId} from queue`);
  }
  await deleteJobId(userId, postId);
  console.log(`Deleted job ID ${existingJobId} from Redis`);
}

async function ensureDraftExists(
  db: any,
  userId: string,
  postId: string,
  name: string,
  content: string,
) {
  const existingDraft = await db
    .select()
    .from(drafts)
    .where(and(eq(drafts.id, postId), eq(drafts.userId, userId)))
    .limit(1);

  if (existingDraft.length === 0) {
    console.log(`Draft not found for post ${postId}, creating new draft`);
    await db.insert(drafts).values({
      id: postId,
      userId: userId,
      name: name,
      content: content,
      status: "saved",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`New draft created for post ${postId}`);
  }
}

export async function DELETE(req: Request) {
  console.log("DELETE request received for scheduled post");
  const body = await req.json();

  const userId = await getUserId();

  const { postId } = body;

  if (!userId || !postId) {
    console.log("Missing required fields for DELETE request");
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const queue = getQueue();
    if (!queue) {
      console.log("Queue not initialized for DELETE request");
      return NextResponse.json(
        { error: "Queue not initialized" },
        { status: 500 },
      );
    }

    // First, try to get the job ID from Redis
    const jobId = await getJobId(userId, postId);
    console.log(
      `Job ID from Redis for user ${userId}, post ${postId}: ${jobId}`,
    );

    if (jobId) {
      // If we have a job ID, try to remove it from the queue
      const job = await queue.getJob(jobId);
      if (job) {
        await job.remove();
        console.log(`Removed job ${jobId} from queue`);
      } else {
        console.log(`Job ${jobId} not found in queue`);
      }

      // Always delete the job ID from Redis, even if the job wasn't in the queue
      await deleteJobId(userId, postId);
      console.log(
        `Deleted job ID from Redis for user ${userId}, post ${postId}`,
      );
    } else {
      console.log(
        `No job ID found in Redis for user ${userId}, post ${postId}`,
      );
    }

    // Now update the draft status to 'saved' instead of deleting it
    const result = await updateDraft(postId, "saved");

    await db
      .update(drafts)
      .set({
        scheduledFor: null,
      })
      .where(eq(drafts.id, postId));

    if (result.success) {
      console.log(`Draft status updated to 'saved' for post ${postId}`);
      return NextResponse.json({ message: result.message });
    } else {
      console.log(`Failed to update draft status for post ${postId}`);
      return NextResponse.json({ error: result.message }, { status: 404 });
    }
  } catch (error) {
    console.error("Error in DELETE method:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 },
    );
  }
}
