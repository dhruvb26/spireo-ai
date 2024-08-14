"use server";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { drafts } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { getQueue } from "@/server/bull/queue";
import { saveJobId } from "@/server/redis";
import { getJobId, deleteJobId } from "@/server/redis";
import { checkAccess } from "@/actions/user";
import { deleteDraft, getDraft } from "@/actions/draft";

export async function POST(req: Request) {
  console.log("POST request received for scheduling");
  const hasAccess = await checkAccess();
  if (!hasAccess) {
    console.log("Access denied for scheduling request");
    return NextResponse.json({ error: "Not authorized!" }, { status: 401 });
  }

  // Initialize the queue
  const queue = getQueue();

  const body = await req.json();
  const { userId, postId, scheduledTime, documentUrn, name } = body;
  console.log(`Scheduling request for user ${userId}, post ${postId}`);

  const gettingDraft = await getDraft(postId);
  const content = gettingDraft?.data?.content;

  if (!userId || !postId || !content) {
    console.log("Missing required fields for scheduling");
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    // Check if a job already exists for this post
    const existingJobId = await getJobId(userId, postId);
    if (existingJobId) {
      console.log(`Existing job found for post ${postId}: ${existingJobId}`);
      if (!queue) {
        console.log("Queue not found when trying to remove existing job");
        return NextResponse.json(
          {
            success: false,
            message: "Queue not found",
          },
          { status: 500 },
        );
      }
      // If a job exists, remove it
      const existingJob = await queue.getJob(existingJobId);
      if (existingJob) {
        await existingJob.remove();
        console.log(`Removed existing job ${existingJobId} from queue`);
      }
      await deleteJobId(userId, postId);
      console.log(`Deleted job ID ${existingJobId} from Redis`);
    }

    // Check if the draft exists
    let draft = await db
      .select()
      .from(drafts)
      .where(and(eq(drafts.id, postId), eq(drafts.userId, userId)))
      .limit(1);

    if (draft.length === 0) {
      console.log(`Draft not found for post ${postId}, creating new draft`);
      // If draft doesn't exist, create it
      draft = await db
        .insert(drafts)
        .values({
          id: postId,
          userId: userId,
          name: name,
          content: content,
          status: "saved",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      console.log(`New draft created for post ${postId}`);
    }

    const jobData = { userId, postId, content, documentUrn };
    console.log("Job data:", jobData);
    const jobOptions: any = {
      removeOnComplete: true,
      removeOnFail: true,
    };
    const now = new Date();

    if (scheduledTime) {
      const scheduledDate = new Date(scheduledTime);
      if (isNaN(scheduledDate.getTime())) {
        console.log(`Invalid scheduledTime: ${scheduledTime}`);
        return NextResponse.json(
          { error: "Invalid scheduledTime" },
          { status: 400 },
        );
      }

      if (scheduledDate <= now) {
        console.log(`Scheduled time is in the past: ${scheduledTime}`);
        return NextResponse.json(
          { error: "Scheduled time must be in the future" },
          { status: 400 },
        );
      }

      jobOptions.delay = scheduledDate.getTime() - now.getTime();
      console.log(`Job scheduled for ${scheduledDate.toISOString()}`);
    }

    if (!queue) {
      console.log("Queue not found when trying to add new job");
      return NextResponse.json(
        {
          success: false,
          message: "Queue not found",
        },
        { status: 500 },
      );
    }

    // Add a new job to the queue
    const job = await queue.add("post", jobData, jobOptions);
    console.log(`New job added to queue with ID: ${job.id}`);

    // Save the new job ID in Redis
    await saveJobId(userId, postId, job.id || "");
    console.log(
      `Job ID ${job.id} saved in Redis for user ${userId}, post ${postId}`,
    );

    const scheduledFor = jobOptions.delay
      ? new Date(now.getTime() + jobOptions.delay).toISOString()
      : now.toISOString();

    // Update the draft in the database
    const updatedDraft = await db
      .update(drafts)
      .set({
        status: "scheduled",
        content: content,
        documentUrn: documentUrn,
        scheduledFor: scheduledTime ? new Date(scheduledTime) : null,
        updatedAt: new Date(),
      })
      .where(eq(drafts.id, postId))
      .returning();

    if (updatedDraft.length === 0) {
      console.log(`Failed to update draft for post ${postId}`);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update draft",
        },
        { status: 500 },
      );
    }

    console.log(`Draft updated successfully for post ${postId}`);
    return NextResponse.json({
      success: true,
      message: existingJobId
        ? "Post rescheduled successfully!"
        : "Post scheduled successfully!",
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
  console.log("DELETE request received for scheduled post");
  const body = await req.json();
  const { userId, postId } = body;

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

    // Now delete the draft
    const result = await deleteDraft(postId);

    if (result.success) {
      console.log(`Draft deleted successfully for post ${postId}`);
      return NextResponse.json({ message: result.message });
    } else {
      console.log(`Failed to delete draft for post ${postId}`);
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

export async function PUT(req: Request) {
  console.log("PUT request received for updating scheduled post");
  // Initialize the queue
  const queue = getQueue();

  const body = await req.json();
  const { userId, postId, content, scheduledTime, documentUrn, name } = body;

  if (!userId || !postId) {
    console.log("Missing required fields for PUT request");
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const jobId = await getJobId(userId, postId);

  if (!jobId) {
    console.log(`Job not found for user ${userId}, post ${postId}`);
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (!queue) {
    console.log("Queue not found for PUT request");
    return NextResponse.json(
      {
        success: false,
        message: "Queue not found",
      },
      { status: 500 },
    );
  }

  const job = await queue.getJob(jobId);

  if (!job) {
    console.log(`Job ${jobId} not found in queue`);
    return NextResponse.json(
      { error: "Job not found in queue" },
      { status: 404 },
    );
  }

  // Update job data
  let updatedData = { ...job.data, content, documentUrn, name };

  // Update job options
  let updatedOpts = { ...job.opts };
  let scheduledDate: Date | null = null;

  if (scheduledTime) {
    scheduledDate = new Date(scheduledTime);
    if (isNaN(scheduledDate.getTime())) {
      console.log(`Invalid scheduledTime: ${scheduledTime}`);
      return NextResponse.json(
        { error: "Invalid scheduledTime" },
        { status: 400 },
      );
    }

    const now = new Date();
    if (scheduledDate <= now) {
      console.log(`Scheduled time is in the past: ${scheduledTime}`);
      return NextResponse.json(
        { error: "Scheduled time must be in the future" },
        { status: 400 },
      );
    }
    updatedOpts.delay = scheduledDate.getTime() - now.getTime();
    console.log(`Updated scheduled time to ${scheduledDate.toISOString()}`);
  }

  try {
    // Update the draft in the database
    await db
      .update(drafts)
      .set({
        content,
        documentUrn,
        scheduledFor: scheduledDate,
        name,
        updatedAt: new Date(),
      })
      .where(eq(drafts.id, postId));
    console.log(`Updated draft in database for post ${postId}`);

    // Remove the existing job
    await job.remove();
    console.log(`Removed existing job ${jobId} from queue`);

    // Add a new job with updated data and options
    const updatedJob = await queue.add("post", updatedData, updatedOpts);
    console.log(`Added new job ${updatedJob.id} to queue`);

    // Update the job ID in Redis
    await saveJobId(userId, postId, updatedJob.id || "");
    console.log(`Updated job ID in Redis for user ${userId}, post ${postId}`);

    return NextResponse.json({
      message: "Job updated successfully",
      jobId: updatedJob.id,
      scheduledFor: scheduledDate ? scheduledDate.toISOString() : "immediate",
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 },
    );
  }
}
