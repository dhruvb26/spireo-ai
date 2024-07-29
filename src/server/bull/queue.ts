"server-only";
import { Queue, Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import { env } from "@/env";
import axios from "axios";

export let redis_connection: IORedis | null = null;
let queue: Queue | null = null;
let worker: Worker | null = null;
let queueEvents: QueueEvents | null = null;

export function initializeQueue() {
  redis_connection = new IORedis({
    port: 13219,
    host: "redis-13219.c1.us-west-2-2.ec2.redns.redis-cloud.com",
    maxRetriesPerRequest: null,
    username: "default",
    password: env.REDIS_CLOUD_PASSWORD,
  });

  redis_connection.on("error", (error) => {
    console.error(error);
  });

  redis_connection.on("connect", () => {
    console.log("Connected to Redis");
  });

  // Create a queue
  queue = new Queue("linkedin-posts", {
    connection: redis_connection,
  });

  // Create a worker to process jobs
  worker = new Worker(
    "linkedin-posts",
    async (job) => {
      const { userId, postId, content, documentUrn } = job.data;
      const scheduledFor = job.opts.delay
        ? new Date(job.timestamp + job.opts.delay)
        : null;

      console.log(`Scheduled for: ${scheduledFor}`);
      console.log(`Processing post ${postId} for user ${userId}`);

      try {
        const response = await fetch(`${env.VERCEL_URL}/api/linkedin/post`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            postId,
            content,
            documentUrn,
          }),
        });

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
    { connection: redis_connection },
  );

  // Handle completed jobs
  worker.on("completed", (job) => {
    console.log(`Job ${job.id} has completed!`);
  });

  // Handle failed jobs
  worker.on("failed", (job, err) => {
    console.log(`Job ${job?.id} has failed with ${err.message}`);
  });

  // Create QueueEvents
  queueEvents = new QueueEvents("linkedin-posts", {
    connection: redis_connection,
  });

  queueEvents.on("completed", ({ jobId }) => {
    console.log(`Job ${jobId} has completed`);
  });

  queueEvents.on("failed", ({ jobId, failedReason }) => {
    console.error(`Job ${jobId} has failed with reason ${failedReason}`);
  });
}

export async function closeConnections() {
  if (worker) {
    await worker.close();
  }
  if (queue) {
    await queue.close();
  }
  if (queueEvents) {
    await queueEvents.close();
  }
  if (redis_connection) {
    await redis_connection.quit();
  }
  console.log("All connections closed");
}

// Initialize the queue when the module is imported
initializeQueue();

// Make sure to call closeConnections() when your application is shutting down
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  await closeConnections();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing HTTP server");
  await closeConnections();
  process.exit(0);
});

// Export the queue for use in other parts of your application
export { queue };
