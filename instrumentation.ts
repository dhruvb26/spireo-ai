//instrumentation.ts
import { env } from "@/env";
export const register = async () => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { Worker } = await import("bullmq");
    const { redisConnection } = await import("./src/server/redisConnection");

    // Create a new worker to process jobs from the queue
    const worker = new Worker(
      "linkedin-posts",
      async (job) => {
        const { userId, postId, content, documentUrn, documentTitle } =
          job.data;

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
            throw new Error(
              `Failed to post to LinkedIn: ${response.statusText}`,
            );
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

    worker.on("completed", async (job) => {
      console.log(`Job completed for ${job.id}`);
    });
    worker.on("failed", async (job, err) => {
      console.error(`${job?.id} has failed with ${err.message}`);
    });
    worker.on("stalled", (str) => {
      console.log(`Job stalled: ${str}`);
    });
  }
};
