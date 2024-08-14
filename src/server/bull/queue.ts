import { Queue, Worker, QueueEvents, ConnectionOptions } from "bullmq";
import IORedis from "ioredis";
import { env } from "@/env";

export let redisConnection: IORedis | null = null;
let queue: Queue | null = null;
let worker: Worker | null = null;
let queueEvents: QueueEvents | null = null;

const redisOptions: ConnectionOptions = {
  port: 12701,
  host: "redis-12701.c325.us-east-1-4.ec2.cloud.redislabs.com",
  username: "default",
  password: env.REDIS_CLOUD_PASSWORD,
  maxRetriesPerRequest: null,
};

function createClient() {
  if (!redisConnection) {
    redisConnection = new IORedis(redisOptions as any);

    redisConnection.on("error", (error) => {
      console.error("Redis connection error:", error);
    });

    redisConnection.on("connect", () => {
      console.log("Connected to Redis");
    });
  }
  return redisConnection;
}

export function initializeQueue() {
  if (queue) return queue;

  const client = createClient();

  // Create a queue
  queue = new Queue("linkedin-posts", {
    connection: client,
  });

  // Create a worker to process jobs
  worker = new Worker(
    "linkedin-posts",
    async (job) => {
      const { userId, postId, content, documentUrn } = job.data;

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

        console.log("Post published successfully", result);
      } catch (error) {
        console.error("Failed to post:", error);
        throw error; // Re-throw the error to mark the job as failed
      }
    },
    {
      connection: client,
    },
  );

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
    return initializeQueue();
  }
  return queue;
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
  if (redisConnection) {
    await redisConnection.quit();
  }
  console.log("All connections closed");
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
