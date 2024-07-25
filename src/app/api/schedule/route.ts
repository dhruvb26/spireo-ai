"use server";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { drafts } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { queue } from "@/server/bull/queue";
import { saveJobId } from "@/server/redis";
import { getJobId, deleteJobId } from "@/server/redis";
import { checkAccess } from "@/app/actions/user";
import { deleteDraft } from "@/app/actions/draft";

export async function POST(req: Request) {
  const hasAccess = await checkAccess();
  if (!hasAccess) {
    return NextResponse.json({ error: "Not authorized!" }, { status: 401 });
  }

  const body = await req.json();
  const { userId, postId, content, scheduledTime, documentUrn } = body;

  if (!userId || !postId || !content) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    // Check if a job already exists for this post
    const existingJobId = await getJobId(userId, postId);
    if (existingJobId) {
      // If a job exists, remove it
      const existingJob = await queue.getJob(existingJobId);
      if (existingJob) {
        await existingJob.remove();
      }
      await deleteJobId(userId, postId);
    }

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

    const jobData = { userId, postId, content, documentUrn };
    console.log("Job data:", jobData);
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
    }

    // Add a new job to the queue
    const job = await queue.add("post", jobData, jobOptions);

    // Save the new job ID in Redis
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
        documentUrn: documentUrn, // Add this line
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
  const body = await req.json();
  const { userId, postId } = body;

  if (!userId || !postId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const result = await deleteDraft(postId);

  if (result.success) {
    return NextResponse.json({ message: result.message });
  } else {
    return NextResponse.json({ error: result.message }, { status: 404 });
  }
}
export async function PUT(req: Request) {
  const body = await req.json();
  const { userId, postId, content, scheduledTime, documentUrn } = body;

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
  let updatedData = { ...job.data, content, documentUrn };

  // Update job options
  let updatedOpts = { ...job.opts };
  let scheduledDate: Date | null = null;

  if (scheduledTime) {
    scheduledDate = new Date(scheduledTime);
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
    }
    updatedOpts.delay = scheduledDate.getTime() - now.getTime();
  }

  try {
    // Update the draft in the database
    await db
      .update(drafts)
      .set({
        content,
        documentUrn,
        scheduledFor: scheduledDate,
        updatedAt: new Date(),
      })
      .where(eq(drafts.id, postId));

    // Remove the existing job
    await job.remove();

    // Add a new job with updated data and options
    const updatedJob = await queue.add("post", updatedData, updatedOpts);

    // Update the job ID in Redis
    await saveJobId(userId, postId, updatedJob.id || "");

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
