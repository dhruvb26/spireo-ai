import { Queue, Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import { env } from "@/env";
import { getLinkedInId, getAccessToken } from "@/app/actions/user";
import { updateDraftStatus, saveDraft } from "@/app/actions/draft";

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

      const linkedInId = await getLinkedInId(userId);
      const accessToken = await getAccessToken(userId);

      if (!linkedInId || !accessToken) {
        console.log("Unable to retrieve LinkedIn credentials");
        throw new Error("Unable to retrieve LinkedIn credentials");
      }

      console.log(`User's LinkedIn ID: ${linkedInId}`);
      console.log(`User's LinkedIn access token: ${accessToken}`);

      try {
        await saveDraft(postId, content);

        let urnId = "";
        let mediaType = "NONE";

        if (documentUrn) {
          const parts = documentUrn.split(":");
          urnId = parts[parts.length - 1];

          if (documentUrn.includes(":image:")) {
            mediaType = "IMAGE";
          } else if (documentUrn.includes(":document:")) {
            mediaType = "RICH";
          }
        }

        let postBody: any = {
          author: `urn:li:person:${linkedInId}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: content,
              },
              shareMediaCategory: mediaType,
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        };

        if (mediaType === "IMAGE" || mediaType === "RICH") {
          postBody.specificContent["com.linkedin.ugc.ShareContent"].media = [
            {
              status: "READY",
              media: `urn:li:digitalmediaAsset:${urnId}`,
            },
          ];
        }

        console.log("Posting to LinkedIn:", postBody);

        const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "LinkedIn-Version": "202406",
            Authorization: `Bearer ${accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0",
          },
          body: JSON.stringify(postBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error publishing draft", response.status, errorText);
          throw new Error(`Error publishing draft: ${errorText}`);
        }

        await updateDraftStatus(postId);
        console.log("Draft published successfully");
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
