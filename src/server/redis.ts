import { sharedConnection } from "./redisConnection";

export function getJobKey(userId: string, postId: string): string {
  return `job:${userId}:${postId}`;
}

export async function saveJobId(
  userId: string,
  postId: string,
  jobId: string,
): Promise<void> {
  if (!sharedConnection) {
    console.error("No redis connection");
    return;
  }

  const key = getJobKey(userId, postId);
  await sharedConnection.set(key, jobId);
}

export async function getJobId(
  userId: string,
  postId: string,
): Promise<string | null> {
  const key = getJobKey(userId, postId);
  if (!sharedConnection) {
    console.error("No redis connection");
    return null;
  }
  return await sharedConnection.get(key);
}

export async function deleteJobId(
  userId: string,
  postId: string,
): Promise<void> {
  const key = getJobKey(userId, postId);
  if (!sharedConnection) {
    console.error("No redis connection");
    return;
  }
  await sharedConnection.del(key);
}
