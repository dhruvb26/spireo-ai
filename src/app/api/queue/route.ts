"use server";
import { getQueue } from "@/server/bull/queue";
import { NextResponse } from "next/server";
import { checkAccess } from "@/app/actions/user";
import { getJobId, deleteJobId } from "@/server/redis";

export async function GET(req: Request) {
  try {
    // Get the user session
    // const hasAccess = await checkAccess();

    // // Check if the user has access
    // if (!hasAccess) {
    //   return NextResponse.json({ ideas: "Not authorized!" }, { status: 401 });
    // }

    const queue = getQueue();

    if (!queue) {
      return NextResponse.json(
        { error: "Queue not initialized" },
        { status: 500 },
      );
    }

    // Get the total number of jobs in the queue
    const jobCounts = await queue.getJobCounts();
    const activeJobs = await queue.getActive();

    return NextResponse.json({
      queueLength: jobCounts,
      activeJobs: activeJobs.map((job) => job.id),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch queue information" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { action, userId, postId } = body;

  const queue = getQueue();

  if (!queue) {
    return NextResponse.json(
      { error: "Queue not initialized" },
      { status: 500 },
    );
  }

  if (action === "clearAll") {
    try {
      // Pause the queue to stop processing new jobs
      await queue.pause();

      // Get all active jobs
      const activeJobs = await queue.getActive();

      // Pause all active jobs
      for (const job of activeJobs) {
        await deleteJobId(job.data.userId, job.data.postId);
        await job.remove();
      }

      // Obliterate the queue
      await queue.obliterate();

      return NextResponse.json({
        message: "Active jobs paused and queue cleared successfully",
      });
    } catch (error: any) {
      console.log("Failed to clear queue", error.message);
      return NextResponse.json(
        { error: "Failed to clear queue" },
        { status: 500 },
      );
    }
  } else if (action === "removeJob" && userId && postId) {
    try {
      const jobId = await getJobId(userId, postId);
      if (jobId) {
        const job = await queue.getJob(jobId);
        if (job) {
          await job.remove();
        }
        await deleteJobId(userId, postId);
        return NextResponse.json({
          message: "Job removed successfully",
        });
      } else {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }
    } catch (error) {
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
