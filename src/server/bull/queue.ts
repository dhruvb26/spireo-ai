import { Queue, Worker } from "bullmq";
import { redisConnection } from "../redisConnection";
import { env } from "@/env";

let queue: Queue | null = null;
let worker: Worker | null = null;

export function initializeQueue() {
  if (queue) {
    console.log("Reusing existing queue");
    return queue;
  }

  console.log("Creating new queue");

  // Create a queue using the shared connection
  queue = new Queue("linkedin-posts", {
    connection: redisConnection,
  });

  console.log("New queue created");

  // Create a worker to process jobs
  worker = new Worker(
    "linkedin-posts",
    async (job) => {
      const { userId, postId, content, documentUrn, documentTitle } = job.data;

      console.log(`Processing post ${postId} for user ${userId}`);

      try {
        const response = await fetch(
          `${env.NEXT_PUBLIC_BASE_URL}/api/linkedin/post`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              postId,
              content,
              documentUrn,
              documentTitle,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to post to LinkedIn: ${response.statusText}`);
        }

        const result = await response.json();

        console.log("Post published successfully", result);
      } catch (error) {
        console.error("Failed to post:", error);
        throw error; // Re-throw the error to mark the job as failed
      }
    },
    {
      connection: redisConnection,
    },
  );

  console.log("New worker created");

  // Handle completed jobs
  worker.on("completed", (job) => {
    console.log(`Job ${job.id} has completed!`);
  });

  // Handle failed jobs
  worker.on("failed", (job, err) => {
    console.log(`Job ${job?.id} has failed with ${err.message}`);
  });

  return queue;
}

export function getQueue() {
  if (!queue) {
    console.log("Queue not initialized, initializing now");
    return initializeQueue();
  }
  console.log("Returning existing queue");
  return queue;
}

export async function closeConnections() {
  if (worker) {
    await worker.close();
    console.log("Worker closed");
  }
  if (queue) {
    await queue.close();
    console.log("Queue closed");
  }
  console.log("All connections closed");
}

// Make sure to call closeConnections() when your application is shutting down
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing connections...");
  await closeConnections();
  await redisConnection.quit();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Closing connections...");
  await closeConnections();
  await redisConnection.quit();
  process.exit(0);
});
