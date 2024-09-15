import { NextResponse } from "next/server";
import { getAccessToken, getLinkedInId, checkAccess } from "@/actions/user";
import { getServerAuthSession } from "@/server/auth";
import { updateDownloadUrl } from "@/actions/draft";
export const maxDuration = 60;

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

    const initResponse = await fetch(
      "https://api.linkedin.com/rest/images?action=initializeUpload",
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
          },
        }),
      },
    );

    if (!initResponse.ok) {
      const errorData = await initResponse.json();
      throw new Error(`LinkedIn API error: ${JSON.stringify(errorData)}`);
    }

    const initData = await initResponse.json();
    const {
      value: { uploadUrl, image: imageUrn },
    } = initData;

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const postId = formData.get("postId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream",
        "LinkedIn-Version": "202406",
        Authorization: `Bearer ${accessToken}`,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed with status: ${uploadResponse.status}`);
    }

    // Poll for image status until it's AVAILABLE
    let imageData;
    let retries = 0;
    const maxRetries = 10;
    const retryInterval = 2000; // 2 seconds

    while (retries < maxRetries) {
      const getImageUrl = `https://api.linkedin.com/rest/images/${imageUrn}`;
      const imageResponse = await fetch(getImageUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "LinkedIn-Version": "202406",
        },
      });

      if (!imageResponse.ok) {
        throw new Error(
          `GET image failed with status: ${imageResponse.status}`,
        );
      }

      imageData = await imageResponse.json();

      if (imageData.status === "AVAILABLE") {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, retryInterval));
      retries++;
    }

    if (!imageData || imageData.status !== "AVAILABLE") {
      throw new Error("Image processing timed out or failed");
    }

    if (postId) {
      await updateDownloadUrl(postId, imageData.downloadUrl);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully",
        imageUrn: imageUrn,
        downloadUrl: imageData.downloadUrl,
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: err.message,
      },
      { status: 500 },
    );
  }
}
