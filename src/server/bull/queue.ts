import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { env } from "@/env";
import { getLinkedInId, getAccessToken } from "@/app/actions/user";
import { updateDraftStatus } from "@/app/actions/draft";

export const redis_connection = new IORedis({
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
export const queue = new Queue("linkedin-posts", {
  connection: redis_connection,
});

// Create a worker to process jobs
const worker = new Worker(
  "linkedin-posts",
  async (job) => {
    const { userId, postId, content } = job.data;
    const scheduledFor = job.opts.delay
      ? new Date(job.timestamp + job.opts.delay)
      : null;

    console.log(`Scheduled for: ${scheduledFor}`);
    console.log(`Processing post ${postId} for user ${userId}`);
    console.log(`Posting to LinkedIn: ${content}`);

    const linkedInId = await getLinkedInId(userId);

    if (!linkedInId) {
      console.log("User has not connected LinkedIn");
      return;
    }

    console.log(`User's LinkedIn ID: ${linkedInId}`);

    const accessToken = await getAccessToken(userId);

    if (!accessToken) {
      console.log("User has not authorized LinkedIn");
      return;
    }

    console.log(`User's LinkedIn access token: ${accessToken}`);

    // Post to LinkedIn
    try {
      const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "LinkedIn-Version": "202406",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify({
          author: `urn:li:person:${linkedInId}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: content,
              },
              shareMediaCategory: "NONE",
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Error publishing to LinkedIn",
          response.status,
          errorText,
        );
        throw new Error(`LinkedIn API error: ${response.status} ${errorText}`);
      }

      // Update the draft status
      await updateDraftStatus(postId);
    } catch (error) {
      console.error("Failed to post to LinkedIn:", error);
      throw error; // Re-throw the error to mark the job as failed
    }

    console.log("Posted successfully");
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
