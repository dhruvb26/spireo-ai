"use server";
import { getQueue } from "@/server/bull/queue";
import { NextResponse } from "next/server";
import { getJobId, deleteJobId } from "@/server/redis";

export async function GET(req: Request) {
  const queue = await getQueue();

  if (!queue) {
    return NextResponse.json(
      { error: "Queue not initialized" },
      { status: 500 },
    );
  }

  try {
    const jobCounts = await queue.getJobCounts();
    const delayedJobs = await queue.getDelayed();
    const activeJobs = await queue.getActive();

    return NextResponse.json({
      queueLength: jobCounts,
      delayedJobs: delayedJobs,
      activeJobs: activeJobs,
    });
  } catch (error) {
    console.error("Failed to fetch queue information:", error);
    return NextResponse.json(
      { error: "Failed to fetch queue information" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { action, userId, postId } = body;

  const queue = await getQueue();

  if (!queue) {
    return NextResponse.json(
      { error: "Queue not initialized" },
      { status: 500 },
    );
  }

  if (action === "clearAll") {
    try {
      await queue.pause();
      const activeJobs = await queue.getActive();
      for (const job of activeJobs) {
        await deleteJobId(job.data.userId, job.data.postId);
        await job.remove();
      }
      await queue.obliterate();
      return NextResponse.json({
        message: "Active jobs paused and queue cleared successfully",
      });
    } catch (error: any) {
      console.error("Failed to clear queue:", error.message);
      return NextResponse.json(
        { error: "Failed to clear queue" },
        { status: 500 },
      );
    }
  } else if (action === "removeJob" && userId && postId) {
    try {
      const jobId = await getJobId(userId, postId);
      console.log("jobId from Redis:", jobId);

      if (jobId) {
        const job = await queue.getJob(jobId);
        if (job) {
          await job.remove();
          await deleteJobId(userId, postId);
          return NextResponse.json({
            message: "Job removed successfully",
          });
        } else {
          console.log(`Job with ID ${jobId} not found in queue`);
          // Job not in queue, but ID exists in Redis. Clean up Redis.
          await deleteJobId(userId, postId);
          return NextResponse.json(
            { message: "Job not found in queue, Redis cleaned" },
            { status: 404 },
          );
        }
      } else {
        // If jobId not found in Redis, try to find it directly in the queue
        const allJobs = await queue.getJobs(["active", "waiting", "delayed"]);
        const job = allJobs.find(
          (j) => j.data.userId === userId && j.data.postId === postId,
        );

        if (job) {
          await job.remove();
          return NextResponse.json({
            message: "Job found in queue and removed successfully",
          });
        } else {
          return NextResponse.json(
            { error: "Job not found in Redis or queue" },
            { status: 404 },
          );
        }
      }
    } catch (error) {
      console.error("Failed to remove job:", error);
      return NextResponse.json(
        { error: "Failed to remove job" },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json(
      { error: "Invalid action or missing parameters" },
      { status: 400 },
    );
  }
}
