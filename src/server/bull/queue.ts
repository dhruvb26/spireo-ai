import { Queue, Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import { env } from "@/env";

export let redis_connection: IORedis | null = null;
let queue: Queue | null = null;
let worker: Worker | null = null;
let queueEvents: QueueEvents | null = null;

const redisOptions = {
  port: 15424,
  host: "redis-15424.c261.us-east-1-4.ec2.cloud.redislabs.com",
  maxRetriesPerRequest: null,
  username: "default",
  password: env.REDIS_CLOUD_PASSWORD,
  retryStrategy: function (times: number) {
    return Math.max(Math.min(Math.exp(times), 20000), 1000);
  },
};

export function initializeQueue() {
  if (queue) return queue;

  redis_connection = new IORedis(redisOptions);

  redis_connection.on("connect", () => {
    console.log("Connected to Redis");
  });

  redis_connection.on("error", (error) => {
    console.error("Failed to connect to Redis", error);
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
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to post to LinkedIn: ${response.statusText}`);
        }

        const result = await response.json();
        await closeConnections();
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

  return queue;
}

initializeQueue();

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

export function getQueue() {
  if (!queue) {
    throw new Error("Queue not initialized");
  }
  return queue;
}

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
