import { NextResponse } from "next/server";
import { getAccessToken, getLinkedInId, checkAccess } from "@/app/actions/user";
import { getServerAuthSession } from "@/server/auth";
import crypto from "crypto";

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

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileType = file.type;

    if (fileType === "video/mp4") {
      // Video upload process
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
        const errorData = await initResponse.json();
        console.error("Initialize upload error:", errorData);
        throw new Error(`LinkedIn API error: ${JSON.stringify(errorData)}`);
      }

      const initData = await initResponse.json();
      const {
        value: { uploadInstructions, video: videoUrn },
      } = initData;

      console.log("Video URN:", videoUrn);
      console.log("Upload Instructions:", uploadInstructions);

      // Split the file into chunks as specified by uploadInstructions
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
          console.error(`Chunk upload failed:`, await uploadResponse.text());
          throw new Error(
            `Upload failed with status: ${uploadResponse.status}`,
          );
        }

        // Extract the ETag from the response headers
        const eTag = uploadResponse.headers.get("ETag");
        if (!eTag) {
          throw new Error("ETag not found in upload response");
        }

        // Remove quotes from ETag if present
        const cleanETag = eTag.replace(/"/g, "");

        // Generate the signed part ID
        const urlParts = uploadUrl.split("?");
        const queryString = urlParts[1];

        // Create a signature using HMAC-SHA256
        const hmac = crypto.createHmac("sha256", accessToken);
        hmac.update(queryString);
        const signature = hmac.digest("base64");

        const signedPartId = `${queryString}&signature=${encodeURIComponent(signature)}`;
        uploadedPartIds.push(signedPartId);

        console.log(
          `Chunk ${uploadedPartIds.length}/${uploadInstructions.length} uploaded successfully`,
        );
        console.log(`Signed Part ID: ${signedPartId}`);
      }

      // Add a delay before finalizing
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Finalize the upload
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

      const finalizeData = await finalizeResponse.json();
      console.log("Finalize upload response:", finalizeData);

      return NextResponse.json(
        {
          success: true,
          message: "Video uploaded successfully",
          videoUrn: videoUrn,
        },
        { status: 200 },
      );
    }

    // Handle other file types or return an error if not supported
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
