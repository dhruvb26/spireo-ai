import { redisConnection } from "./bull/queue";

export function getJobKey(userId: string, postId: string): string {
  return `job:${userId}:${postId}`;
}

export async function saveJobId(
  userId: string,
  postId: string,
  jobId: string,
): Promise<void> {
  if (!redisConnection) {
    console.error("No redis connection");
    return;
  }

  const key = getJobKey(userId, postId);
  await redisConnection.set(key, jobId);
}

export async function getJobId(
  userId: string,
  postId: string,
): Promise<string | null> {
  const key = getJobKey(userId, postId);
  if (!redisConnection) {
    console.error("No redis connection");
    return null;
  }
  return await redisConnection.get(key);
}

export async function deleteJobId(
  userId: string,
  postId: string,
): Promise<void> {
  const key = getJobKey(userId, postId);
  if (!redisConnection) {
    console.error("No redis connection");
    return;
  }
  await redisConnection.del(key);
}
