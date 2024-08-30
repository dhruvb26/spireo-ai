import { Queue, Worker } from "bullmq";
import { redisConnection } from "../redisConnection";
import { env } from "@/env";

let queue: Queue | null = null;
// let worker: Worker | null = null;

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
  // if (worker) {
  //   await worker.close();
  //   console.log("Worker closed");
  // }
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
