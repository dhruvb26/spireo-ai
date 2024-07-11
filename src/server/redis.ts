import IORedis from "ioredis";
import { redis_connection } from "./bull/queue";

export function getJobKey(userId: string, postId: string): string {
  return `job:${userId}:${postId}`;
}

export async function saveJobId(
  userId: string,
  postId: string,
  jobId: string,
): Promise<void> {
  const key = getJobKey(userId, postId);
  await redis_connection.set(key, jobId);
}

export async function getJobId(
  userId: string,
  postId: string,
): Promise<string | null> {
  const key = getJobKey(userId, postId);
  return await redis_connection.get(key);
}

export async function deleteJobId(
  userId: string,
  postId: string,
): Promise<void> {
  const key = getJobKey(userId, postId);
  await redis_connection.del(key);
}
