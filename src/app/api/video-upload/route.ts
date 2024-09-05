import { NextResponse } from "next/server";
import { getAccessToken, getLinkedInId, checkAccess } from "@/actions/user";
import { getServerAuthSession } from "@/server/auth";
import { updateDownloadUrl } from "@/actions/draft";

export async function POST(req: Request) {
  try {
    const hasAccess = await checkAccess();
    if (!hasAccess) {
      return NextResponse.json({ error: "Not authorized!" }, { status: 401 });
    }

    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Not authorized!" }, { status: 401 });
    }

    const userId = session.user.id;
    const accessToken = await getAccessToken(userId);
    const linkedInId = await getLinkedInId(userId);

    if (!accessToken || !linkedInId) {
      return NextResponse.json(
        { error: "Missing access token or LinkedIn ID" },
        { status: 400 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const postId = formData.get("postId") as string;

    console.log("Post ID:", postId);

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Initialize Upload for Video
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
      const errorData = await initResponse.text();
      console.error("Initialize upload error:", errorData);
      throw new Error(`LinkedIn API error: ${errorData}`);
    }

    const initData = await initResponse.json();
    const {
      value: { uploadInstructions, video: videoUrn },
    } = initData;

    console.log("Video URN:", videoUrn);
    console.log("Upload Instructions:", uploadInstructions);

    // 2 & 3. Split the file into chunks and Upload the Video
    const fileBuffer = await file.arrayBuffer();
    const uploadedPartIds: string[] = [];

    for (const instruction of uploadInstructions) {
      const { uploadUrl, firstByte, lastByte } = instruction;
      const chunk = fileBuffer.slice(firstByte, lastByte + 1);

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
        const errorText = await uploadResponse.text();
        console.error(`Chunk upload failed:`, errorText);
        throw new Error(
          `Upload failed with status: ${uploadResponse.status}. Error: ${errorText}`,
        );
      }

      // Extract the ETag from the response headers
      const eTag = uploadResponse.headers.get("ETag");
      if (!eTag) {
        throw new Error("ETag not found in upload response");
      }

      // Remove quotes from ETag if present
      const cleanETag = eTag.replace(/"/g, "");
      uploadedPartIds.push(cleanETag);

      console.log(
        `Chunk ${uploadedPartIds.length}/${uploadInstructions.length} uploaded successfully`,
      );
      console.log(`ETag: ${cleanETag}`);
    }

    // Add a delay before finalizing
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // 4. Finalize Video Upload
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
      const errorBody = await finalizeResponse.text();
      console.error("Finalize upload error response:", errorBody);
      throw new Error(
        `Finalize upload failed with status: ${finalizeResponse.status}. Response: ${errorBody}`,
      );
    }

    console.log("Finalize upload successful. Status:", finalizeResponse.status);
    // Poll for video status until it's AVAILABLE
    let videoDetails;
    let retries = 0;
    const maxRetries = 30;
    const retryInterval = 2000; // 2 seconds

    while (retries < maxRetries) {
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

      console.log(
        `Video details response status: ${videoDetailsResponse.status}`,
      );

      if (!videoDetailsResponse.ok) {
        const errorBody = await videoDetailsResponse.text();
        console.error("Video details error response:", errorBody);

        let errorMessage = `Failed to get video details: ${videoDetailsResponse.status}`;

        if (videoDetailsResponse.status === 400) {
          if (errorBody.includes("INVALID_VIDEO_ID")) {
            errorMessage = "This Video ID is invalid";
          } else if (errorBody.includes("INVALID_CALL_TO_ACTION")) {
            errorMessage = "Invalid Call To Action";
          } else if (errorBody.includes("INVALID_URL")) {
            errorMessage = "Invalid URL";
          } else if (errorBody.includes("INVALID_URN_TYPE")) {
            errorMessage = "Invalid URN Type";
          } else if (errorBody.includes("EXPIRED_UPLOAD_URL")) {
            errorMessage = "The Video upload Url is expired";
          } else if (errorBody.includes("INVALID_URN_ID")) {
            errorMessage = "This URN Id is invalid";
          } else if (errorBody.includes("MEDIA_ASSET_PROCESSING_FAILED")) {
            errorMessage = "Media asset failed processing";
          } else if (errorBody.includes("MEDIA_ASSET_WAITING_UPLOAD")) {
            errorMessage = "Media asset is waiting upload";
          } else if (errorBody.includes("UPDATING_ASSET_FAILED")) {
            errorMessage =
              "Failed to update asset. Please recreate the asset and try again.";
          }
        } else if (videoDetailsResponse.status === 404) {
          errorMessage = "Could not find entity";
        }

        throw new Error(errorMessage);
      }

      videoDetails = await videoDetailsResponse.json();

      if (videoDetails.status === "AVAILABLE") {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, retryInterval));
      retries++;
    }

    if (!videoDetails || videoDetails.status !== "AVAILABLE") {
      throw new Error("Video processing timed out or failed");
    }

    const {
      downloadUrl,
      status,
      duration,
      aspectRatioWidth,
      aspectRatioHeight,
    } = videoDetails;

    if (postId) {
      await updateDownloadUrl(postId, downloadUrl);
    }
    return NextResponse.json(
      {
        success: true,
        message: "Video uploaded and processed successfully",
        videoUrn: videoUrn,
        downloadUrl: downloadUrl,
        // status: status,
        // duration: duration,
        // aspectRatio: `${aspectRatioWidth}:${aspectRatioHeight}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
