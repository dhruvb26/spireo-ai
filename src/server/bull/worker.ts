import { env } from "@/env";
import { Job } from "bullmq";

export const postWorker = async (job: Job) => {
  const { userId, postId, content, documentUrn, documentTitle } = job.data;

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
      throw new Error(`Failed to post to LinkedIn: ${response.statusText}`);
    }

    const result = await response.json();

    console.log("Post published successfully", result);
  } catch (error) {
    console.error("Failed to post:", error);
    throw error; // Re-throw the error to mark the job as failed
  }
};
