import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { drafts } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { queue } from "@/server/bull/queue";
import { saveJobId } from "@/server/redis";
import { getJobId, deleteJobId } from "@/server/redis";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, postId, content, scheduledTime } = body;

  if (!userId || !postId || !content) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    // Check if the draft exists
    let draft = await db
      .select()
      .from(drafts)
      .where(and(eq(drafts.id, postId), eq(drafts.userId, userId)))
      .limit(1);

    if (draft.length === 0) {
      // If draft doesn't exist, create it
      draft = await db
        .insert(drafts)
        .values({
          id: postId,
          userId: userId,
          content: content,
          status: "saved",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
    }

    console.log(
      `Scheduling a post for user ${userId} with content: ${content}`,
    );

    const jobData = {
      userId,
      postId,
      content,
    };

    const jobOptions: any = {};
    const now = new Date();

    if (scheduledTime) {
      const scheduledDate = new Date(scheduledTime);
      if (isNaN(scheduledDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid scheduledTime" },
          { status: 400 },
        );
      }

      if (scheduledDate <= now) {
        return NextResponse.json(
          { error: "Scheduled time must be in the future" },
          { status: 400 },
        );
      }

      jobOptions.delay = scheduledDate.getTime() - now.getTime();
      console.log(`Post scheduled for ${scheduledDate.toISOString()}`);
    } else {
      console.log(
        "No scheduled time provided. Post queued for immediate processing.",
      );
    }

    // Add a job to the queue
    const job = await queue.add("post", jobData, jobOptions);

    // Save the job ID in Redis
    await saveJobId(userId, postId, job.id || "");

    const scheduledFor = jobOptions.delay
      ? new Date(now.getTime() + jobOptions.delay).toISOString()
      : now.toISOString();

    // Update the draft in the database
    const updatedDraft = await db
      .update(drafts)
      .set({
        status: "scheduled",
        content: content,
        scheduledFor: scheduledTime ? new Date(scheduledTime) : null,
        updatedAt: new Date(),
      })
      .where(eq(drafts.id, postId))
      .returning();

    if (updatedDraft.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update draft",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Post scheduled successfully!",
      jobId: job.id,
      scheduledFor: scheduledFor,
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
export async function DELETE(req: Request) {
  const body = await req.json();
  const { userId, postId } = body;

  if (!userId || !postId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const jobId = await getJobId(userId, postId);

  if (!jobId) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const job = await queue.getJob(jobId);

  if (!job) {
    return NextResponse.json(
      { error: "Job not found in queue" },
      { status: 404 },
    );
  }

  await job.remove();
  await deleteJobId(userId, postId);

  return NextResponse.json({ message: "Job removed successfully" });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { userId, postId, content, scheduledTime } = body;

  if (!userId || !postId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const jobId = await getJobId(userId, postId);

  if (!jobId) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const job = await queue.getJob(jobId);

  if (!job) {
    return NextResponse.json(
      { error: "Job not found in queue" },
      { status: 404 },
    );
  }

  // Update job data
  let updatedData = { ...job.data };
  if (content) {
    updatedData.content = content;
  }

  // Update job options
  let updatedOpts = { ...job.opts };
  if (scheduledTime) {
    const scheduledDate = new Date(scheduledTime);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid scheduledTime" },
        { status: 400 },
      );
    }

    const now = new Date();
    if (scheduledDate <= now) {
      return NextResponse.json(
        { error: "Scheduled time must be in the future" },
        { status: 400 },
      );
    } else {
      updatedOpts.delay = scheduledDate.getTime() - now.getTime();
    }
  }

  // Remove the existing job
  await job.remove();

  // Add a new job with updated data and options
  const updatedJob = await queue.add("post", updatedData, updatedOpts);

  // Update the job ID in Redis
  await saveJobId(userId, postId, updatedJob.id || "");

  return NextResponse.json({
    message: "Job updated successfully",
    jobId: updatedJob.id,
    scheduledFor: updatedOpts.delay
      ? new Date(Date.now() + updatedOpts.delay).toISOString()
      : "immediate",
  });
}
