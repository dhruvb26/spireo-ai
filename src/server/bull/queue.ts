"use server";

import { Queue } from "bullmq";
import { getRedisConnection } from "../../utils/redis";

let queue: Queue | null = null;

export async function initializeQueue() {
  if (queue) {
    console.log("Reusing existing queue");
    return queue;
  }

  console.log("Creating new queue");

  const redisConnection = await getRedisConnection();
  queue = new Queue("linkedin-posts", {
    connection: redisConnection,
  });

  console.log("New queue created");

  return queue;
}

export async function getQueue() {
  if (!queue) {
    console.log("Queue not initialized, initializing now");
    return await initializeQueue();
  }
  console.log("Returning existing queue");
  return queue;
}

export async function closeConnections() {
  if (queue) {
    await queue.close();
    console.log("Queue closed");
  }
  const redisConnection = await getRedisConnection();
  await redisConnection.quit();
  console.log("Redis connection closed");
  console.log("All connections closed");
}
