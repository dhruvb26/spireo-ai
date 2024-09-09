import { NextResponse } from "next/server";
import {
  getAccessToken,
  getLinkedInId,
  checkAccess,
  getUserId,
} from "@/actions/user";
import { updateDownloadUrl } from "@/actions/draft";

export type RouteHandlerResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

interface UploadInstruction {
  uploadUrl: string;
  firstByte: number;
  lastByte: number;
}

interface InitializeUploadResponse {
  value: {
    uploadInstructions: UploadInstruction[];
    video: string;
  };
}

interface VideoDetails {
  status: string;
  downloadUrl: string;
}

export async function POST(
  req: Request,
): Promise<
  NextResponse<RouteHandlerResponse<{ videoUrn: string; downloadUrl: string }>>
> {
  try {
    console.log("Starting video upload process");
    await checkAccess();
    const userId = await getUserId();
    const accessToken = await getAccessToken(userId || "");
    const linkedInId = await getLinkedInId(userId || "");
    console.log("User authentication and access token retrieved");

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const postId = formData.get("postId") as string;
    console.log(`Received file upload request for postId: ${postId}`);

    console.log("Initializing upload with LinkedIn API");
    const initResponse = await fetch(
      "https://api.linkedin.com/rest/videos?action=initializeUpload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
          "LinkedIn-Version": "202406",
        },
        body: JSON.stringify({
          initializeUploadRequest: {
            owner: `urn:li:person:${linkedInId}`,
            fileSizeBytes: file.size,
            uploadCaptions: false,
            uploadThumbnail: false,
          },
        }),
      },
    );

    if (!initResponse.ok) {
      console.error("LinkedIn API initialization failed");
      throw new Error(`LinkedIn API error: ${await initResponse.text()}`);
    }

    const {
      value: { uploadInstructions, video: videoUrn },
    } = (await initResponse.json()) as InitializeUploadResponse;
    console.log(`Upload initialized. Video URN: ${videoUrn}`);

    const fileBuffer = await file.arrayBuffer();
    const uploadedPartIds: string[] = [];

    console.log("Starting file chunk uploads");
    for (const { uploadUrl, firstByte, lastByte } of uploadInstructions) {
      const chunk = fileBuffer.slice(firstByte, lastByte + 1);
      console.log(`Uploading chunk: ${firstByte}-${lastByte}`);
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
          "LinkedIn-Version": "202406",
          Authorization: `Bearer ${accessToken}`,
        },
        body: chunk,
      });

      if (!uploadResponse.ok) {
        console.error(`Chunk upload failed: ${firstByte}-${lastByte}`);
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }

      const eTag = uploadResponse.headers.get("ETag");
      if (!eTag) throw new Error("ETag not found in upload response");
      uploadedPartIds.push(eTag.replace(/"/g, ""));
      console.log(`Chunk uploaded successfully: ${firstByte}-${lastByte}`);
    }

    console.log("All chunks uploaded. Waiting before finalizing...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("Finalizing upload");
    const finalizeResponse = await fetch(
      "https://api.linkedin.com/rest/videos?action=finalizeUpload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
          "LinkedIn-Version": "202406",
        },
        body: JSON.stringify({
          finalizeUploadRequest: {
            video: videoUrn,
            uploadToken: "",
            uploadedPartIds: uploadedPartIds,
          },
        }),
      },
    );

    if (!finalizeResponse.ok) {
      console.error("Failed to finalize upload");
      throw new Error(
        `Finalize upload failed with status: ${finalizeResponse.status}`,
      );
    }
    console.log("Upload finalized. Checking video status...");
    let videoDetails;
    let retryCount = 0;
    const maxRetries = 50;
    const retryDelay = 5000; // 5 seconds

    while (retryCount < maxRetries) {
      const videoDetailsResponse = await fetch(
        `https://api.linkedin.com/rest/videos/${encodeURIComponent(videoUrn)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0",
            "LinkedIn-Version": "202406",
          },
        },
      );

      if (!videoDetailsResponse.ok) {
        console.error(`Failed to get video details. Attempt ${retryCount + 1}`);
        throw new Error(
          `Failed to get video details: ${videoDetailsResponse.status}`,
        );
      }

      videoDetails = await videoDetailsResponse.json();
      console.log(
        `Video details response (Attempt ${retryCount + 1}):`,
        JSON.stringify(videoDetails, null, 2),
      );

      if (videoDetails && videoDetails.status === "AVAILABLE") {
        break;
      }

      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    if (!videoDetails || videoDetails.status !== "AVAILABLE") {
      console.error("Video processing not completed after maximum retries");
      throw new Error("Video processing not completed after maximum retries");
    }

    const { downloadUrl } = videoDetails;
    console.log(`Video available. Download URL: ${downloadUrl}`);

    if (postId) {
      console.log(`Updating download URL for postId: ${postId}`);
      await updateDownloadUrl(postId, downloadUrl);
    }

    console.log("Video upload process completed successfully");
    return NextResponse.json({
      success: true,
      data: { videoUrn, downloadUrl },
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
