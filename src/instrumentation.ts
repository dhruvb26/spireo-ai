"use server";
export const register = async () => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { Worker } = await import("bullmq");
    const { postWorker } = await import("./server/bull/worker");
    const { getRedisConnection } = await import("./utils/redis");

    const redisConnection = await getRedisConnection();
    // Create a new worker to process jobs from the queue
    const worker = new Worker("linkedin-posts", postWorker, {
      connection: redisConnection,
    });

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
