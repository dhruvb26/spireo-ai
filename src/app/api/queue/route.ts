import { queue } from "@/server/bull/queue";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Get the total number of jobs in the queue
    const jobCounts = await queue.getJobCounts();

    return NextResponse.json({
      queueLength: jobCounts,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch queue information" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // Remove all jobs from the queue
    await queue.obliterate();

    return NextResponse.json({
      message: "Queue cleared successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear queue" },
      { status: 500 },
    );
  }
}
